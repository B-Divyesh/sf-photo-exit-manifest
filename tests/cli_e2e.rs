use photo_exit_manifest::PolicySet;
use std::fs;
use std::process::Command;
use tempfile::tempdir;

#[test]
fn documented_run_writes_a_signed_ready_manifest() {
    let workspace = tempdir().unwrap();
    let source = workspace
        .path()
        .join("takeout/Google Photos/Photos from 2024");
    let destination = workspace.path().join("archive/2024");
    fs::create_dir_all(&source).unwrap();
    fs::create_dir_all(&destination).unwrap();
    fs::write(source.join("family.jpg"), b"family photo bytes").unwrap();
    fs::write(
        source.join("family.jpg.json"),
        br#"{"title":"family.jpg","photoTakenTime":{"timestamp":"1704067200"}}"#,
    )
    .unwrap();
    fs::write(destination.join("family.jpg"), b"family photo bytes").unwrap();

    let policies = workspace.path().join("policies.json");
    let init = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .args(["init", "--output"])
        .arg(&policies)
        .status()
        .unwrap();
    assert!(init.success());
    let mut configured: PolicySet = serde_json::from_slice(&fs::read(&policies).unwrap()).unwrap();
    configured.independent_second_copy = true;
    fs::write(&policies, serde_json::to_vec_pretty(&configured).unwrap()).unwrap();

    let out = workspace.path().join("result");
    let run = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .arg("run")
        .arg("--source")
        .arg(workspace.path().join("takeout"))
        .arg("--destination")
        .arg(workspace.path().join("archive"))
        .arg("--policies")
        .arg(&policies)
        .arg("--out")
        .arg(&out)
        .arg("--sign")
        .arg("Test Family")
        .arg("--json")
        .output()
        .unwrap();
    assert_eq!(
        run.status.code(),
        Some(0),
        "{}",
        String::from_utf8_lossy(&run.stderr)
    );
    let stdout: serde_json::Value = serde_json::from_slice(&run.stdout).unwrap();
    assert_eq!(stdout["status"], "ready_for_cutover");
    let markdown = fs::read_to_string(out.join("CUTOVER.md")).unwrap();
    assert!(markdown.contains("Status: READY"));
    assert!(markdown.contains("Signed by **Test Family**"));
    for name in [
        "source-inventory.json",
        "destination-inventory.json",
        "audit.json",
        "manifest.json",
    ] {
        assert!(out.join(name).is_file(), "missing {name}");
    }
}

#[test]
fn an_empty_scan_is_an_actionable_error() {
    let workspace = tempdir().unwrap();
    let empty = workspace.path().join("empty");
    fs::create_dir(&empty).unwrap();
    let output = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .arg("inventory")
        .arg(&empty)
        .arg("--output")
        .arg(workspace.path().join("inventory.json"))
        .output()
        .unwrap();
    assert_eq!(output.status.code(), Some(1));
    assert!(String::from_utf8_lossy(&output.stderr).contains("no supported photo or video assets"));
}
