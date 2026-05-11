const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME = 'C:\\Users\\usuar\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe';
const baseDir = __dirname;

const files = [
  { html: 'v1-feed.html',  out: 'doorgrill-v1-feed-oc.png',   w: 1080, h: 1080 },
  { html: 'v1-story.html', out: 'doorgrill-v1-story-oc.png',  w: 1080, h: 1920 },
  { html: 'v2-feed.html',  out: 'doorgrill-v2-feed-oc.png',   w: 1080, h: 1080 },
  { html: 'v2-story.html', out: 'doorgrill-v2-story-oc.png',  w: 1080, h: 1920 },
];

for (const f of files) {
  const fileUrl = 'file:///' + path.join(baseDir, f.html).replace(/\\/g, '/');
  const outPath = path.join(baseDir, f.out);
  const tmpDir = path.join(baseDir, '.chrome-tmp-' + f.html + '-oc');

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });

  const cmd = [
    `"${CHROME}"`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-web-security',
    '--allow-file-access-from-files',
    `--window-size=${f.w},${f.h}`,
    `--screenshot="${outPath}"`,
    `--user-data-dir="${tmpDir}"`,
    `"${fileUrl}"`
  ].join(' ');

  console.log('Capturing:', f.html, '→', f.out);
  try {
    execSync(cmd, { timeout: 15000, stdio: 'pipe' });
    console.log('  ✓ saved', f.out);
  } catch (e) {
    console.error('  ✗ error:', e.message);
  }

  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
}

console.log('\nDone! opencode');
