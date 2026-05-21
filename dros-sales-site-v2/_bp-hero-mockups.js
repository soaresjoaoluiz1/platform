const sharp = require('sharp');
const fs = require('fs');

const SOURCES = [
  // Top-view Pizza Pitzz fechada (mockup limpo, vista superior)
  ['c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\box-paper-img (2).png', 'hero-pizza-1.jpg'],
  // BELLA NAPOLI branca isolada (mockup neutro)
  ['c:\\Users\\usuar\\Downloads\\box-paper-images\\caixa branca.png', 'hero-pizza-2.jpg'],
  // VIA ROMA preta isolada (mockup neutro)
  ['c:\\Users\\usuar\\Downloads\\box-paper-images\\caixa-preta.png', 'hero-pizza-3.jpg'],
];
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';

(async () => {
  for (const [src, dst] of SOURCES) {
    if (!fs.existsSync(src)) {
      // tenta caminho alternativo
      const alt = src.replace('box-paper-images', 'box-paper-site-images');
      if (fs.existsSync(alt)) {
        const buf = await sharp(alt)
          .resize({ width: 1400, withoutEnlargement: true })
          .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
          .toBuffer();
        fs.writeFileSync(DST_DIR + dst, buf);
        console.log('✓', dst, '(via alt path)', (buf.length/1024).toFixed(0) + 'KB');
        continue;
      }
      console.log('MISS:', src); continue;
    }
    const buf = await sharp(src)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, buf);
    console.log('✓', dst, (buf.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
