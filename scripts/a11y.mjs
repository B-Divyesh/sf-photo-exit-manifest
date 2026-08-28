import { chromium } from 'playwright';
import axe from 'axe-core';

const base = process.argv[2] || 'http://127.0.0.1:4173';
const browser = await chromium.launch();
let failures = 0;
for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
  for (const viewport of [{ width: 1366, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, bypassCSP: true });
    const page = await context.newPage();
    await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axe.source });
    const result = await page.evaluate(() => globalThis.axe.run(document, { resultTypes: ['violations'] }));
    const serious = result.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical');
    failures += serious.length;
    console.log(`${path} ${viewport.width}px: ${result.violations.length} violations, ${serious.length} serious/critical`);
    for (const violation of serious) console.log(`  ${violation.id}: ${violation.help}`);
    await context.close();
  }
}
await browser.close();
process.exit(failures ? 1 : 0);
