/* Re-otimiza mantendo transparência (PNG) */
const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';

const MAP = [
  ['cx0.png', 'hero-cx-1.png'],
  ['cx1.png', 'hero-cx-2.png'],
  ['cx2.png', 'hero-cx-3.png'],
  ['cx4.png', 'hero-cx-4.png'],
];

// remove jpgs antigos
for (const [, dst] of MAP) {
  const oldJpg = DST_DIR + dst.replace('.png', '.jpg');
  if (fs.existsSync(oldJpg)) { fs.unlinkSync(oldJpg); console.log('rm', oldJpg); }
}

(async () => {
  for (const [src, dst] of MAP) {
    const buf = await sharp(SRC_DIR + src)
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ compressionLevel: 9, palette: false })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
