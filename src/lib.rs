use anyhow::{bail, Context, Result};
use chrono::{TimeZone, Utc};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};
use std::fs::{self, File};
use std::io::{BufReader, Read};
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Clone, Copy, Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum InventoryKind {
    Takeout,
    Folder,
}

#[derive(Clone, Copy, Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum HashMode {
    Sha256,
    None,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
pub struct Asset {
    pub relative_path: String,
    pub file_name: String,
    pub bytes: u64,
    pub sha256: Option<String>,
    pub captured_at: Option<String>,
    pub albums: Vec<String>,
    pub aliases: Vec<String>,
    pub edited_version: bool,
    pub sidecar_found: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Inventory {
    pub schema_version: u8,
    pub tool_version: String,
    pub generated_at: String,
    pub root_label: String,
    pub kind: InventoryKind,
    pub hash_mode: HashMode,
    pub physical_asset_count: usize,
    pub unique_asset_count: usize,
    pub total_bytes: u64,
    pub assets: Vec<Asset>,
    pub warnings: Vec<String>,
}

#[derive(Clone, Debug, Default, Deserialize, Serialize)]
pub struct ExceptionFile {
    #[serde(default)]
    pub exceptions: Vec<NamedException>,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
pub struct NamedException {
    pub source_path: String,
    pub reason: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct MatchRecord {
    pub source_path: String,
    pub destination_path: String,
    pub method: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Audit {
    pub schema_version: u8,
    pub tool_version: String,
    pub generated_at: String,
    pub source_assets: usize,
    pub destination_assets: usize,
    pub matched_assets: usize,
    pub excepted_assets: usize,
    pub accounted_assets: usize,
    pub accounted_percent: f64,
    pub ready: bool,
    pub evidence_level: String,
    pub matches: Vec<MatchRecord>,
    pub missing: Vec<String>,
    pub extra_destination: Vec<String>,
    pub exceptions: Vec<NamedException>,
    pub source_albums_missing_at_destination: Vec<String>,
    pub warnings: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct PolicySet {
    pub household: String,
    pub archive_label: String,
    pub original_cloud_retention_days: u32,
    pub independent_second_copy: bool,
    pub devices: Vec<DevicePolicy>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct DevicePolicy {
    pub name: String,
    pub owner: String,
    pub backup_mode: BackupMode,
    pub deletion_behavior: DeletionBehavior,
    pub conflict_policy: ConflictPolicy,
    pub offline_behavior: OfflineBehavior,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum BackupMode {
    Backup,
    Mirror,
    Manual,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum DeletionBehavior {
    KeepInArchive,
    ManualReview,
    MirrorAfterThirtyDays,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum ConflictPolicy {
    KeepBoth,
    NewestWins,
    DeviceWins,
    ArchiveWins,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum OfflineBehavior {
    QueueUntilOnline,
    ManualRetry,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct SignedManifest {
    pub schema_version: u8,
    pub tool_version: String,
    pub generated_at: String,
    pub status: String,
    pub signed_by: Option<String>,
    pub signed_at: Option<String>,
    pub audit: AuditSummary,
    pub policies: PolicySet,
    pub policy_warnings: Vec<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct AuditSummary {
    pub source_assets: usize,
    pub matched_assets: usize,
    pub excepted_assets: usize,
    pub accounted_percent: f64,
    pub evidence_level: String,
}

fn now() -> String {
    Utc::now().to_rfc3339()
}

fn supported_extension(path: &Path) -> bool {
    matches!(
        path.extension()
            .and_then(|value| value.to_str())
            .unwrap_or_default()
            .to_ascii_lowercase()
            .as_str(),
        "jpg"
            | "jpeg"
            | "png"
            | "gif"
            | "webp"
            | "avif"
            | "heic"
            | "heif"
            | "tif"
            | "tiff"
            | "bmp"
            | "dng"
            | "raw"
            | "cr2"
            | "cr3"
            | "nef"
            | "arw"
            | "orf"
            | "rw2"
            | "raf"
            | "mov"
            | "mp4"
            | "m4v"
            | "avi"
            | "mts"
            | "m2ts"
            | "3gp"
            | "webm"
            | "mkv"
    )
}

fn portable_relative(root: &Path, path: &Path) -> String {
    path.strip_prefix(root)
        .unwrap_or(path)
        .components()
        .map(|part| part.as_os_str().to_string_lossy())
        .collect::<Vec<_>>()
        .join("/")
}

fn sha256(path: &Path) -> Result<String> {
    let file = File::open(path).with_context(|| format!("cannot open {}", path.display()))?;
    let mut reader = BufReader::new(file);
    let mut digest = Sha256::new();
    let mut buffer = [0_u8; 1024 * 128];
    loop {
        let read = reader
            .read(&mut buffer)
            .with_context(|| format!("cannot read {}", path.display()))?;
        if read == 0 {
            break;
        }
        digest.update(&buffer[..read]);
    }
    Ok(format!("{:x}", digest.finalize()))
}

#[derive(Default)]
struct SidecarData {
    captured_at: Option<String>,
    title: Option<String>,
}

fn timestamp_to_rfc3339(value: &serde_json::Value) -> Option<String> {
    let raw = value
        .get("timestamp")
        .and_then(|value| value.as_str())
        .and_then(|value| value.parse::<i64>().ok());
    raw.and_then(|seconds| Utc.timestamp_opt(seconds, 0).single())
        .map(|date| date.to_rfc3339())
        .or_else(|| {
            value
                .get("formatted")
                .and_then(|value| value.as_str())
                .map(str::to_owned)
        })
}

fn parse_sidecar(path: &Path) -> Result<SidecarData> {
    let value: serde_json::Value = serde_json::from_reader(
        File::open(path).with_context(|| format!("cannot open sidecar {}", path.display()))?,
    )
    .with_context(|| format!("cannot parse sidecar {}", path.display()))?;
    let captured_at = value
        .get("photoTakenTime")
        .and_then(timestamp_to_rfc3339)
        .or_else(|| value.get("creationTime").and_then(timestamp_to_rfc3339));
    Ok(SidecarData {
        captured_at,
        title: value
            .get("title")
            .and_then(|value| value.as_str())
            .map(str::to_owned),
    })
}

fn sidecar_candidates(asset: &Path) -> Vec<PathBuf> {
    let mut candidates = Vec::new();
    if let Some(name) = asset.file_name().and_then(|value| value.to_str()) {
        candidates.push(asset.with_file_name(format!("{name}.json")));
        candidates.push(asset.with_file_name(format!("{name}.supplemental-metadata.json")));
    }
    candidates.push(asset.with_extension("json"));
    candidates
}

fn album_for(root: &Path, asset: &Path, kind: InventoryKind) -> Vec<String> {
    let parent = asset.parent().unwrap_or(root);
    let relative = portable_relative(root, parent);
    if relative.is_empty() || relative == "." {
        return Vec::new();
    }
    let mut parts: Vec<String> = relative.split('/').map(str::to_owned).collect();
    if kind == InventoryKind::Takeout {
        parts.retain(|part| {
            let lower = part.to_ascii_lowercase();
            lower != "takeout" && lower != "google photos" && !lower.starts_with("photos from ")
        });
    }
    parts.last().cloned().into_iter().collect()
}

pub fn inventory(root: &Path, kind: InventoryKind, hash_mode: HashMode) -> Result<Inventory> {
    if !root.exists() {
        bail!("input path does not exist: {}", root.display());
    }
    if !root.is_dir() {
        bail!("input path is not a directory: {}", root.display());
    }

    let mut assets = Vec::new();
    let mut warnings = Vec::new();
    let mut sidecar_index: HashMap<(PathBuf, String), PathBuf> = HashMap::new();
    if kind == InventoryKind::Takeout {
        for entry in WalkDir::new(root)
            .follow_links(false)
            .into_iter()
            .filter_map(Result::ok)
        {
            let path = entry.path();
            if entry.file_type().is_file()
                && path
                    .extension()
                    .and_then(|v| v.to_str())
                    .is_some_and(|v| v.eq_ignore_ascii_case("json"))
            {
                match parse_sidecar(path) {
                    Ok(data) => {
                        if let (Some(parent), Some(title)) = (path.parent(), data.title) {
                            sidecar_index.insert(
                                (parent.to_path_buf(), title.to_ascii_lowercase()),
                                path.to_path_buf(),
                            );
                        }
                    }
                    Err(error) => warnings.push(error.to_string()),
                }
            }
        }
    }

    for entry in WalkDir::new(root).follow_links(false) {
        let entry = match entry {
            Ok(entry) => entry,
            Err(error) => {
                warnings.push(format!("could not inspect an entry: {error}"));
                continue;
            }
        };
        if !entry.file_type().is_file() || !supported_extension(entry.path()) {
            continue;
        }
        let path = entry.path();
        let metadata = match entry.metadata() {
            Ok(value) => value,
            Err(error) => {
                warnings.push(format!(
                    "could not read metadata for {}: {error}",
                    path.display()
                ));
                continue;
            }
        };
        let sidecar = sidecar_candidates(path)
            .into_iter()
            .find(|candidate| candidate.is_file())
            .or_else(|| {
                let parent = path.parent()?;
                let name = path.file_name()?.to_string_lossy().to_ascii_lowercase();
                sidecar_index.get(&(parent.to_path_buf(), name)).cloned()
            });
        let sidecar_data = sidecar
            .as_deref()
            .and_then(|path| match parse_sidecar(path) {
                Ok(data) => Some(data),
                Err(error) => {
                    warnings.push(error.to_string());
                    None
                }
            })
            .unwrap_or_default();
        let file_name = path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        let lower = file_name.to_ascii_lowercase();
        assets.push(Asset {
            relative_path: portable_relative(root, path),
            file_name,
            bytes: metadata.len(),
            sha256: match hash_mode {
                HashMode::Sha256 => Some(sha256(path)?),
                HashMode::None => None,
            },
            captured_at: sidecar_data.captured_at,
            albums: album_for(root, path, kind),
            aliases: Vec::new(),
            edited_version: lower.contains("edited")
                || lower.contains("-edit")
                || lower.contains("_edit"),
            sidecar_found: sidecar.is_some(),
        });
    }
    if assets.is_empty() {
        bail!(
            "no supported photo or video assets found under {}",
            root.display()
        );
    }

    let physical_asset_count = assets.len();
    if hash_mode == HashMode::Sha256 {
        let mut collapsed: BTreeMap<String, Asset> = BTreeMap::new();
        for mut asset in assets {
            let hash = asset.sha256.clone().unwrap_or_default();
            if let Some(existing) = collapsed.get_mut(&hash) {
                existing.aliases.push(asset.relative_path);
                existing.albums.append(&mut asset.albums);
                existing.albums.sort();
                existing.albums.dedup();
                existing.edited_version |= asset.edited_version;
                existing.sidecar_found |= asset.sidecar_found;
                if existing.captured_at.is_none() {
                    existing.captured_at = asset.captured_at;
                }
            } else {
                collapsed.insert(hash, asset);
            }
        }
        assets = collapsed.into_values().collect();
    }
    assets.sort_by(|left, right| left.relative_path.cmp(&right.relative_path));
    let total_bytes = assets.iter().map(|asset| asset.bytes).sum();
    if kind == InventoryKind::Takeout && assets.iter().any(|asset| !asset.sidecar_found) {
        warnings.push("Some Takeout assets have no readable JSON sidecar; capture dates or provider edits may be unavailable.".into());
    }
    if assets.iter().any(|asset| asset.edited_version) {
        warnings.push("Edited-looking files were found. Proprietary edit instructions may not be portable; verify rendered copies visually.".into());
    }
    Ok(Inventory {
        schema_version: 1,
        tool_version: VERSION.into(),
        generated_at: now(),
        root_label: root
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned(),
        kind,
        hash_mode,
        physical_asset_count,
        unique_asset_count: assets.len(),
        total_bytes,
        assets,
        warnings,
    })
}

fn fallback_key(asset: &Asset) -> (String, u64, Option<&str>) {
    (
        asset.file_name.to_ascii_lowercase(),
        asset.bytes,
        asset.captured_at.as_deref(),
    )
}

pub fn compare(source: &Inventory, destination: &Inventory, exceptions: &ExceptionFile) -> Audit {
    let mut matches = Vec::new();
    let mut used_destination = HashSet::new();
    let mut missing = Vec::new();
    let mut destination_hashes: HashMap<&str, Vec<&Asset>> = HashMap::new();
    for asset in &destination.assets {
        if let Some(hash) = asset.sha256.as_deref() {
            destination_hashes.entry(hash).or_default().push(asset);
        }
    }

    for source_asset in &source.assets {
        let exact = source_asset
            .sha256
            .as_deref()
            .and_then(|hash| destination_hashes.get(hash))
            .and_then(|items| items.first().copied());
        let fallback = || {
            destination.assets.iter().find(|candidate| {
                let left = fallback_key(source_asset);
                let right = fallback_key(candidate);
                left.0 == right.0
                    && left.1 == right.1
                    && (left.2.is_none() || right.2.is_none() || left.2 == right.2)
            })
        };
        let allow_fallback = source_asset.sha256.is_none()
            || source.hash_mode != HashMode::Sha256
            || destination.hash_mode != HashMode::Sha256;
        if let Some((asset, method)) = exact.map(|asset| (asset, "sha256")).or_else(|| {
            allow_fallback
                .then(fallback)
                .flatten()
                .map(|asset| (asset, "name_size_date"))
        }) {
            used_destination.insert(asset.relative_path.clone());
            matches.push(MatchRecord {
                source_path: source_asset.relative_path.clone(),
                destination_path: asset.relative_path.clone(),
                method: method.into(),
            });
        } else {
            missing.push(source_asset.relative_path.clone());
        }
    }

    let exception_by_path: HashMap<&str, &NamedException> = exceptions
        .exceptions
        .iter()
        .filter(|exception| !exception.reason.trim().is_empty())
        .map(|exception| (exception.source_path.as_str(), exception))
        .collect();
    let applied_exceptions: Vec<NamedException> = missing
        .iter()
        .filter_map(|path| exception_by_path.get(path.as_str()).copied().cloned())
        .collect();
    let unresolved: Vec<String> = missing
        .iter()
        .filter(|path| !exception_by_path.contains_key(path.as_str()))
        .cloned()
        .collect();
    let accounted = matches.len() + applied_exceptions.len();
    let percent = if source.assets.is_empty() {
        0.0
    } else {
        accounted as f64 * 100.0 / source.assets.len() as f64
    };
    let strong_evidence =
        source.hash_mode == HashMode::Sha256 && destination.hash_mode == HashMode::Sha256;

    let source_albums: BTreeSet<&str> = source
        .assets
        .iter()
        .flat_map(|asset| asset.albums.iter().map(String::as_str))
        .collect();
    let destination_albums: BTreeSet<&str> = destination
        .assets
        .iter()
        .flat_map(|asset| asset.albums.iter().map(String::as_str))
        .collect();
    let album_gaps = source_albums
        .difference(&destination_albums)
        .map(|value| (*value).to_owned())
        .collect();
    let mut warnings = source.warnings.clone();
    warnings.extend(destination.warnings.clone());
    if !strong_evidence {
        warnings.push("At least one inventory has no hashes. This is a planning comparison and cannot be marked cutover-ready.".into());
    }
    for exception in &exceptions.exceptions {
        if exception.reason.trim().is_empty() {
            warnings.push(format!(
                "Exception for {} has no reason and was not applied.",
                exception.source_path
            ));
        } else if !missing.contains(&exception.source_path) {
            warnings.push(format!(
                "Exception for {} does not correspond to a missing source asset.",
                exception.source_path
            ));
        }
    }
    Audit {
        schema_version: 1,
        tool_version: VERSION.into(),
        generated_at: now(),
        source_assets: source.assets.len(),
        destination_assets: destination.assets.len(),
        matched_assets: matches.len(),
        excepted_assets: applied_exceptions.len(),
        accounted_assets: accounted,
        accounted_percent: (percent * 1000.0).round() / 1000.0,
        ready: strong_evidence && percent >= 99.5 && unresolved.is_empty(),
        evidence_level: if strong_evidence {
            "sha256"
        } else {
            "planning"
        }
        .into(),
        matches,
        missing,
        extra_destination: destination
            .assets
            .iter()
            .filter(|asset| !used_destination.contains(&asset.relative_path))
            .map(|asset| asset.relative_path.clone())
            .collect(),
        exceptions: applied_exceptions,
        source_albums_missing_at_destination: album_gaps,
        warnings,
    }
}

pub fn policy_template() -> PolicySet {
    PolicySet {
        household: "Our family".into(),
        archive_label: "Primary independent archive".into(),
        original_cloud_retention_days: 45,
        independent_second_copy: false,
        devices: vec![DevicePolicy {
            name: "Parent phone".into(),
            owner: "Name this owner".into(),
            backup_mode: BackupMode::Backup,
            deletion_behavior: DeletionBehavior::ManualReview,
            conflict_policy: ConflictPolicy::KeepBoth,
            offline_behavior: OfflineBehavior::QueueUntilOnline,
        }],
    }
}

pub fn validate_policies(policies: &PolicySet) -> Vec<String> {
    let mut warnings = Vec::new();
    if policies.household.trim().is_empty() {
        warnings.push("Household name is empty.".into());
    }
    if policies.archive_label.trim().is_empty() {
        warnings.push("Archive label is empty.".into());
    }
    if policies.devices.is_empty() {
        warnings.push("No device policy is recorded.".into());
    }
    if policies.original_cloud_retention_days < 30 {
        warnings
            .push("Keep the original cloud for at least 30 days after a verified cutover.".into());
    }
    if !policies.independent_second_copy {
        warnings.push(
            "No independent second copy is confirmed; one archive is not yet a backup.".into(),
        );
    }
    for (index, device) in policies.devices.iter().enumerate() {
        if device.name.trim().is_empty() || device.owner.trim().is_empty() {
            warnings.push(format!("Device {} needs both a name and owner.", index + 1));
        }
        if matches!(
            device.conflict_policy,
            ConflictPolicy::DeviceWins | ConflictPolicy::ArchiveWins
        ) {
            warnings.push(format!(
                "{} uses a destructive conflict winner; test it with copies before cutover.",
                device.name
            ));
        }
        if matches!(
            device.deletion_behavior,
            DeletionBehavior::MirrorAfterThirtyDays
        ) {
            warnings.push(format!(
                "{} mirrors deletions after 30 days; confirm restore tests and a second copy.",
                device.name
            ));
        }
    }
    warnings
}

pub fn build_manifest(
    audit: &Audit,
    policies: PolicySet,
    signer: Option<String>,
) -> SignedManifest {
    let policy_warnings = validate_policies(&policies);
    let safe_policy = policies.original_cloud_retention_days >= 30
        && !policies.household.trim().is_empty()
        && !policies.archive_label.trim().is_empty()
        && !policies.devices.is_empty()
        && policies
            .devices
            .iter()
            .all(|device| !device.name.trim().is_empty() && !device.owner.trim().is_empty());
    let signer = signer
        .map(|name| name.trim().to_owned())
        .filter(|name| !name.is_empty());
    let signed_at = signer.as_ref().map(|_| now());
    let is_signed = signer.is_some();
    SignedManifest {
        schema_version: 1,
        tool_version: VERSION.into(),
        generated_at: now(),
        status: if audit.ready && safe_policy && is_signed {
            "ready_for_cutover"
        } else {
            "hold"
        }
        .into(),
        signed_by: signer,
        signed_at,
        audit: AuditSummary {
            source_assets: audit.source_assets,
            matched_assets: audit.matched_assets,
            excepted_assets: audit.excepted_assets,
            accounted_percent: audit.accounted_percent,
            evidence_level: audit.evidence_level.clone(),
        },
        policies,
        policy_warnings,
    }
}

fn enum_label<T: Serialize>(value: &T) -> String {
    serde_json::to_value(value)
        .ok()
        .and_then(|value| value.as_str().map(str::to_owned))
        .unwrap_or_else(|| "unknown".into())
        .replace('_', " ")
}

pub fn render_manifest(manifest: &SignedManifest, audit: &Audit) -> String {
    let mark = if manifest.status == "ready_for_cutover" {
        "READY"
    } else {
        "HOLD"
    };
    let mut output = format!(
        "# Photo Exit Manifest\n\n**Status: {mark}**  \nGenerated: {}  \nEvidence: {}  \n\n## Asset account\n\n- Source assets: {}\n- Hash/fallback matches: {}\n- Named exceptions: {}\n- Accounted for: {:.3}%\n- Unresolved: {}\n- Extra destination assets: {}\n\n",
        manifest.generated_at,
        manifest.audit.evidence_level,
        manifest.audit.source_assets,
        manifest.audit.matched_assets,
        manifest.audit.excepted_assets,
        manifest.audit.accounted_percent,
        audit.missing.len().saturating_sub(audit.exceptions.len()),
        audit.extra_destination.len()
    );
    output.push_str("## Device behavior after cutover\n\n");
    for device in &manifest.policies.devices {
        output.push_str(&format!(
            "### {} — {}\n\n- Upload: {}\n- Deletions: {}\n- Conflicts: {}\n- Offline: {}\n\n",
            device.name,
            device.owner,
            enum_label(&device.backup_mode),
            enum_label(&device.deletion_behavior),
            enum_label(&device.conflict_policy),
            enum_label(&device.offline_behavior)
        ));
    }
    output.push_str("## Exceptions and review\n\n");
    if audit.exceptions.is_empty() {
        output.push_str("No named asset exceptions.\n\n");
    } else {
        for exception in &audit.exceptions {
            output.push_str(&format!(
                "- `{}` — {}\n",
                exception.source_path, exception.reason
            ));
        }
        output.push('\n');
    }
    if !audit.source_albums_missing_at_destination.is_empty() {
        output.push_str("Album labels not observed at the destination: ");
        output.push_str(&audit.source_albums_missing_at_destination.join(", "));
        output.push_str(
            ". Album membership may need a provider-specific export or manual recreation.\n\n",
        );
    }
    for warning in audit.warnings.iter().chain(manifest.policy_warnings.iter()) {
        output.push_str(&format!("- Review: {warning}\n"));
    }
    output.push_str("\n## Cutover checklist\n\n");
    output.push_str(
        "- [ ] Open a sample from every year and every camera format in the destination.\n",
    );
    output.push_str(
        "- [ ] Confirm albums, edited copies, timestamps, and videos on a second device.\n",
    );
    output.push_str(
        "- [ ] Test one upload, conflict, offline queue, deletion, and restore per device.\n",
    );
    output.push_str(&format!(
        "- [ ] Keep the original cloud unchanged for at least {} days.\n",
        manifest.policies.original_cloud_retention_days
    ));
    output.push_str("- [ ] Confirm an independent second copy before deleting any original.\n\n");
    output.push_str("This manifest records evidence; it does not prove proprietary edits or provider-only features are portable. Photo Exit Manifest never modifies the source or destination.\n\n");
    match (&manifest.signed_by, &manifest.signed_at) {
        (Some(name), Some(date)) => output.push_str(&format!("Signed by **{name}** at {date}.\n")),
        _ => output.push_str(
            "Unsigned. Add `--sign \"Name\"` only after the checklist has been reviewed.\n",
        ),
    }
    output
}

pub fn read_json<T: for<'de> Deserialize<'de>>(path: &Path) -> Result<T> {
    serde_json::from_reader(
        File::open(path).with_context(|| format!("cannot open {}", path.display()))?,
    )
    .with_context(|| format!("invalid JSON in {}", path.display()))
}

pub fn write_json<T: Serialize>(path: &Path, value: &T, force: bool) -> Result<()> {
    ensure_writable(path, force)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .with_context(|| format!("cannot create {}", parent.display()))?;
    }
    let data = serde_json::to_string_pretty(value)? + "\n";
    fs::write(path, data).with_context(|| format!("cannot write {}", path.display()))
}

pub fn write_text(path: &Path, value: &str, force: bool) -> Result<()> {
    ensure_writable(path, force)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .with_context(|| format!("cannot create {}", parent.display()))?;
    }
    fs::write(path, value).with_context(|| format!("cannot write {}", path.display()))
}

fn ensure_writable(path: &Path, force: bool) -> Result<()> {
    if path.exists() && !force {
        bail!(
            "output already exists: {} (use --force to replace it)",
            path.display()
        );
    }
    Ok(())
}

pub fn ensure_output_outside(output: &Path, inputs: &[&Path]) -> Result<()> {
    let current = std::env::current_dir()?;
    let absolute_output = if output.is_absolute() {
        output.to_path_buf()
    } else {
        current.join(output)
    };
    let mut existing = absolute_output.as_path();
    let mut missing_parts = Vec::new();
    while !existing.exists() {
        let part = existing
            .file_name()
            .context("output path has no resolvable parent")?;
        missing_parts.push(part.to_os_string());
        existing = existing
            .parent()
            .context("output path has no resolvable parent")?;
    }
    let mut resolved_output = existing
        .canonicalize()
        .with_context(|| format!("cannot resolve output parent {}", existing.display()))?;
    for part in missing_parts.iter().rev() {
        resolved_output.push(part);
    }
    for input in inputs {
        let canonical = input
            .canonicalize()
            .with_context(|| format!("cannot resolve {}", input.display()))?;
        if resolved_output.starts_with(&canonical) {
            bail!(
                "output {} must be outside scanned source/destination {}",
                output.display(),
                input.display()
            );
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn save(path: &Path, bytes: &[u8]) {
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, bytes).unwrap();
    }

    #[test]
    fn takeout_inventory_collapses_album_copies_and_reads_sidecars() {
        let dir = tempdir().unwrap();
        save(
            &dir.path().join("Google Photos/Photos from 2020/IMG.jpg"),
            b"same photo",
        );
        save(
            &dir.path()
                .join("Google Photos/Photos from 2020/IMG.jpg.json"),
            br#"{"title":"IMG.jpg","photoTakenTime":{"timestamp":"1577836800"}}"#,
        );
        save(
            &dir.path().join("Google Photos/Beach/IMG.jpg"),
            b"same photo",
        );
        save(
            &dir.path().join("Google Photos/Beach/IMG.jpg.json"),
            br#"{"title":"IMG.jpg","photoTakenTime":{"timestamp":"1577836800"}}"#,
        );
        let result = inventory(dir.path(), InventoryKind::Takeout, HashMode::Sha256).unwrap();
        assert_eq!(result.physical_asset_count, 2);
        assert_eq!(result.unique_asset_count, 1);
        assert_eq!(result.assets[0].aliases.len(), 1);
        assert_eq!(
            result.assets[0].captured_at.as_deref(),
            Some("2020-01-01T00:00:00+00:00")
        );
        assert!(result.assets[0].albums.contains(&"Beach".into()));
    }

    #[test]
    fn compare_requires_hashes_and_accounts_named_exception() {
        let source = Inventory {
            schema_version: 1,
            tool_version: VERSION.into(),
            generated_at: now(),
            root_label: "source".into(),
            kind: InventoryKind::Folder,
            hash_mode: HashMode::Sha256,
            physical_asset_count: 2,
            unique_asset_count: 2,
            total_bytes: 2,
            warnings: vec![],
            assets: vec![
                Asset {
                    relative_path: "a.jpg".into(),
                    file_name: "a.jpg".into(),
                    bytes: 1,
                    sha256: Some("aaa".into()),
                    captured_at: None,
                    albums: vec![],
                    aliases: vec![],
                    edited_version: false,
                    sidecar_found: false,
                },
                Asset {
                    relative_path: "b.jpg".into(),
                    file_name: "b.jpg".into(),
                    bytes: 1,
                    sha256: Some("bbb".into()),
                    captured_at: None,
                    albums: vec![],
                    aliases: vec![],
                    edited_version: false,
                    sidecar_found: false,
                },
            ],
        };
        let destination = Inventory {
            assets: vec![source.assets[0].clone()],
            physical_asset_count: 1,
            unique_asset_count: 1,
            total_bytes: 1,
            root_label: "dest".into(),
            ..source.clone()
        };
        let exceptions = ExceptionFile {
            exceptions: vec![NamedException {
                source_path: "b.jpg".into(),
                reason: "known corrupt original".into(),
            }],
        };
        let audit = compare(&source, &destination, &exceptions);
        assert!(audit.ready);
        assert_eq!(audit.accounted_percent, 100.0);
        assert_eq!(audit.excepted_assets, 1);
    }

    #[test]
    fn compare_never_accepts_name_and_size_when_hashes_disagree() {
        let mut source = inventory_fixture("source-hash");
        let mut destination = inventory_fixture("destination-hash");
        source.assets[0].sha256 = Some("aaa".into());
        destination.assets[0].sha256 = Some("bbb".into());
        let audit = compare(&source, &destination, &ExceptionFile::default());
        assert_eq!(audit.matched_assets, 0);
        assert!(!audit.ready);
    }

    #[test]
    fn manifest_holds_when_retention_is_unsafe() {
        let audit = Audit {
            schema_version: 1,
            tool_version: VERSION.into(),
            generated_at: now(),
            source_assets: 1,
            destination_assets: 1,
            matched_assets: 1,
            excepted_assets: 0,
            accounted_assets: 1,
            accounted_percent: 100.0,
            ready: true,
            evidence_level: "sha256".into(),
            matches: vec![],
            missing: vec![],
            extra_destination: vec![],
            exceptions: vec![],
            source_albums_missing_at_destination: vec![],
            warnings: vec![],
        };
        let mut policies = policy_template();
        policies.original_cloud_retention_days = 7;
        let manifest = build_manifest(&audit, policies, Some("Tester".into()));
        assert_eq!(manifest.status, "hold");
        assert!(render_manifest(&manifest, &audit).contains("Status: HOLD"));
    }

    #[test]
    fn ready_audit_stays_on_hold_until_signed() {
        let audit = compare(
            &inventory_fixture("same"),
            &inventory_fixture("same"),
            &ExceptionFile::default(),
        );
        assert!(audit.ready);
        let manifest = build_manifest(&audit, policy_template(), None);
        assert_eq!(manifest.status, "hold");
        assert!(manifest.signed_at.is_none());
    }

    fn inventory_fixture(hash: &str) -> Inventory {
        Inventory {
            schema_version: 1,
            tool_version: VERSION.into(),
            generated_at: now(),
            root_label: "photos".into(),
            kind: InventoryKind::Folder,
            hash_mode: HashMode::Sha256,
            physical_asset_count: 1,
            unique_asset_count: 1,
            total_bytes: 4,
            assets: vec![Asset {
                relative_path: "photo.jpg".into(),
                file_name: "photo.jpg".into(),
                bytes: 4,
                sha256: Some(hash.into()),
                captured_at: None,
                albums: vec![],
                aliases: vec![],
                edited_version: false,
                sidecar_found: false,
            }],
            warnings: vec![],
        }
    }
}
