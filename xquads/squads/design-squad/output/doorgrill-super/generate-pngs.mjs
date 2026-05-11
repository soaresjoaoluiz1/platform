import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = __dirname;
const IMG_DIR = 'C:/Users/usuar/Downloads/drive-download-20260325T172532Z-3-001';

const files = [
  { file: 'v1-feed.html',  out: 'doorgrill-v1-feed.png',  w: 1080, h: 1080 },
  { file: 'v2-feed.html',  out: 'doorgrill-v2-feed.png',  w: 1080, h: 1080 },
  { file: 'v1-story.html', out: 'doorgrill-v1-story.png', w: 1080, h: 1920 },
  { file: 'v2-story.html', out: 'doorgrill-v2-story.png', w: 1080, h: 1920 },
];

// Convert images to base64 so they work in file:// context
function embedImages(html) {
  return html.replace(/file:\/\/\/C:\/Users\/usuar\/Downloads\/drive-download-20260325T172532Z-3-001\/([^"']+)/g, (match, filename) => {
    try {
      const imgPath = path.join(IMG_DIR, filename);
      const data = readFileSync(imgPath);
      const ext = path.extname(filename).replace('.', '');
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
      return `data:${mime};base64,${data.toString('base64')}`;
    } catch (e) {
      console.error('Could not embed image:', filename, e.message);
      return match;
    }
  });
}

const browser = await chromium.launch({ headless: true });

for (const { file, out, w, h } of files) {
  console.log(`Processing ${file}...`);

  const htmlPath = path.join(OUTPUT_DIR, file);
  let html = readFileSync(htmlPath, 'utf8');
  html = embedImages(html);

  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'networkidle' });

  // Wait for fonts
  await page.waitForTimeout(1500);

  // Screenshot the canvas element exactly
  const canvas = await page.$('.canvas');
  const outPath = path.join(OUTPUT_DIR, out);

  if (canvas) {
    await canvas.screenshot({ path: outPath, type: 'png' });
  } else {
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width: w, height: h } });
  }

  await page.close();
  console.log(`  -> saved: ${out}`);
}

await browser.close();
console.log('\nDone! All PNGs generated.');
