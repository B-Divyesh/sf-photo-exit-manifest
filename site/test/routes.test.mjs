import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const routes = [
  ['site/index.html', 'Photo Exit Manifest — Verify a photo archive', 'https://photo-exit-manifest.sociobot.in/'],
  ['site/demo/index.html', 'Demo — Photo Exit Manifest', 'https://photo-exit-manifest.sociobot.in/demo/'],
  ['site/privacy/index.html', 'Privacy — Photo Exit Manifest', 'https://photo-exit-manifest.sociobot.in/privacy/'],
  ['site/terms/index.html', 'Terms — Photo Exit Manifest', 'https://photo-exit-manifest.sociobot.in/terms/'],
  ['site/404.html', 'Page not found — Photo Exit Manifest', 'https://photo-exit-manifest.sociobot.in/404.html'],
];

test('every route has its own title, canonical and social metadata', async () => {
  for (const [file, title, canonical] of routes) {
    const html = await readFile(file, 'utf8');
    assert.match(html, new RegExp(`<title>${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`));
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${file} canonical`);
    assert.ok(html.includes('property="og:image"'), `${file} Open Graph image`);
    assert.ok(html.includes('name="twitter:card"'), `${file} Twitter card`);
    assert.ok(html.includes('rel="apple-touch-icon"'), `${file} Apple touch icon`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file} has one h1`);
  }
});

test('static host rewrites missing paths to the designed 404 without a home fallback', async () => {
  const config = JSON.parse(await readFile('site/public/staticwebapp.config.json', 'utf8'));
  assert.equal(config.responseOverrides['404'].rewrite, '/404.html');
  assert.equal(config.navigationFallback, undefined);
});

test('each registered claim has exactly one matching tagged test', async () => {
  const claims = JSON.parse(await readFile('.factory/claims.json', 'utf8'));
  const tests = await readFile('site/test/claims.test.mjs', 'utf8');
  const ids = claims.map((claim) => claim.id);
  assert.equal(new Set(ids).size, ids.length, 'claim IDs are unique');
  for (const claim of claims) {
    assert.equal(claim.test, `npm run test:claims -- @claim:${claim.id}`);
    const tag = `@claim:${claim.id}`;
    assert.equal(tests.split(tag).length - 1, 1, `${tag} occurs exactly once`);
  }
  const tags = [...tests.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
  assert.deepEqual(tags.sort(), [...ids].sort(), 'no tagged test is outside the registry');
});

test('catalog description is verb-first and within 120 characters', async () => {
  const description = (await readFile('.factory/catalog-description.txt', 'utf8')).trim();
  assert.ok(description.length <= 120, `${description.length} characters`);
  assert.match(description, /^(?:Check|Verify|Compare|Create|Review)\b/);
});
