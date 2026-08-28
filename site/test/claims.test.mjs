import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test, { after, before } from 'node:test';
import { chromium } from 'playwright';

const binary = resolve('target/debug/photo-exit-manifest');
const siteRoot = resolve('dist/site');
let server;
let base;
let networkGuard;

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

function runWithEnv(args, env) {
  return spawnSync(binary, args, {
    encoding: 'utf8',
    timeout: 30_000,
    env: { ...process.env, ...env },
  });
}

function runGuarded(args, log) {
  return spawnSync(binary, args, {
    encoding: 'utf8',
    timeout: 30_000,
    env: { ...process.env, LD_PRELOAD: networkGuard, PEM_NETWORK_LOG: log },
  });
}

before(async () => {
  const guardDirectory = await mkdtemp(join(tmpdir(), 'pem-network-guard-'));
  networkGuard = join(guardDirectory, 'network-guard.so');
  const compile = spawnSync('cc', ['-shared', '-fPIC', '-O2', '-o', networkGuard, 'tests/network_guard.c'], { encoding: 'utf8' });
  assert.equal(compile.status, 0, `cannot compile runtime network guard: ${compile.stderr}`);
  server = await serveBuiltSite();
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolveClose) => server.close(resolveClose));
});

test('@claim:demo-isolation bundled demo chooses a new temporary workspace and writes only there', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-demo-'));
  const real = join(sandbox, 'real-family-archive');
  await mkdir(real);
  await writeFile(join(real, 'never-touch.jpg'), 'family sentinel');
  const beforeDigest = await treeDigest(real);
  const result = runWithEnv(['demo', '--json'], { TMPDIR: sandbox });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  const report = resolve(output.output);
  const workspace = dirname(report);
  assert.equal(dirname(workspace), resolve(sandbox), 'automatic demo workspace must be a direct child of TMPDIR');
  assert.match(basename(workspace), /^photo-exit-manifest-demo-[0-9]+-[0-9]+$/);
  assert.equal(basename(report), 'migration-report');
  assert.deepEqual(await treeDigest(real), beforeDigest);
  assert.deepEqual((await readdir(sandbox)).sort(), [basename(workspace), 'real-family-archive'].sort());
  assert.deepEqual((await readdir(report)).sort(), ['CUTOVER.md', 'audit.json', 'destination-inventory.json', 'manifest.json', 'source-inventory.json']);
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

test('@claim:takeout-evidence scan records every advertised field and emits unique warnings', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-evidence-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const inventory = JSON.parse(await readFile(join(workspace, 'migration-report', 'source-inventory.json'), 'utf8'));
  assert.equal(inventory.hash_mode, 'sha256');
  assert.equal(inventory.assets.length, 6);
  for (const asset of inventory.assets) {
    assert.equal(asset.file_name, basename(asset.relative_path));
    assert.equal(asset.bytes, (await stat(join(workspace, 'source', asset.relative_path))).size);
    assert.ok(asset.bytes > 0);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  }
  const birthday = inventory.assets.find((asset) => asset.relative_path.endsWith('birthday-candles.jpg'));
  assert.equal(birthday.captured_at, '2021-07-31T00:00:00+00:00');
  assert.equal(birthday.sidecar_found, true);
  const lake = inventory.assets.find((asset) => asset.relative_path.endsWith('lake-sunrise.jpg'));
  assert.ok(lake.albums.includes('Family Favorites'));
  const edited = inventory.assets.find((asset) => asset.relative_path.endsWith('bike-ride-edited.jpg'));
  assert.equal(edited.edited_version, true);
  const audit = JSON.parse(await readFile(join(workspace, 'migration-report', 'audit.json'), 'utf8'));
  const missingNoteWarning = 'Some Takeout assets have no readable JSON sidecar; capture dates or provider edits may be unavailable.';
  const editWarning = 'Edited-looking files were found. Proprietary edit instructions may not be portable; verify rendered copies visually.';
  assert.ok(audit.warnings.includes(missingNoteWarning));
  assert.ok(audit.warnings.includes(editWarning));
  assert.equal(new Set(audit.warnings).size, audit.warnings.length, 'audit warnings are unique');
  assert.equal(audit.warnings.filter((warning) => warning === editWarning).length, 1);
  const markdown = await readFile(join(workspace, 'migration-report', 'CUTOVER.md'), 'utf8');
  assert.equal(markdown.split(`- Review: ${editWarning}`).length - 1, 1, 'the edit warning appears once in CUTOVER.md');
});

test('@claim:exact-byte-matching SHA-256 matches identical bytes and rejects same-size different bytes', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-exact-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const sampleAudit = JSON.parse(await readFile(join(workspace, 'migration-report', 'audit.json'), 'utf8'));
  assert.equal(sampleAudit.matched_assets, 5);
  assert.equal(sampleAudit.matches.length, 5);
  assert.ok(sampleAudit.matches.every((match) => match.method === 'sha256'));

  const source = join(sandbox, 'same-name-source');
  const destination = join(sandbox, 'same-name-destination');
  await mkdir(source);
  await mkdir(destination);
  await writeFile(join(source, 'family.jpg'), 'AAAA');
  await writeFile(join(destination, 'family.jpg'), 'BBBB');
  const sourceInventory = join(sandbox, 'source.json');
  const destinationInventory = join(sandbox, 'destination.json');
  const differentAudit = join(sandbox, 'different-audit.json');
  assert.equal(run(['inventory', source, '--output', sourceInventory, '--json']).status, 0);
  assert.equal(run(['inventory', destination, '--output', destinationInventory, '--json']).status, 0);
  const comparison = run(['compare', '--source', sourceInventory, '--destination', destinationInventory, '--output', differentAudit, '--json']);
  assert.equal(comparison.status, 2, comparison.stderr);
  const different = JSON.parse(await readFile(differentAudit, 'utf8'));
  assert.equal(different.matched_assets, 0);
  assert.deepEqual(different.matches, []);
  assert.deepEqual(different.missing, ['family.jpg']);
});

test('@claim:demo-content browser sample matches a freshly generated CLI report', { timeout: 60_000 }, async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-demo-content-'));
  const workspace = join(sandbox, 'demo');
  const result = run(['demo', '--output', workspace, '--json']);
  assert.equal(result.status, 0, result.stderr);
  const cliStatus = JSON.parse(result.stdout);
  const report = join(workspace, 'migration-report');
  const audit = JSON.parse(await readFile(join(report, 'audit.json'), 'utf8'));
  const inventory = JSON.parse(await readFile(join(report, 'source-inventory.json'), 'utf8'));
  const manifest = JSON.parse(await readFile(join(report, 'manifest.json'), 'utf8'));
  const reportFiles = (await readdir(report)).sort();
  const matchPaths = new Set(audit.matches.filter((item) => item.method === 'sha256').map((item) => item.source_path));
  const expectedRows = inventory.assets.map((asset) => {
    const exception = audit.exceptions.find((item) => item.source_path === asset.relative_path);
    const resultText = exception ? 'Named exception' : matchPaths.has(asset.relative_path) ? 'Matched' : 'Unexplained';
    let evidence = 'SHA-256';
    if (exception) {
      assert.match(exception.reason, /second encrypted backup/i);
      evidence = 'Second encrypted backup';
    }
    else if (asset.albums.length) evidence = 'SHA-256 and album label';
    else if (asset.sidecar_found) evidence = 'SHA-256 and export note';
    else if (asset.edited_version) evidence = 'SHA-256 and edit warning';
    return {
      name: asset.file_name,
      year: asset.relative_path.match(/Photos from (\d{4})/)?.[1] || '',
      evidence,
      result: resultText,
    };
  }).sort((left, right) => left.name.localeCompare(right.name));

  const expectedTotals = [audit.source_assets, audit.matched_assets, audit.excepted_assets, audit.missing.length - audit.exceptions.length];
  assert.deepEqual(expectedTotals, [6, 5, 1, 0]);
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#result-title').textContent(), cliStatus.status === 'ready_for_cutover' ? 'Ready to review' : 'On hold');
    assert.equal(await page.locator('.demo-result > strong').textContent(), `${audit.accounted_percent.toFixed(3)}% explained`);
    assert.deepEqual(await page.locator('.demo-counts dd').allTextContents(), expectedTotals.map(String));
    const browserRows = (await page.locator('.demo-ledger tbody tr').evaluateAll((rows) => rows.map((row) => {
      const cells = [...row.querySelectorAll('td')].map((cell) => cell.textContent.trim());
      return { name: cells[0], year: cells[1], evidence: cells[2], result: cells[3] };
    }))).sort((left, right) => left.name.localeCompare(right.name));
    assert.deepEqual(browserRows, expectedRows);
    assert.equal(await page.locator('.report-mark small').textContent(), `signed by ${manifest.signed_by}`);
    const browserFiles = (await page.locator('.demo-details').nth(1).locator('li').allTextContents()).sort();
    assert.deepEqual(browserFiles, reportFiles);
    await context.close();
  } finally {
    await browser.close();
  }
});

test('@claim:readiness-rules hold conditions are separate from non-blocking edit warnings', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-readiness-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const readyAudit = JSON.parse(await readFile(join(workspace, 'migration-report', 'audit.json'), 'utf8'));
  assert.equal(readyAudit.ready, true);
  assert.ok(readyAudit.warnings.some((warning) => warning.startsWith('Edited-looking files were found.')));

  const noExceptions = join(workspace, 'no-exceptions.json');
  await writeFile(noExceptions, '{"exceptions":[],"album_exceptions":[]}');
  const missing = run(['run', '--source', join(workspace, 'source'), '--source-kind', 'takeout', '--destination', join(workspace, 'archive'), '--policies', join(workspace, 'policies.json'), '--exceptions', noExceptions, '--out', join(workspace, 'missing-hold'), '--sign', 'Morgan family', '--json']);
  assert.equal(missing.status, 2, missing.stderr);

  const unsafePolicies = JSON.parse(await readFile(join(workspace, 'policies.json'), 'utf8'));
  unsafePolicies.original_cloud_retention_days = 7;
  await writeFile(join(workspace, 'unsafe-policies.json'), JSON.stringify(unsafePolicies));
  const unsafe = run(['run', '--source', join(workspace, 'source'), '--source-kind', 'takeout', '--destination', join(workspace, 'archive'), '--policies', join(workspace, 'unsafe-policies.json'), '--exceptions', join(workspace, 'exceptions.json'), '--out', join(workspace, 'unsafe-hold'), '--sign', 'Morgan family', '--json']);
  assert.equal(unsafe.status, 2, unsafe.stderr);
  assert.equal(JSON.parse(unsafe.stdout).status, 'hold');

  const albumRoot = join(sandbox, 'album-only');
  await mkdir(join(albumRoot, 'source', 'Takeout', 'Google Photos', 'Family Album'), { recursive: true });
  await mkdir(join(albumRoot, 'archive'), { recursive: true });
  await writeFile(join(albumRoot, 'source', 'Takeout', 'Google Photos', 'Family Album', 'family.jpg'), 'same family photo');
  await writeFile(join(albumRoot, 'archive', 'family.jpg'), 'same family photo');
  const albumHold = run(['run', '--source', join(albumRoot, 'source'), '--source-kind', 'takeout', '--destination', join(albumRoot, 'archive'), '--policies', join(workspace, 'policies.json'), '--out', join(albumRoot, 'report'), '--sign', 'Morgan family', '--json']);
  assert.equal(albumHold.status, 2, albumHold.stderr);
  const albumAudit = JSON.parse(await readFile(join(albumRoot, 'report', 'audit.json'), 'utf8'));
  assert.deepEqual(albumAudit.missing, []);
  assert.deepEqual(albumAudit.unresolved_source_albums_missing_at_destination, ['Family Album']);
});

test('@claim:read-only-local the CLI leaves inputs unchanged and attempts no network sockets', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-local-'));
  const workspace = join(sandbox, 'demo');
  const networkLog = join(sandbox, 'network-attempts.log');
  await writeFile(networkLog, '');
  const demo = runGuarded(['demo', '--output', workspace, '--json'], networkLog);
  assert.equal(demo.status, 0, demo.stderr);
  const before = await treeDigest(join(workspace, 'source'));
  const destinationBefore = await treeDigest(join(workspace, 'archive'));
  const result = runGuarded(['run', '--source', join(workspace, 'source'), '--source-kind', 'takeout', '--destination', join(workspace, 'archive'), '--policies', join(workspace, 'policies.json'), '--exceptions', join(workspace, 'exceptions.json'), '--out', join(workspace, 'second-report'), '--sign', 'Morgan family', '--json'], networkLog);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(await treeDigest(join(workspace, 'source')), before);
  assert.deepEqual(await treeDigest(join(workspace, 'archive')), destinationBefore);
  assert.equal(await readFile(networkLog, 'utf8'), '', 'runtime guard recorded an IPv4 or IPv6 socket attempt');
});

test('@claim:device-policy-report report records two devices and all four choices', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-devices-'));
  const workspace = join(sandbox, 'demo');
  assert.equal(run(['demo', '--output', workspace, '--json']).status, 0);
  const report = join(workspace, 'migration-report');
  const manifest = JSON.parse(await readFile(join(report, 'manifest.json'), 'utf8'));
  assert.deepEqual(manifest.policies.devices, [
    { name: "Alex's phone", owner: 'Alex Morgan', backup_mode: 'backup', deletion_behavior: 'manual_review', conflict_policy: 'keep_both', offline_behavior: 'queue_until_online' },
    { name: "Sam's phone", owner: 'Sam Morgan', backup_mode: 'backup', deletion_behavior: 'manual_review', conflict_policy: 'keep_both', offline_behavior: 'manual_retry' },
  ]);
  const markdown = await readFile(join(report, 'CUTOVER.md'), 'utf8');
  for (const expected of ["Alex's phone — Alex Morgan", "Sam's phone — Sam Morgan", 'Upload: backup', 'Deletions: manual review', 'Conflicts: keep both', 'Offline: queue until online', 'Offline: manual retry']) {
    assert.ok(markdown.includes(expected), `CUTOVER.md is missing ${expected}`);
  }
});

test('@claim:album-exception-gate an album-only gap holds until its named resolution is recorded', async () => {
  const sandbox = await mkdtemp(join(tmpdir(), 'pem-claim-album-'));
  const source = join(sandbox, 'source', 'Takeout', 'Google Photos', 'Family Album');
  const destination = join(sandbox, 'archive');
  await mkdir(source, { recursive: true });
  await mkdir(destination, { recursive: true });
  await writeFile(join(source, 'family.jpg'), 'same family photo');
  await writeFile(join(destination, 'family.jpg'), 'same family photo');
  const heldExceptions = join(sandbox, 'held-exceptions.json');
  const readyExceptions = join(sandbox, 'ready-exceptions.json');
  await writeFile(heldExceptions, '{"exceptions":[],"album_exceptions":[]}');
  await writeFile(readyExceptions, JSON.stringify({ exceptions: [], album_exceptions: [{ album: 'Family Album', reason: 'Reviewer recreated this label in the archive catalog.' }] }));
  const common = ['run', '--source', join(sandbox, 'source'), '--source-kind', 'takeout', '--destination', destination, '--policies', 'examples/policies.json', '--sign', 'Morgan family', '--json'];
  const held = run([...common, '--exceptions', heldExceptions, '--out', join(sandbox, 'held')]);
  assert.equal(held.status, 2, held.stderr);
  const heldAudit = JSON.parse(await readFile(join(sandbox, 'held', 'audit.json'), 'utf8'));
  assert.deepEqual(heldAudit.missing, []);
  assert.deepEqual(heldAudit.unresolved_source_albums_missing_at_destination, ['Family Album']);
  const ready = run([...common, '--exceptions', readyExceptions, '--out', join(sandbox, 'ready')]);
  assert.equal(ready.status, 0, ready.stderr);
  const manifest = JSON.parse(await readFile(join(sandbox, 'ready', 'manifest.json'), 'utf8'));
  assert.equal(manifest.status, 'ready_for_cutover');
  assert.equal(manifest.audit.album_exceptions[0].album, 'Family Album');
});

test('@claim:no-tracking public routes use only allowlisted static resources and cache only the documented app shell', async () => {
  const readme = await readFile('README.md', 'utf8');
  assert.match(readme, /The demo does not store your family data\. Its offline cache keeps the static app and bundled sample page\./, 'README must distinguish family data from the bundled sample page cached for offline use');
  const browser = await chromium.launch();
  const allowedFixed = new Set(['/archive-landscape.webp', '/mark.svg', '/apple-touch-icon.png', '/sw.js']);
  const worker = await readFile(join(siteRoot, 'sw.js'), 'utf8');
  const shellMatch = worker.match(/^const SHELL = (.+);$/m);
  assert.ok(shellMatch, 'generated service worker exposes its documented static shell');
  const documentedCachePaths = JSON.parse(shellMatch[1]).sort();
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      globalThis.__pemBeaconCalls = [];
      Object.defineProperty(navigator, 'sendBeacon', {
        configurable: true,
        value: (...args) => { globalThis.__pemBeaconCalls.push(args.map(String)); return false; },
      });
    });
    const page = await context.newPage();
    const requests = [];
    page.on('request', (request) => requests.push(request.url()));
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    if (path === '/privacy/') {
      const privacyCopy = await page.locator('main').textContent();
      assert.match(privacyCopy, /The offline cache keeps the static app and bundled sample page\. It never adds user-entered or family data to that cache\./, 'privacy copy must disclose the bundled sample page in Cache Storage');
    }
    for (const raw of requests) {
      const url = new URL(raw);
      assert.equal(url.origin, new URL(base).origin, `third-party request on ${path}: ${raw}`);
      assert.equal(url.search, '', `unexpected query request on ${path}: ${raw}`);
      const allowed = url.pathname === path || allowedFixed.has(url.pathname) || /^\/assets\/[a-zA-Z0-9_-]+\.(?:js|css)$/.test(url.pathname) || /^\/fonts\/[a-z0-9-]+\.woff2$/.test(url.pathname);
      assert.equal(allowed, true, `unexpected first-party endpoint on ${path}: ${url.pathname}`);
    }
    const state = await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      const opfs = [];
      if (navigator.storage?.getDirectory) {
        const root = await navigator.storage.getDirectory();
        for await (const name of root.keys()) opfs.push(name);
      }
      const cacheNames = await caches.keys();
      const cacheRequests = (await Promise.all(cacheNames.map(async (name) => (await caches.open(name)).keys()))).flat();
      return {
        local: localStorage.length,
        session: sessionStorage.length,
        cookies: document.cookie,
        indexedDb: indexedDB.databases ? (await indexedDB.databases()).map((database) => database.name) : [],
        opfs,
        beacons: globalThis.__pemBeaconCalls,
        cacheNames,
        cacheEntries: cacheRequests.map((request) => {
          const url = new URL(request.url);
          return { method: request.method, pathname: url.pathname, search: url.search };
        }),
      };
    });
    assert.deepEqual({ local: state.local, session: state.session, cookies: state.cookies, indexedDb: state.indexedDb, opfs: state.opfs, beacons: state.beacons }, { local: 0, session: 0, cookies: '', indexedDb: [], opfs: [], beacons: [] }, path);
    assert.equal(state.cacheNames.length, 1, `${path} has one versioned app-shell cache`);
    assert.match(state.cacheNames[0], /^photo-exit-manifest-[a-f0-9]{12}$/);
    assert.ok(state.cacheEntries.every((entry) => entry.method === 'GET' && entry.search === ''), `${path} cache has static GET URLs without user or sample query data`);
    assert.deepEqual(state.cacheEntries.map((entry) => entry.pathname).sort(), documentedCachePaths, `${path} cache contains only the documented static shell`);
    await context.close();
  }
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

test('@claim:package-contract package compiles with Rust 1.85 and is an MIT-licensed single CLI', async () => {
  const targetDirectory = await mkdtemp(join(tmpdir(), 'pem-rust-1.85-target-'));
  const compiler = spawnSync('rustup', ['run', '1.85.0', 'rustc', '--version'], { encoding: 'utf8' });
  assert.equal(compiler.status, 0, `Rust 1.85.0 is required for the compatibility claim:\n${compiler.stderr}`);
  assert.match(compiler.stdout, /^rustc 1\.85\.0 /);
  const compatibilityBuild = spawnSync('cargo', ['+1.85.0', 'test', '--locked', '--all-targets', '--no-run', '--target-dir', targetDirectory], {
    encoding: 'utf8',
    timeout: 300_000,
  });
  assert.equal(compatibilityBuild.status, 0, `locked package does not compile with Rust 1.85.0:\n${compatibilityBuild.stdout}\n${compatibilityBuild.stderr}`);
  const metadata = spawnSync('cargo', ['metadata', '--no-deps', '--format-version', '1'], { encoding: 'utf8' });
  assert.equal(metadata.status, 0, metadata.stderr);
  const packageInfo = JSON.parse(metadata.stdout).packages.find((item) => item.name === 'photo-exit-manifest');
  assert.equal(packageInfo.license, 'MIT');
  assert.equal(packageInfo.rust_version, '1.85');
  assert.equal(packageInfo.targets.filter((target) => target.kind.includes('bin')).length, 1);
});

test('@claim:build-artifacts production build creates the documented site and Linux executable', async () => {
  assert.equal((await stat('dist/site/index.html')).isFile(), true);
  const executable = await stat('dist/package/photo-exit-manifest-linux-x86_64');
  assert.equal(executable.isFile(), true);
  assert.notEqual(executable.mode & 0o111, 0, 'packaged CLI is executable');
});

test('@claim:offline-reload sample reloads offline after one online visit', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
  await page.waitForURL(`${base}/demo/`);
  await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)));
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.demo-banner');
  assert.equal(await page.locator('h1').textContent(), 'Review the Morgan family archive check');
  assert.equal(await page.locator('#offline-notice').isVisible(), true);
  await page.goto(`${base}/?demo=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(`${base}/demo/`);
  await page.waitForSelector('.demo-banner');
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
