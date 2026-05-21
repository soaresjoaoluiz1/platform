/* Simplest: trim white edges + center on sky-50, sem cover crop */
const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';
const SKY_HEX = '#f3f9fd';

const MAP = [
  ['cx0.png', 'hero-cx-1.jpg'],
  ['cx1.png', 'hero-cx-2.jpg'],
  ['cx2.png', 'hero-cx-3.jpg'],
  ['cx4.png', 'hero-cx-4.jpg'],
];

(async () => {
  for (const [src, dst] of MAP) {
    // 1. flatten alpha em white (caso PNG tenha transparencia)
    // 2. trim white edges (border, threshold default)
    // 3. extend pad com sky-50 pra ficar 1:1
    const trimmed = await sharp(SRC_DIR + src)
      .flatten({ background: '#ffffff' })
      .trim({ background: '#ffffff', threshold: 10 })
      .toBuffer();
    const meta = await sharp(trimmed).metadata();
    const side = Math.max(meta.width, meta.height) + Math.floor(Math.max(meta.width, meta.height) * 0.08); // 8% padding
    const padX = Math.floor((side - meta.width) / 2);
    const padY = Math.floor((side - meta.height) / 2);
    const buf = await sharp(trimmed)
      .extend({ top: padY, bottom: side - meta.height - padY, left: padX, right: side - meta.width - padX, background: SKY_HEX })
      .resize({ width: 1200, height: 1200, fit: 'fill' })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
