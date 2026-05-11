import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const htmlPath = resolve('curriculo-joao-luiz-soares.html');
const html = readFileSync(htmlPath, 'utf8');

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.pdf({
  path: 'Curriculo-Joao-Luiz-Soares.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' }
});
await browser.close();
console.log('PDF gerado com sucesso!');
