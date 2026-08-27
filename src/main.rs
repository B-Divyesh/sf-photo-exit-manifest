use anyhow::Result;
use clap::{Parser, Subcommand, ValueEnum};
use photo_exit_manifest::{
    build_manifest, compare, ensure_output_outside, inventory, policy_template, read_json,
    render_manifest, write_json, write_text, Audit, ExceptionFile, HashMode, Inventory,
    InventoryKind, PolicySet,
};
use serde::Serialize;
use std::path::{Path, PathBuf};

#[derive(Parser)]
#[command(
    name = "photo-exit-manifest",
    version,
    about = "Verify a family photo migration before leaving the old cloud",
    long_about = "Inventories a photo export and independent archive, compares evidence, records device behavior, and writes a signed cutover manifest. Read-only: never transfers, edits, or deletes photos."
)]
struct Cli {
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Write a safe, documented device-policy template
    Init {
        #[arg(short, long, default_value = "policies.json")]
        output: PathBuf,
        #[arg(long)]
        force: bool,
        #[arg(long)]
        json: bool,
    },
    /// Read a Takeout or ordinary folder and write a portable inventory
    Inventory {
        /// Folder to scan (it is never modified)
        path: PathBuf,
        #[arg(long, value_enum, default_value = "folder")]
        kind: KindArg,
        #[arg(long, value_enum, default_value = "sha256")]
        hash: HashArg,
        #[arg(short, long)]
        output: PathBuf,
        #[arg(long)]
        force: bool,
        #[arg(long)]
        json: bool,
    },
    /// Compare two previously generated inventories
    Compare {
        #[arg(long)]
        source: PathBuf,
        #[arg(long)]
        destination: PathBuf,
        #[arg(long)]
        exceptions: Option<PathBuf>,
        #[arg(short, long)]
        output: PathBuf,
        #[arg(long)]
        force: bool,
        #[arg(long)]
        json: bool,
    },
    /// Turn an audit and device policies into a reviewable cutover document
    Manifest {
        #[arg(long)]
        audit: PathBuf,
        #[arg(long)]
        policies: PathBuf,
        #[arg(short, long, default_value = "CUTOVER.md")]
        output: PathBuf,
        /// Name to record only after reviewing the checklist
        #[arg(long)]
        sign: Option<String>,
        #[arg(long)]
        force: bool,
        #[arg(long)]
        json: bool,
    },
    /// Inventory, compare, and write the complete manifest in one pass
    Run {
        #[arg(long)]
        source: PathBuf,
        #[arg(long)]
        destination: PathBuf,
        #[arg(long)]
        policies: PathBuf,
        #[arg(long)]
        exceptions: Option<PathBuf>,
        #[arg(long, value_enum, default_value = "takeout")]
        source_kind: KindArg,
        #[arg(long, value_enum, default_value = "folder")]
        destination_kind: KindArg,
        #[arg(long, value_enum, default_value = "sha256")]
        hash: HashArg,
        #[arg(long, default_value = "exit-manifest")]
        out: PathBuf,
        #[arg(long)]
        sign: Option<String>,
        #[arg(long)]
        force: bool,
        #[arg(long)]
        json: bool,
    },
}

#[derive(Clone, Copy, ValueEnum)]
enum KindArg {
    Takeout,
    Folder,
}

#[derive(Clone, Copy, ValueEnum)]
enum HashArg {
    Sha256,
    None,
}

impl From<KindArg> for InventoryKind {
    fn from(value: KindArg) -> Self {
        match value {
            KindArg::Takeout => Self::Takeout,
            KindArg::Folder => Self::Folder,
        }
    }
}

impl From<HashArg> for HashMode {
    fn from(value: HashArg) -> Self {
        match value {
            HashArg::Sha256 => Self::Sha256,
            HashArg::None => Self::None,
        }
    }
}

#[derive(Serialize)]
struct Status<'a> {
    status: &'a str,
    output: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    accounted_percent: Option<f64>,
}

fn report(json: bool, status: Status<'_>) {
    if json {
        println!(
            "{}",
            serde_json::to_string(&status).expect("status serializes")
        );
    } else {
        println!("{}: {}", status.status, status.output);
    }
}

fn empty_exceptions(path: Option<&Path>) -> Result<ExceptionFile> {
    path.map(read_json)
        .transpose()
        .map(|value| value.unwrap_or_default())
}

fn run() -> Result<u8> {
    match Cli::parse().command {
        Command::Init {
            output,
            force,
            json,
        } => {
            write_json(&output, &policy_template(), force)?;
            report(
                json,
                Status {
                    status: "policy_template_written",
                    output: output.display().to_string(),
                    accounted_percent: None,
                },
            );
            Ok(0)
        }
        Command::Inventory {
            path,
            kind,
            hash,
            output,
            force,
            json,
        } => {
            ensure_output_outside(&output, &[&path])?;
            let result = inventory(&path, kind.into(), hash.into())?;
            write_json(&output, &result, force)?;
            report(
                json,
                Status {
                    status: "inventory_written",
                    output: output.display().to_string(),
                    accounted_percent: None,
                },
            );
            Ok(0)
        }
        Command::Compare {
            source,
            destination,
            exceptions,
            output,
            force,
            json,
        } => {
            let source_inventory: Inventory = read_json(&source)?;
            let destination_inventory: Inventory = read_json(&destination)?;
            let exception_file = empty_exceptions(exceptions.as_deref())?;
            let audit = compare(&source_inventory, &destination_inventory, &exception_file);
            write_json(&output, &audit, force)?;
            let status = if audit.ready { "ready" } else { "hold" };
            report(
                json,
                Status {
                    status,
                    output: output.display().to_string(),
                    accounted_percent: Some(audit.accounted_percent),
                },
            );
            Ok(if audit.ready { 0 } else { 2 })
        }
        Command::Manifest {
            audit,
            policies,
            output,
            sign,
            force,
            json,
        } => {
            let audit: Audit = read_json(&audit)?;
            let policies: PolicySet = read_json(&policies)?;
            let manifest = build_manifest(&audit, policies, sign);
            write_text(&output, &render_manifest(&manifest, &audit), force)?;
            let json_path = output.with_file_name("manifest.json");
            write_json(&json_path, &manifest, force)?;
            let ready = manifest.status == "ready_for_cutover";
            report(
                json,
                Status {
                    status: if ready { "ready_for_cutover" } else { "hold" },
                    output: output.display().to_string(),
                    accounted_percent: Some(audit.accounted_percent),
                },
            );
            Ok(if ready { 0 } else { 2 })
        }
        Command::Run {
            source,
            destination,
            policies,
            exceptions,
            source_kind,
            destination_kind,
            hash,
            out,
            sign,
            force,
            json,
        } => {
            ensure_output_outside(&out, &[&source, &destination])?;
            let source_inventory = inventory(&source, source_kind.into(), hash.into())?;
            let destination_inventory =
                inventory(&destination, destination_kind.into(), hash.into())?;
            let policy_set: PolicySet = read_json(&policies)?;
            let exception_file = empty_exceptions(exceptions.as_deref())?;
            let audit = compare(&source_inventory, &destination_inventory, &exception_file);
            let manifest = build_manifest(&audit, policy_set, sign);
            let outputs = [
                "source-inventory.json",
                "destination-inventory.json",
                "audit.json",
                "manifest.json",
                "CUTOVER.md",
            ];
            if !force {
                for name in outputs {
                    let path = out.join(name);
                    if path.exists() {
                        anyhow::bail!(
                            "output already exists: {} (use --force to replace the run outputs)",
                            path.display()
                        );
                    }
                }
            }
            write_json(&out.join("source-inventory.json"), &source_inventory, force)?;
            write_json(
                &out.join("destination-inventory.json"),
                &destination_inventory,
                force,
            )?;
            write_json(&out.join("audit.json"), &audit, force)?;
            write_json(&out.join("manifest.json"), &manifest, force)?;
            write_text(
                &out.join("CUTOVER.md"),
                &render_manifest(&manifest, &audit),
                force,
            )?;
            let ready = manifest.status == "ready_for_cutover";
            report(
                json,
                Status {
                    status: if ready { "ready_for_cutover" } else { "hold" },
                    output: out.display().to_string(),
                    accounted_percent: Some(audit.accounted_percent),
                },
            );
            Ok(if ready { 0 } else { 2 })
        }
    }
}

fn main() {
    match run() {
        Ok(code) => std::process::exit(code.into()),
        Err(error) => {
            eprintln!("error: {error:#}");
            std::process::exit(1);
        }
    }
}
