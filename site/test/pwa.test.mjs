import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { once } from 'node:events';
import { resolve } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const port = 4178;
const base = `http://127.0.0.1:${port}`;
const siteRoot = resolve('dist/site');

async function serveBuiltSite() {
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', base).pathname);
      const relative = pathname === '/'
        ? 'index.html'
        : pathname.endsWith('/')
          ? `${pathname.slice(1)}index.html`
          : pathname.slice(1);
      const file = resolve(siteRoot, relative);
      if (!file.startsWith(`${siteRoot}/`)) throw new Error('invalid path');
      const body = await readFile(file);
      const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
      response.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end();
    }
  });
  server.listen(port, '127.0.0.1');
  await once(server, 'listening');
  return server;
}

async function withBrowser(run) {
  const browser = await chromium.launch();
  try {
    await run(browser);
  } finally {
    await browser.close();
  }
}

test('production worker precaches the hashed shell, survives offline reload, and replaces a prior worker', { timeout: 60_000 }, async () => {
  const worker = await readFile('dist/site/sw.js', 'utf8');
  const match = worker.match(/^const SHELL = (.+);$/m);
  assert.ok(match, 'generated worker has a concrete shell list');
  const shell = JSON.parse(match[1]);
  const hashedAssets = shell.filter((entry) => entry.startsWith('/assets/'));
  assert.ok(hashedAssets.some((entry) => entry.endsWith('.js')), 'hashed application JavaScript is precached');
  assert.ok(hashedAssets.some((entry) => entry.endsWith('.css')), 'hashed application CSS is precached');
  assert.match(worker, /event\.waitUntil\(result\.then/, 'runtime cache writes extend the fetch lifetime');
  assert.match(worker, /event\.request\.mode === 'navigate'/, 'navigation cache lookup ignores query strings');

  const server = await serveBuiltSite();
  try {
    await withBrowser(async (browser) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.waitForFunction(() => navigator.serviceWorker.ready.then(() => Boolean(navigator.serviceWorker.controller)));
      const cachedUrls = await page.evaluate(async () => {
        const keys = await caches.keys();
        const requests = await Promise.all(keys.map(async (key) => (await caches.open(key)).keys()));
        return requests.flat().map((request) => new URL(request.url).pathname);
      });
      for (const asset of hashedAssets) assert.ok(cachedUrls.includes(asset), `${asset} is cached`);
      await context.setOffline(true);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#hero-title');
      assert.equal(pageErrors.length, 0, `offline reload has no page errors: ${pageErrors.join('; ')}`);
      await context.setOffline(false);
      await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
      await context.setOffline(true);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.demo-banner');
      await context.close();
    });

    await withBrowser(async (browser) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const oldWorker = `const CACHE = 'photo-exit-manifest-prior';
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.add('/')).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => event.respondWith(fetch(event.request)));`;
      await writeFile('dist/site/sw.js', oldWorker);
      try {
        await page.goto(base, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => navigator.serviceWorker.ready.then((registration) => registration.active?.scriptURL.endsWith('/sw.js')));
        await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
        await writeFile('dist/site/sw.js', worker);
        const cacheNames = await page.evaluate(async () => {
          const registration = await navigator.serviceWorker.getRegistration();
          const changed = new Promise((resolveChange) => navigator.serviceWorker.addEventListener('controllerchange', resolveChange, { once: true }));
          await registration.update();
          await Promise.race([changed, new Promise((resolveDelay) => setTimeout(resolveDelay, 5_000))]);
          return caches.keys();
        });
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForFunction(async () => !(await caches.keys()).includes('photo-exit-manifest-prior'));
        const settledCacheNames = await page.evaluate(() => caches.keys());
        assert.ok(cacheNames.some((name) => /^photo-exit-manifest-[a-f0-9]{12}$/.test(name)), 'updated worker uses a build-versioned cache');
        assert.ok(!settledCacheNames.includes('photo-exit-manifest-prior'), `updated worker removes the prior cache (found: ${settledCacheNames.join(', ')})`);
      } finally {
        await writeFile('dist/site/sw.js', worker);
        await context.close();
      }
    });
  } finally {
    server.close();
    await once(server, 'close');
  }
});
