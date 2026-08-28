import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { once } from 'node:events';
import { chromium } from 'playwright';

const root = resolve('dist/site');
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url || '/', 'http://local').pathname;
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = resolve(root, relative);
    if (!file.startsWith(`${root}/`)) throw new Error('invalid path');
    const body = await readFile(file);
    const type = file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.woff2') ? 'font/woff2' : 'text/html';
    response.writeHead(200, { 'content-type': type });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end();
  }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });

const landing = await page.evaluate(() => {
  const text = (selector) => [...document.querySelectorAll(selector)].map((node) => node.textContent.trim()).filter(Boolean);
  const prose = [
    ...text('main h1'),
    ...text('.hero-action > span'),
    ...text('main p:not(.eyebrow)'),
    ...[...document.querySelectorAll('.evidence-strip > div')].map((item) => `${item.querySelector('strong')?.textContent.trim()} ${item.querySelector('span')?.textContent.trim()}.`),
    ...text('footer > p:not(.build-note)'),
  ];
  return {
    prose,
    labels: [...new Set([...text('main h2, main h3, main .eyebrow'), ...text('.hero-facts > li'), ...text('main a.button, main button')])],
  };
});
await browser.close();
server.close();
await once(server, 'close');

function sentences(text) {
  return text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
}

function cleanMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/:$/, '.');
}

function readmeParagraphs(markdown) {
  const paragraphs = [];
  let block = [];
  let fenced = false;
  const flush = () => {
    if (block.length) paragraphs.push(cleanMarkdown(block.join(' ')));
    block = [];
  };
  for (const line of markdown.split(/\r?\n/)) {
    if (line.startsWith('```')) { flush(); fenced = !fenced; continue; }
    if (fenced || /^\s*(?:#|- )/.test(line)) { flush(); continue; }
    if (!line.trim()) flush();
    else block.push(line.trim());
  }
  flush();
  return paragraphs.filter(Boolean);
}

function count(text) {
  return text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
}

const landingSentences = landing.prose.flatMap(sentences);
const readme = await readFile('README.md', 'utf8');
const readmeSentences = readmeParagraphs(readme).flatMap(sentences);
const banned = /\b(?:leverage|seamless|effortless|robust|powerful|intuitive|reimagine|supercharge|delightful|journey|ecosystem|AI-powered)\b/i;
const flags = [...landingSentences.map((sentence) => ['Landing', sentence]), ...readmeSentences.map((sentence) => ['README', sentence])]
  .filter(([, sentence]) => count(sentence) > 22 || banned.test(sentence));

function table(items) {
  return ['| Words | Exact text |', '| ---: | --- |', ...items.map((item) => `| ${count(item)} | ${item.replaceAll('|', '\\|')} |`)].join('\n');
}

const output = `# Copy audit — polish 4

Generated from the production landing page and README on 28 August 2026 with \`npm run audit:copy\`.

Token rule: collapse whitespace, then count whitespace-delimited tokens. Hyphenated words and file tokens count once. Markdown links count as their visible labels. Code blocks and file-list items are excluded.

## Landing-page prose

${table(landingSentences)}

## Landing headings, labels, and actions

${table(landing.labels)}

## README prose

${table(readmeSentences)}

## Flags

${flags.length ? flags.map(([place, sentence]) => `- ${place}: ${count(sentence)} words — ${sentence}`).join('\n') : 'No landing or README sentence exceeds 22 words or contains a banned marketing term.'}

## Terminology

| Concept | One term used |
| --- | --- |
| The comparison result | audit |
| The five output files together | signed migration report |
| The old-to-new service event | switch from Google Photos |
| A reviewed missing item | named exception |
| The independent destination | family archive |
| The sample experience | demo |

“Google export note” is the site’s plain-language term for an adjacent Google Takeout JSON file. The CLI keeps \`takeout\` as its command argument.
`;

await writeFile('.factory/copy-audit.md', output);
console.log(`Wrote .factory/copy-audit.md with ${landingSentences.length} landing sentences and ${readmeSentences.length} README sentences.`);
