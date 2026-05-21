/* Chromakey: pixels brancos → transparente. Preserva o resto. Salva PNG */
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

// limpa jpgs antigos
for (const [, dst] of MAP) {
  const oldJpg = DST_DIR + dst.replace('.png', '.jpg');
  if (fs.existsSync(oldJpg)) fs.unlinkSync(oldJpg);
}

(async () => {
  for (const [src, dst] of MAP) {
    const img = sharp(SRC_DIR + src).ensureAlpha();
    const meta = await img.metadata();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const px = new Uint8Array(data); // RGBA
    const THRESHOLD = 235; // pixels com r,g,b acima → transparent

    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i+1], b = px[i+2];
      if (r >= THRESHOLD && g >= THRESHOLD && b >= THRESHOLD) {
        // gradual transparency: closer to white → mais transparente
        const minC = Math.min(r, g, b);
        const alphaFromColor = Math.max(0, Math.min(255, (minC - THRESHOLD) * 12));
        const alpha = 255 - alphaFromColor;
        px[i+3] = alpha < 30 ? 0 : alpha;
      }
    }

    const out = await sharp(Buffer.from(px), {
      raw: { width: info.width, height: info.height, channels: 4 }
    })
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, out);
    console.log('✓', dst, (out.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
