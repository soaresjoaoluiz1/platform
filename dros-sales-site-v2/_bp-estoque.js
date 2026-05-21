const sharp = require('sharp');
const fs = require('fs');

const SRC = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\estoque-caixas-pizzaria.png';
const DST = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\estoque-caixas.jpg';

(async () => {
  const buf = await sharp(SRC)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();
  fs.writeFileSync(DST, buf);
  console.log('✓ estoque-caixas.jpg', (buf.length/1024).toFixed(0) + 'KB');
})().catch(e => { console.error(e); process.exit(1); });
