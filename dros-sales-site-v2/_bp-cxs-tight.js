/* Re-otimiza JPG com leve trim/zoom no caixa pra eliminar a moldura branca extra */
const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';

const MAP = [
  ['cx0.png', 'hero-cx-1.jpg'],
  ['cx1.png', 'hero-cx-2.jpg'],
  ['cx2.png', 'hero-cx-3.jpg'],
  ['cx4.png', 'hero-cx-4.jpg'],
];

// remove pngs antigos pra evitar conflito
for (const [, dst] of MAP) {
  const oldPng = DST_DIR + dst.replace('.jpg', '.png');
  if (fs.existsSync(oldPng)) { fs.unlinkSync(oldPng); console.log('rm', oldPng); }
}

(async () => {
  for (const [src, dst] of MAP) {
    // Trim corta as bordas brancas e deixa só a caixa, depois enquadra com pequeno padding
    const buf = await sharp(SRC_DIR + src)
      .trim({ background: '#ffffff', threshold: 12 })
      .resize({ width: 1200, height: 1200, fit: 'contain', background: '#f3f9fd' })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
