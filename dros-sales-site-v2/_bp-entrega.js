const sharp = require('sharp');
const fs = require('fs');

const SRC = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\box-paper-entrega.png';
const DST = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\entrega-van.jpg';

(async () => {
  const buf = await sharp(SRC)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();
  fs.writeFileSync(DST, buf);
  console.log('✓ entrega-van.jpg (Box Paper van)', (buf.length/1024).toFixed(0) + 'KB');
})().catch(e => { console.error(e); process.exit(1); });
