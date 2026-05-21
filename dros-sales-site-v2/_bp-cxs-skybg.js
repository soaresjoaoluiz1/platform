/* Achata as caixas em fundo sky-50 + corta a moldura pra caixa ficar maior */
const sharp = require('sharp');
const fs = require('fs');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\box-paper-imgs-new\\cxs\\';
const DST_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v8\\assets\\img\\';
const SKY = '#f3f9fd';

const MAP = [
  ['cx0.png', 'hero-cx-1.jpg'],
  ['cx1.png', 'hero-cx-2.jpg'],
  ['cx2.png', 'hero-cx-3.jpg'],
  ['cx4.png', 'hero-cx-4.jpg'],
];

(async () => {
  for (const [src, dst] of MAP) {
    // 1. achata transparência em sky-50 (assim a moldura/white bg vira sky)
    // mas o source TEM white bg natively, então só substitui white → sky
    const img = sharp(SRC_DIR + src);
    const meta = await img.metadata();
    // Substitui pixels brancos (>240) por sky-50
    const buf = await img
      .recomb([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) // no-op só pra entrar no pipeline
      .toBuffer();
    // Compose com bg sky para qualquer alpha existente
    const final = await sharp({
      create: { width: meta.width, height: meta.height, channels: 3, background: SKY }
    })
      .composite([{ input: buf, blend: 'multiply' }])  // multiply mantém escuro, white branco vira sky
      .resize({ width: 1200, height: 1200, fit: 'contain', background: SKY })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
      .toBuffer();
    fs.writeFileSync(DST_DIR + dst, final);
    console.log('✓', dst, (final.length/1024).toFixed(0) + 'KB');
  }
})().catch(e => { console.error(e); process.exit(1); });
