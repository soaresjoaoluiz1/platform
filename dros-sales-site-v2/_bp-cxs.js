const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';

const MAP = [
  ['cx0.png', 'hero-cx-1.jpg'],  // La Fornaia preta
  ['cx1.png', 'hero-cx-2.jpg'],  // Vila Brasil kraft
  ['cx2.png', 'hero-cx-3.jpg'],  // Via Roma vermelha
  ['cx4.png', 'hero-cx-4.jpg'],  // Via Roma preta
];

(async () => {
  for (const [src, dst] of MAP) {
    const buf = await sharp(SRC_DIR + src)
      .flatten({ background: '#ffffff' })   // achata transparência pra branco
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 86, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
