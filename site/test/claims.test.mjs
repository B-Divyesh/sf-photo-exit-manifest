import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test, { after, before } from 'node:test';
import { chromium } from 'playwright';

const binary = resolve('target/debug/photo-exit-manifest');
const siteRoot = resolve('dist/site');
let server;
let base;

async function serveBuiltSite() {
  return new Promise((resolveServer) => {
    const instance = createServer(async (request, response) => {
      try {
        const pathname = decodeURIComponent(new URL(request.url || '/', 'http://local').pathname);
        const relative = pathname === '/' ? 'index.html' : pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1);
        const file = resolve(siteRoot, relative);
        if (!file.startsWith(`${siteRoot}/`)) throw new Error('invalid path');
        const body = await readFile(file);
        const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.webp') ? 'image/webp' : 'application/octet-stream';
        response.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
        response.end(body);
      } catch {
        response.writeHead(404, { 'content-type': 'text/html' });
        response.end(await readFile(resolve(siteRoot, '404.html')));
      }
    });
    instance.listen(0, '127.0.0.1', () => resolveServer(instance));
  });
}

async function treeDigest(root) {
  const entries = [];
  async function walk(dir, relative = '') {
    for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const rel = join(relative, entry.name);
      if (entry.isDirectory()) await walk(join(dir, entry.name), rel);
      else entries.push([rel, createHash('sha256').update(await readFile(join(dir, entry.name))).digest('hex')]);
    }
  }
  await walk(root);
  return entries;
}

function run(args) {
  return spawnSync(binary, args, { encoding: 'utf8', timeout: 30_000 });
}

before(async () => {
  server = await serveBuiltSite();
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolveClose) => server.close(resolveClose));
});

test('@claim:demo-isolation bundled demo writes only below its new workspace', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-demo-'));
  const real = join(sandbox, 'real-family-archive');
  await mkdir(real);
  await writeFile(join(real, 'never-touch.jpg'), 'family sentinel');
  const beforeDigest = await treeDigest(real);
  const workspace = join(sandbox, 'demo');
  const result = run(['demo', '--output', workspace, '--json']);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.ok(resolve(output.output).startsWith(`${resolve(workspace)}/`));
  assert.deepEqual(await treeDigest(real), beforeDigest);
  assert.equal((await readdir(sandbox)).sort().join(','), 'demo,real-family-archive');
});

test('@claim:migration-report demo produces the documented signed five-file report', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-report-'));
  const workspace = join(sandbox, 'demo');
  const result = run(['demo', '--output', workspace, '--json']);
  assert.equal(result.status, 0, result.stderr);
  const status = JSON.parse(result.stdout);
  assert.equal(status.status, 'ready_for_cutover');
  assert.equal(status.accounted_percent, 100);
  const report = join(workspace, 'migration-report');
  assert.deepEqual((await readdir(report)).sort(), ['CUTOVER.md', 'audit.json', 'destination-inventory.json', 'manifest.json', 'source-inventory.json']);
  const manifest = JSON.parse(await readFile(join(report, 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'ready_for_cutover');
  assert.equal(manifest.signed_by, 'Morgan family');
});

test('@claim:named-exception-gate an unexplained item holds the report and a named exception clears it', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-gate-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const emptyExceptions = join(workspace, 'no-exceptions.json');
  await writeFile(emptyExceptions, '{"exceptions":[],"album_exceptions":[]}');
  const held = run(['run', '--source', join(workspace, 'source'), '--source-kind', 'takeout', '--destination', join(workspace, 'archive'), '--policies', join(workspace, 'policies.json'), '--exceptions', emptyExceptions, '--out', join(workspace, 'held-report'), '--sign', 'Morgan family', '--json']);
  assert.equal(held.status, 2, held.stderr);
  assert.equal(JSON.parse(held.stdout).status, 'hold');
  const ready = JSON.parse(await readFile(join(workspace, 'migration-report', 'manifest.json'), 'utf8'));
  assert.equal(ready.status, 'ready_for_cutover');
});

test('@claim:takeout-evidence scan records SHA-256, export notes, album labels and edited-file warnings', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-evidence-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const inventory = JSON.parse(await readFile(join(workspace, 'migration-report', 'source-inventory.json'), 'utf8'));
  assert.equal(inventory.hash_mode, 'sha256');
  assert.equal(inventory.assets.length, 6);
  assert.ok(inventory.assets.every((asset) => /^[a-f0-9]{64}$/.test(asset.sha256)));
  const birthday = inventory.assets.find((asset) => asset.relative_path.endsWith('birthday-candles.jpg'));
  assert.equal(birthday.captured_at, '2021-07-31T00:00:00+00:00');
  assert.equal(birthday.sidecar_found, true);
  const lake = inventory.assets.find((asset) => asset.relative_path.endsWith('lake-sunrise.jpg'));
  assert.ok(lake.albums.includes('Family Favorites'));
  const edited = inventory.assets.find((asset) => asset.relative_path.endsWith('bike-ride-edited.jpg'));
  assert.equal(edited.edited_version, true);
});

test('@claim:read-only-local the CLI leaves inputs unchanged and the website sends no cross-origin requests', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-local-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const before = await treeDigest(join(workspace, 'source'));
  const destinationBefore = await treeDigest(join(workspace, 'archive'));
  const result = run(['run', '--source', join(workspace, 'source'), '--source-kind', 'takeout', '--destination', join(workspace, 'archive'), '--policies', join(workspace, 'policies.json'), '--exceptions', join(workspace, 'exceptions.json'), '--out', join(workspace, 'second-report'), '--sign', 'Morgan family', '--json']);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await treeDigest(join(workspace, 'source')), before);
  assert.deepEqual(await treeDigest(join(workspace, 'archive')), destinationBefore);
  const source = await readFile('src/main.rs', 'utf8') + await readFile('src/lib.rs', 'utf8');
  assert.doesNotMatch(source, /TcpStream|UdpSocket|reqwest|hyper::|ureq|curl/);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const crossOrigin = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== new URL(base).origin) crossOrigin.push(request.url());
  });
  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await page.waitForURL(`${base}/demo/?demo=1`);
  assert.deepEqual(crossOrigin, []);
  assert.deepEqual(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage }, cookies: document.cookie })), { local: {}, session: {}, cookies: '' });
  await context.close();
  await browser.close();
});

test('@claim:free-cli sample and report generation work without an account, key or licence', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-free-'));
  const result = spawnSync(binary, ['demo', '--output', join(sandbox, 'demo'), '--json'], { encoding: 'utf8', env: { PATH: process.env.PATH }, timeout: 30_000 });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, 'ready_for_cutover');
});

test('@claim:scriptable-cli commands are non-interactive, emit JSON and use stable status codes', async () => {
  const help = run(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage: photo-exit-manifest <COMMAND>/);
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-script-'));
  const ready = run(['demo', '--output', join(sandbox, 'demo'), '--json']);
  assert.equal(ready.status, 0);
  assert.doesNotThrow(() => JSON.parse(ready.stdout));
  const invalid = run(['inventory', join(sandbox, 'missing'), '--output', join(sandbox, 'inventory.json'), '--json']);
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /^error: cannot (resolve|scan)/);
});

test('@claim:planning-mode hash-free inventory is marked planning-only and matches conservatively', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-planning-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const source = join(workspace, 'planning-source.json');
  const destination = join(workspace, 'planning-destination.json');
  const auditPath = join(workspace, 'planning-audit.json');
  assert.equal(run(['inventory', join(workspace, 'source'), '--kind', 'takeout', '--hash', 'none', '--output', source, '--json']).status, 0);
  assert.equal(run(['inventory', join(workspace, 'archive'), '--kind', 'folder', '--hash', 'none', '--output', destination, '--json']).status, 0);
  assert.equal(run(['compare', '--source', source, '--destination', destination, '--exceptions', join(workspace, 'exceptions.json'), '--output', auditPath, '--json']).status, 2);
  const inventory = JSON.parse(await readFile(source, 'utf8'));
  const audit = JSON.parse(await readFile(auditPath, 'utf8'));
  assert.ok(inventory.assets.every((asset) => asset.sha256 === null));
  assert.equal(audit.evidence_level, 'planning');
  assert.equal(audit.matched_assets, 5);
  assert.ok(audit.matches.every((item) => item.method === 'name_size_date'));
  assert.equal(audit.ready, false);
});

test('@claim:package-contract package is an MIT-licensed single CLI with Rust 1.85 as its minimum', () => {
  const metadata = spawnSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' });
  assert.equal(metadata.status, 0, metadata.stderr);
  const packageInfo = JSON.parse(metadata.stdout).packages.find((item) => item.name === 'photo-exit-manifest');
  assert.equal(packageInfo.license, 'MIT');
  assert.equal(packageInfo.rust_version, '1.85');
  assert.equal(packageInfo.targets.filter((target) => target.kind.includes('bin')).length, 1);
});

test('@claim:offline-reload sample reloads offline after one online visit', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.demo-banner');
  assert.equal(await page.locator('h1').textContent(), 'Review the Morgan family archive check');
  assert.equal(await page.locator('#offline-notice').isVisible(), true);
  await context.close();
  await browser.close();
});

test('@claim:route-contract direct routes have distinct titles and unknown routes return the designed 404', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const [path, title] of [['/', 'Photo Exit Manifest — Verify a photo archive'], ['/demo/', 'Demo — Photo Exit Manifest'], ['/privacy/', 'Privacy — Photo Exit Manifest'], ['/terms/', 'Terms — Photo Exit Manifest']]) {
    const response = await page.goto(`${base}${path}`);
    assert.equal(response.status(), 200);
    assert.equal(await page.title(), title);
  }
  const missing = await page.goto(`${base}/not-a-real-route`);
  assert.equal(missing.status(), 404);
  assert.equal(await page.title(), 'Page not found — Photo Exit Manifest');
  assert.equal(await page.locator('h1').textContent(), 'This archive path leads nowhere');
  await context.close();
  await browser.close();
});
