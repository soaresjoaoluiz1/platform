/**
 * Gera duas imagens separadas a partir da fonte:
 *  - acabamento-branco.jpg  (caixa BELLA NAPOLI branca, lado esquerdo)
 *  - acabamento-laminado.jpg (caixa VIA ROMA preta, lado direito)
 *
 * Pra usar nos dois cards de acabamento (em vez de splitar via object-position).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-images\\ChatGPT Image 19 de mai. de 2026, 14_56_06 (9).png';
const TARGETS = [
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v7-pre-rollback-backup\\assets\\img',
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v3-editorial\\assets\\img',
];

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log('Source:', meta.width, 'x', meta.height);

  // Crop left half (BELLA NAPOLI branca)
  const wHalf = Math.floor(meta.width / 2);
  const leftBuf = await sharp(SRC)
    .extract({ left: 0, top: 0, width: wHalf, height: meta.height })
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toBuffer();

  const rightBuf = await sharp(SRC)
    .extract({ left: wHalf, top: 0, width: meta.width - wHalf, height: meta.height })
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 84, progressive: true, mozjpeg: true })
    .toBuffer();

  for (const t of TARGETS) {
    if (!fs.existsSync(t)) continue;
    fs.writeFileSync(path.join(t, 'acabamento-branco.jpg'), leftBuf);
    fs.writeFileSync(path.join(t, 'acabamento-laminado.jpg'), rightBuf);
    console.log('Wrote 2 files into', t);
  }
  console.log(`L=${(leftBuf.length/1024).toFixed(0)}KB R=${(rightBuf.length/1024).toFixed(0)}KB`);
})().catch(e => { console.error(e); process.exit(1); });
