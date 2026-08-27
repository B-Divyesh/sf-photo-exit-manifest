export function calculateReadiness(source, matched, exceptions, hashesConfirmed) {
  const total = Number(source);
  const found = Number(matched);
  const named = Number(exceptions);
  if (![total, found, named].every(Number.isFinite) || total <= 0 || found < 0 || named < 0) {
    return { valid: false, message: 'Enter a positive source count and non-negative results.' };
  }
  if (found + named > total) {
    return { valid: false, message: 'Matches and exceptions cannot exceed the source count.' };
  }
  const accounted = found + named;
  const percent = accounted * 100 / total;
  const unresolved = total - accounted;
  const ready = hashesConfirmed && percent >= 99.5 && unresolved === 0;
  return {
    valid: true,
    percent,
    unresolved,
    ready,
    message: ready
      ? 'Ready to review and sign. Keep the old cloud during the retention window.'
      : hashesConfirmed
        ? `${unresolved} asset${unresolved === 1 ? '' : 's'} still need a match or a named exception.`
        : 'Planning only. Re-run both inventories with SHA-256 before cutover.'
  };
}

export function policyFile(devices) {
  return {
    household: 'Our family',
    archive_label: 'Primary independent archive',
    original_cloud_retention_days: 45,
    independent_second_copy: false,
    devices: devices.map((device) => ({
      name: device.name.trim(),
      owner: device.owner.trim(),
      backup_mode: device.backupMode,
      deletion_behavior: device.deletionBehavior,
      conflict_policy: device.conflictPolicy,
      offline_behavior: 'queue_until_online'
    }))
  };
}
