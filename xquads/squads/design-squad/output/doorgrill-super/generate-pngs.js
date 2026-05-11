const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = __dirname;
const IMG_DIR = 'C:/Users/usuar/Downloads/drive-download-20260325T172532Z-3-001';
const CHROMIUM_EXEC = 'C:/Users/usuar/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe';

const files = [
  { file: 'v1-feed.html',  out: 'doorgrill-v1-feed.png',  w: 1080, h: 1080 },
  { file: 'v2-feed.html',  out: 'doorgrill-v2-feed.png',  w: 1080, h: 1080 },
  { file: 'v1-story.html', out: 'doorgrill-v1-story.png', w: 1080, h: 1920 },
  { file: 'v2-story.html', out: 'doorgrill-v2-story.png', w: 1080, h: 1920 },
];

function embedImages(html) {
  return html.replace(/file:\/\/\/C:\/Users\/usuar\/Downloads\/drive-download-20260325T172532Z-3-001\/([^"'\s]+)/g, (match, filename) => {
    try {
      const imgPath = path.join(IMG_DIR, filename);
      const data = fs.readFileSync(imgPath);
      const ext = path.extname(filename).replace('.', '').toLowerCase();
      const mime = (ext === 'jpg' || ext === 'jpeg') ? 'image/jpeg' : `image/${ext}`;
      return `data:${mime};base64,${data.toString('base64')}`;
    } catch (e) {
      console.error('Could not embed image:', filename, e.message);
      return match;
    }
  });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_EXEC,
    headless: true,
  });

  for (const { file, out, w, h } of files) {
    console.log(`Processing ${file}...`);

    const htmlPath = path.join(OUTPUT_DIR, file);
    let html = fs.readFileSync(htmlPath, 'utf8');
    html = embedImages(html);

    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // wait for fonts/animations

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
  console.log('\nAll PNGs generated!');
})();
