import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test, { after, before } from 'node:test';
import { chromium } from 'playwright';
import axe from 'axe-core';

const siteRoot = resolve('dist/site');
let server;
let base;

before(async () => {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://local').pathname);
      const relative = pathname === '/' ? 'index.html' : pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1);
      const file = resolve(siteRoot, relative);
      if (!file.startsWith(`${siteRoot}/`)) throw new Error('invalid path');
      const body = await readFile(file);
      const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.webp') ? 'image/webp' : file.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
      response.writeHead(200, { 'content-type': type, 'cache-control': 'no-cache' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'content-type': 'text/html' });
      response.end(await readFile(resolve(siteRoot, '404.html')));
    }
  });
  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolveClose) => server.close(resolveClose));
});

test('mobile and desktop routes have no serious accessibility, overflow or console defects', async () => {
  const browser = await chromium.launch();
  try {
    for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
      for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 900 }]) {
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();
        const errors = [];
        page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('pageerror', (error) => errors.push(error.message));
        const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, path);
        assert.equal(await page.locator('h1').count(), 1, `${path} one h1`);
        assert.equal(await page.locator('main').count(), 1, `${path} main landmark`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true, `${path} ${viewport.width}px no horizontal overflow`);
        await page.addScriptTag({ content: axe.source });
        const violations = await page.evaluate(() => globalThis.axe.run(document, { resultTypes: ['violations'] }));
        const serious = violations.violations.filter((item) => ['serious', 'critical'].includes(item.impact));
        assert.deepEqual(serious.map((item) => item.id), [], `${path} ${viewport.width}px axe: ${serious.map((item) => item.id).join(', ')}`);
        assert.deepEqual(errors, [], `${path} ${viewport.width}px console`);
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
});

test('the phone first screen states the job and opens the isolated demo in one click', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').textContent(), 'Verify your family photo archive before leaving the cloud');
  const action = page.getByRole('link', { name: 'Try it with sample data' }).first();
  assert.equal(await action.isVisible(), true);
  assert.ok((await action.boundingBox()).y < 844, 'primary action appears in the first phone viewport');
  const facts = await page.locator('.hero-facts li').evaluateAll((items) => items.map((item) => ({ text: item.textContent.trim(), bottom: item.getBoundingClientRect().bottom })));
  assert.deepEqual(facts.map((fact) => fact.text), ['Does not change source folders', 'No photos uploaded', 'Free command-line tool']);
  assert.equal(facts.every((fact) => fact.bottom <= 844), true, 'all three facts appear in the first phone viewport');
  await action.click();
  await page.waitForURL(`${base}/demo/`);
  await page.getByText('Demo — sample data, nothing is saved').waitFor();
  const details = page.locator('details').first();
  await details.locator('summary').click();
  assert.equal(await details.getAttribute('open'), '');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await details.getAttribute('open'), null);
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('main h1')), true);
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
  await context.close();
  await browser.close();
});

test('navigation, focus restoration, metadata and local links work as real routes', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
  await page.waitForURL(`${base}/privacy/`);
  assert.equal(await page.title(), 'Privacy — Photo Exit Manifest');
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('main h1')), true);
  await page.goBack();
  assert.equal(await page.title(), 'Photo Exit Manifest — Verify a photo archive');
  assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('main h1')), true);

  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
    const metadata = await page.evaluate(() => ({
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      og: document.querySelector('meta[property="og:image"]')?.content,
      twitter: document.querySelector('meta[name="twitter:card"]')?.content,
      apple: document.querySelector('link[rel="apple-touch-icon"]')?.href,
    }));
    assert.ok(metadata.canonical);
    assert.equal(metadata.og, 'https://photo-exit-manifest.sociobot.in/social-card.webp');
    assert.equal(metadata.twitter, 'summary_large_image');
    assert.ok(metadata.apple.endsWith('/apple-touch-icon.png'));
  }

  await page.goto(base);
  const localPaths = await page.locator('a[href]').evaluateAll((links) => [...new Set(links.map((link) => new URL(link.href).href).filter((href) => new URL(href).origin === location.origin && !new URL(href).hash))]);
  for (const url of localPaths) {
    const response = await context.request.get(url);
    assert.equal(response.status(), 200, url);
  }
  await context.close();
  await browser.close();
});

test('keyboard focus and reduced-motion treatments remain visible and stable', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base);
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  assert.equal(await skip.evaluate((element) => document.activeElement === element), true);
  const style = await skip.evaluate((element) => ({ outline: getComputedStyle(element).outlineWidth, motion: getComputedStyle(element).transitionDuration, scroll: getComputedStyle(document.documentElement).scrollBehavior }));
  assert.equal(style.outline, '3px');
  assert.equal(style.scroll, 'auto');
  assert.ok(parseFloat(style.motion) <= 0.00001, style.motion);
  const smallTargets = await page.locator('a, button').evaluateAll((items) => items.filter((item) => {
    const box = item.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && (box.width < 44 || box.height < 44);
  }).map((item) => ({ text: item.textContent.trim(), box: item.getBoundingClientRect().toJSON() })));
  assert.deepEqual(smallTargets, [], JSON.stringify(smallTargets));
  await context.close();
  await browser.close();
});
