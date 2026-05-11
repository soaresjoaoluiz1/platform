const { chromium } = require('C:\\Users\\usuar\\AppData\\Local\\npm-cache\\_npx\\9833c18b2d85bc59\\node_modules\\playwright-core');

const BASE = 'C:\\Users\\usuar\\Downloads\\Open Squad\\xquads\\squads\\design-squad\\output\\josi-terapeuta-ds\\social';
const BASE_URL = BASE.replace(/\\/g, '/');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const ctx = await browser.newContext();

  // ── FEED POST: 1080×1080 ──────────────────────────────────
  console.log('Rendering feed post...');
  const feed = await ctx.newPage();
  await feed.setViewportSize({ width: 1080, height: 1080 });
  await feed.goto('file:///' + BASE_URL + '/feed-post.html', { waitUntil: 'networkidle' });
  await feed.waitForTimeout(2000);
  const canvas = await feed.$('.canvas');
  await canvas.screenshot({ path: BASE + '\\feed-post.png', type: 'png' });
  console.log('  OK feed-post.png');
  await feed.close();

  // ── STORIES: each story screenshotted individually ─────────
  const storyConfigs = [
    { n: 1, label: 'story-1-dor' },
    { n: 2, label: 'story-2-solucao' },
    { n: 3, label: 'story-3-cta' },
  ];

  for (const cfg of storyConfigs) {
    console.log('Rendering ' + cfg.label + '...');
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1500, height: 900 });
    await page.goto('file:///' + BASE_URL + '/stories.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    const el = await page.$('.story-wrapper:nth-child(' + cfg.n + ') .story');
    await el.screenshot({ path: BASE + '\\' + cfg.label + '.png', type: 'png' });
    console.log('  OK ' + cfg.label + '.png');
    await page.close();
  }

  await browser.close();
  console.log('Done! Files saved to: ' + BASE);
})().catch(err => { console.error(err); process.exit(1); });
