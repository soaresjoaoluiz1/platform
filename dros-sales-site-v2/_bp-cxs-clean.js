/* Simplest: composite as caixas direto sobre sky-50 bg */
const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';
const SKY = { r: 243, g: 249, b: 253 }; // #f3f9fd
const SKY_HEX = '#f3f9fd';

const MAP = [
  ['cx0.png', 'hero-cx-1.jpg'],
  ['cx1.png', 'hero-cx-2.jpg'],
  ['cx2.png', 'hero-cx-3.jpg'],
  ['cx4.png', 'hero-cx-4.jpg'],
];

(async () => {
  for (const [src, dst] of MAP) {
    const buf = await sharp(SRC_DIR + src)
      .flatten({ background: SKY_HEX })   // transparente vira sky
      .resize({ width: 1200, height: 1200, fit: 'cover' })  // crop ao invés de contain pra eliminar moldura
      .jpeg({ quality: 88, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
