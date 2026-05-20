/**
 * Otimiza as 3 imagens do hero — alternando entre Pizza Pitzz, Aló Pizza e Leal Pizzas.
 */
const sharp = require('sharp');
const fs = require('fs');

const SOURCES = [
  ['box-paper-img (1).png', 'hero-pizza-1.jpg'],  // Pizza Pitzz vermelha
  ['box-paper-img (3).png', 'hero-pizza-2.jpg'],  // Pizza Pitzz + Aló Pizza forno a lenha
  ['box-paper-img (7).png', 'hero-pizza-3.jpg'],  // Leal Pizzas cinza com fatia + qrcode
];
const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';

(async () => {
  for (const [src, dst] of SOURCES) {
    const buf = await sharp(SRC_DIR + src)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
