/**
 * Replace box-paper images with new professional ones.
 * Output JPEG (~120-180KB each). Delete old .png variants and write .jpg.
 * HTMLs need to be patched to reference .jpg afterwards.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-images';
const TARGETS = [
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v7-pre-rollback-backup\\assets\\img',
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v3-editorial\\assets\\img',
];

const MAPPING = {
  'hero-mockup.jpg':         'ChatGPT Image 19 de mai. de 2026, 14_56_03 (6).png',
  'caixa-personalizada.jpg': 'ChatGPT Image 19 de mai. de 2026, 14_55_55.png',
  'entrega-van.jpg':         'ChatGPT Image 19 de mai. de 2026, 14_56_02 (4).png',
  'problema-estoque.jpg':    'ChatGPT Image 19 de mai. de 2026, 14_56_01 (2).png',
  'acabamentos.jpg':         'ChatGPT Image 19 de mai. de 2026, 14_56_06 (9).png',
  'cta-entrega.jpg':         'ChatGPT Image 19 de mai. de 2026, 14_56_07 (10).png',
  'prova-social.jpg':        'ChatGPT Image 19 de mai. de 2026, 14_56_03 (8).png',
};

const TARGET_WIDTH = 1800;

async function optimize(srcPath, dstPath) {
  const buf = await sharp(srcPath)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();
  for (let i = 0; i < 5; i++) {
    try {
      const tmp = dstPath + '.tmp';
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, dstPath);
      return buf.length;
    } catch (e) {
      if (i === 4) throw e;
      await new Promise(r => setTimeout(r, 400));
    }
  }
}

(async () => {
  for (const target of TARGETS) {
    if (!fs.existsSync(target)) { console.log('SKIP (no folder):', target); continue; }
    console.log('\n=== Target:', target);
    for (const [destName, srcName] of Object.entries(MAPPING)) {
      const src = path.join(SRC_DIR, srcName);
      const dst = path.join(target, destName);
      if (!fs.existsSync(src)) { console.log('  MISS:', srcName); continue; }
      const sz = await optimize(src, dst);
      // remove .png legacy
      const legacy = dst.replace(/\.jpg$/, '.png');
      if (fs.existsSync(legacy)) { try { fs.unlinkSync(legacy); } catch {} }
      console.log('  ✓', destName, `(${(sz/1024).toFixed(0)}KB)`);
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
