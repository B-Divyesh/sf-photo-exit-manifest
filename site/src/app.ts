import './style.css';
import { calculateReadiness, policyFile } from './calculator.js';

const slug = 'photo-exit-manifest';
const billingBase = import.meta.env.VITE_BILLING_BASE || 'https://api.sociobot.in';
const licenseKey = `sb_license:${slug}`;
const verdictKey = `sb_license_verdict:${slug}`;
const day = 86_400_000;

type CachedVerdict = { valid: boolean; reason: string; checkedAt: number };

const one = <T extends Element>(selector: string) => document.querySelector<T>(selector);
const status = one<HTMLElement>('#license-status');
const unlock = one<HTMLElement>('#family-builder');
const restoreForm = one<HTMLFormElement>('#restore-form');
const restoreInput = one<HTMLInputElement>('#license-token');

function cachedVerdict(): CachedVerdict | null {
  try {
    return JSON.parse(localStorage.getItem(verdictKey) || 'null') as CachedVerdict | null;
  } catch {
    localStorage.removeItem(verdictKey);
    return null;
  }
}

function setLicenseState(valid: boolean, reason = '') {
  unlock?.toggleAttribute('data-unlocked', valid);
  if (status) {
    status.className = valid ? 'notice success' : reason ? 'notice warning' : 'notice';
    status.textContent = valid
      ? 'Family Pack unlocked on this browser.'
      : reason
        ? 'License no longer active. Check the token or purchase a new license.'
        : 'The free CLI remains fully available.';
  }
  document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('#family-builder input, #family-builder select, #family-builder button')
    .forEach((control) => { control.disabled = !valid; });
}

async function verifyLicense(token: string, force = false) {
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < day) {
    setLicenseState(cached.valid, cached.valid ? '' : cached.reason);
    return;
  }
  try {
    const response = await fetch(`${billingBase}/api/v1/products/${slug}/verify?license=${encodeURIComponent(token)}`, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`verification returned ${response.status}`);
    const verdict = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(verdictKey, JSON.stringify({ ...verdict, checkedAt: Date.now() }));
    setLicenseState(verdict.valid, verdict.valid ? '' : verdict.reason);
  } catch {
    if (cached?.valid) setLicenseState(true);
    else {
      setLicenseState(false);
      if (status) status.textContent = 'Could not verify while offline. The free CLI still works; reconnect to unlock the Family Pack.';
    }
  }
}

function loadLicense() {
  const params = new URLSearchParams(location.search);
  const returned = params.get('license');
  if (returned) {
    localStorage.setItem(licenseKey, returned);
    params.delete('license');
    const query = params.toString();
    history.replaceState({}, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }
  const token = returned || localStorage.getItem(licenseKey);
  const cached = cachedVerdict();
  if (cached?.valid) setLicenseState(true);
  else setLicenseState(false, cached?.reason);
  if (token) void verifyLicense(token);
}

restoreForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const token = restoreInput?.value.trim();
  if (!token) {
    if (status) status.textContent = 'Paste the complete license token first.';
    restoreInput?.focus();
    return;
  }
  localStorage.setItem(licenseKey, token);
  void verifyLicense(token, true);
});

const plannerForm = one<HTMLFormElement>('#planner-form');
plannerForm?.addEventListener('input', () => {
  const data = new FormData(plannerForm);
  const result = calculateReadiness(data.get('source'), data.get('matched'), data.get('exceptions'), data.get('hashes') === 'on');
  const output = one<HTMLElement>('#planner-result');
  if (!output) return;
  output.className = `planner-result ${result.valid && result.ready ? 'ready' : 'hold'}`;
  output.innerHTML = result.valid
    ? `<strong>${result.ready ? 'Ready' : 'Hold'}</strong><span>${result.percent?.toFixed(3)}% accounted · ${result.unresolved} unresolved</span><small>${result.message}</small>`
    : `<strong>Check the counts</strong><small>${result.message}</small>`;
});

one<HTMLButtonElement>('#copy-command')?.addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const command = one<HTMLElement>('#install-command')?.textContent || '';
  try {
    await navigator.clipboard.writeText(command.trim());
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = 'Copy command'; }, 1600);
  } catch {
    button.textContent = 'Select and copy';
  }
});

let deviceCount = 1;
one<HTMLButtonElement>('#add-device')?.addEventListener('click', () => {
  deviceCount += 1;
  const list = one<HTMLElement>('#device-list');
  if (!list) return;
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'device-row';
  fieldset.innerHTML = `<legend>Device ${deviceCount}</legend><label>Device name<input name="device-name" required></label><label>Owner<input name="device-owner" required></label><label>Upload behavior<select name="backup-mode"><option value="backup">Backup new photos</option><option value="mirror">Mirror library</option><option value="manual">Manual only</option></select></label><label>Deletion behavior<select name="deletion-behavior"><option value="manual_review">Review manually</option><option value="keep_in_archive">Keep in archive</option><option value="mirror_after_thirty_days">Mirror after 30 days</option></select></label><label>Conflicts<select name="conflict-policy"><option value="keep_both">Keep both</option><option value="newest_wins">Newest wins</option><option value="device_wins">Device wins</option><option value="archive_wins">Archive wins</option></select></label>`;
  list.append(fieldset);
  fieldset.querySelector('input')?.focus();
});

one<HTMLFormElement>('#policy-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  if (!form.reportValidity()) return;
  const rows = [...form.querySelectorAll<HTMLFieldSetElement>('.device-row')];
  const devices = rows.map((row) => ({
    name: row.querySelector<HTMLInputElement>('[name="device-name"]')?.value || '',
    owner: row.querySelector<HTMLInputElement>('[name="device-owner"]')?.value || '',
    backupMode: row.querySelector<HTMLSelectElement>('[name="backup-mode"]')?.value || 'backup',
    deletionBehavior: row.querySelector<HTMLSelectElement>('[name="deletion-behavior"]')?.value || 'manual_review',
    conflictPolicy: row.querySelector<HTMLSelectElement>('[name="conflict-policy"]')?.value || 'keep_both'
  }));
  const blob = new Blob([`${JSON.stringify(policyFile(devices), null, 2)}\n`], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'policies.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

const offline = one<HTMLElement>('#offline-notice');
function updateNetwork() {
  if (!offline) return;
  offline.hidden = navigator.onLine;
}
window.addEventListener('online', updateNetwork);
window.addEventListener('offline', updateNetwork);
updateNetwork();
loadLicense();
if ('serviceWorker' in navigator) window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
