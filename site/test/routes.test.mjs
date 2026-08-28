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
