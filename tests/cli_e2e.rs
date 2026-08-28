use photo_exit_manifest::PolicySet;
use std::fs;
use std::path::Path;
use std::process::Command;
use tempfile::tempdir;

#[test]
fn claim_demo_isolation_runs_bundled_sample_only_in_its_workspace() {
    let sandbox = tempdir().unwrap();
    let untouched = sandbox.path().join("real-family-archive");
    fs::create_dir(&untouched).unwrap();
    fs::write(untouched.join("do-not-touch.jpg"), b"real archive sentinel").unwrap();
    let before = fs::read(untouched.join("do-not-touch.jpg")).unwrap();
    let demo_root = sandbox.path().join("isolated-demo");

    let demo = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .args(["demo", "--output"])
        .arg(&demo_root)
        .arg("--json")
        .output()
        .unwrap();
    assert_eq!(
        demo.status.code(),
        Some(0),
        "{}",
        String::from_utf8_lossy(&demo.stderr)
    );
    let status: serde_json::Value = serde_json::from_slice(&demo.stdout).unwrap();
    let output = status["output"].as_str().unwrap();
    assert!(Path::new(output).starts_with(&demo_root));
    assert_eq!(status["status"], "ready_for_cutover");
    assert_eq!(status["accounted_percent"], 100.0);
    assert_eq!(
        fs::read(untouched.join("do-not-touch.jpg")).unwrap(),
        before
    );

    let audit: serde_json::Value =
        serde_json::from_slice(&fs::read(demo_root.join("migration-report/audit.json")).unwrap())
            .unwrap();
    assert_eq!(audit["source_assets"], 6);
    assert_eq!(audit["matched_assets"], 5);
    assert_eq!(audit["excepted_assets"], 1);
    assert_eq!(audit["ready"], true);
    for name in [
        "source-inventory.json",
        "destination-inventory.json",
        "audit.json",
        "manifest.json",
        "CUTOVER.md",
    ] {
        assert!(demo_root.join("migration-report").join(name).is_file());
    }
}

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

#[test]
fn album_gaps_hold_a_signed_run_until_reviewed_by_name() {
    let workspace = tempdir().unwrap();
    let takeout = workspace.path().join("takeout/Google Photos");
    let destination = workspace.path().join("archive");
    fs::create_dir_all(takeout.join("Family Album")).unwrap();
    fs::create_dir_all(takeout.join("Second Album")).unwrap();
    fs::create_dir_all(takeout.join("Photos from 2024")).unwrap();
    fs::create_dir_all(&destination).unwrap();
    fs::write(
        takeout.join("Family Album/family.jpg"),
        b"family photo bytes",
    )
    .unwrap();
    fs::write(
        takeout.join("Second Album/family.jpg"),
        b"family photo bytes",
    )
    .unwrap();
    fs::write(
        takeout.join("Photos from 2024/missing.mp4"),
        b"missing video",
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

    let exceptions = workspace.path().join("exceptions.json");
    fs::write(
        &exceptions,
        serde_json::to_vec_pretty(&serde_json::json!({
            "exceptions": [{
                "source_path": "Google Photos/Photos from 2024/missing.mp4",
                "reason": "The original recording is retained on tape while it is recovered."
            }]
        }))
        .unwrap(),
    )
    .unwrap();
    let out = workspace.path().join("result");
    let held = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .args(["run", "--source"])
        .arg(workspace.path().join("takeout"))
        .arg("--destination")
        .arg(&destination)
        .arg("--policies")
        .arg(&policies)
        .arg("--exceptions")
        .arg(&exceptions)
        .arg("--out")
        .arg(&out)
        .args(["--sign", "Test Family", "--json"])
        .output()
        .unwrap();
    assert_eq!(held.status.code(), Some(2));
    assert_eq!(
        serde_json::from_slice::<serde_json::Value>(&held.stdout).unwrap()["status"],
        "hold"
    );
    let audit: serde_json::Value =
        serde_json::from_slice(&fs::read(out.join("audit.json")).unwrap()).unwrap();
    assert_eq!(audit["ready"], false);
    assert_eq!(
        audit["unresolved_source_albums_missing_at_destination"],
        serde_json::json!(["Family Album", "Second Album"])
    );
    let held_cutover = fs::read_to_string(out.join("CUTOVER.md")).unwrap();
    assert!(held_cutover.contains("Unresolved album labels (block cutover)"));

    fs::write(
        &exceptions,
        serde_json::to_vec_pretty(&serde_json::json!({
            "exceptions": [{
                "source_path": "Google Photos/Photos from 2024/missing.mp4",
                "reason": "The original recording is retained on tape while it is recovered."
            }],
            "album_exceptions": [
                {"album": "Family Album", "reason": "Reviewer recreated this label in the archive catalog."},
                {"album": "Second Album", "reason": "Reviewer recorded the duplicate membership in the archive catalog."}
            ]
        }))
        .unwrap(),
    )
    .unwrap();
    let ready = Command::new(env!("CARGO_BIN_EXE_photo-exit-manifest"))
        .args(["run", "--source"])
        .arg(workspace.path().join("takeout"))
        .arg("--destination")
        .arg(&destination)
        .arg("--policies")
        .arg(&policies)
        .arg("--exceptions")
        .arg(&exceptions)
        .arg("--out")
        .arg(&out)
        .args(["--sign", "Test Family", "--force", "--json"])
        .output()
        .unwrap();
    assert_eq!(ready.status.code(), Some(0));
    assert_eq!(
        serde_json::from_slice::<serde_json::Value>(&ready.stdout).unwrap()["status"],
        "ready_for_cutover"
    );
    let manifest: serde_json::Value =
        serde_json::from_slice(&fs::read(out.join("manifest.json")).unwrap()).unwrap();
    assert_eq!(
        manifest["audit"]["album_exceptions"]
            .as_array()
            .unwrap()
            .len(),
        2
    );
    assert!(fs::read_to_string(out.join("CUTOVER.md"))
        .unwrap()
        .contains("Reviewed album exceptions:"));
}
