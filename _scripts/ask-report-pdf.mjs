import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');
const files = [
  { label: 'Geral',      path: resolve(root, 'ask-1-geral.png') },
  { label: 'Meta Ads',   path: resolve(root, 'ask-2-meta.png') },
  { label: 'Google Ads', path: resolve(root, 'ask-3-google.png') },
  { label: 'Analytics',  path: resolve(root, 'ask-4-analytics.png') },
];

for (const f of files) {
  if (!existsSync(f.path)) {
    console.error('Faltando:', f.path);
    process.exit(1);
  }
}

const pages = files.map(f => {
  const b64 = readFileSync(f.path).toString('base64');
  return `<section><img src="data:image/png;base64,${b64}" alt="${f.label}" /></section>`;
}).join('\n');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @page { size: A4 landscape; margin: 0; }
  html, body { margin: 0; padding: 0; background: #000; }
  section { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; page-break-after: always; }
  section:last-child { page-break-after: auto; }
  img { max-width: 100%; max-height: 100%; display: block; }
</style></head><body>
${pages}
</body></html>`;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
const out = resolve(root, 'ask-relatorio-2026-04-01_a_2026-04-30.pdf');
await page.pdf({
  path: out,
  format: 'A4',
  landscape: true,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await browser.close();
console.log('PDF:', out);
