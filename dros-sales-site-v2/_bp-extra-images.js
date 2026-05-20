/**
 * Otimiza:
 *  - caixa branca.png → acabamento-branco.jpg (substitui o crop antigo)
 *  - caixa-preta.png → acabamento-laminado.jpg
 *  - 14_56_01 (3) calendário → metodo-cronograma.jpg (passo 01)
 *  - 14_56_02 (5) maquininha → metodo-pagamento.jpg (passo 03)
 *  - 14_56_03 (8) entrega ao cliente → prova-social.jpg (já feita, re-otimiza)
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_DIR = 'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-images';
const TARGETS = [
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v7-pre-rollback-backup\\assets\\img',
  'c:\\Users\\usuar\\Downloads\\Open Squad\\box-paper-site-v3-editorial\\assets\\img',
];

const MAPPING = {
  'acabamento-branco.jpg':   'caixa branca.png',
  'acabamento-laminado.jpg': 'caixa-preta.png',
  'metodo-cronograma.jpg':   'ChatGPT Image 19 de mai. de 2026, 14_56_01 (3).png',
  'metodo-pagamento.jpg':    'ChatGPT Image 19 de mai. de 2026, 14_56_02 (5).png',
};

const TARGET_WIDTH = 1600;

(async () => {
  for (const target of TARGETS) {
    if (!fs.existsSync(target)) { console.log('SKIP:', target); continue; }
    console.log('\n=== Target:', target);
    for (const [destName, srcName] of Object.entries(MAPPING)) {
      const src = path.join(SRC_DIR, srcName);
      const dst = path.join(target, destName);
      if (!fs.existsSync(src)) { console.log('  MISS:', srcName); continue; }
      const buf = await sharp(src)
        .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: 84, progressive: true, mozjpeg: true, chromaSubsampling: '4:2:0' })
        .toBuffer();
      const tmp = dst + '.tmp';
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, dst);
      console.log('  ✓', destName, `(${(buf.length/1024).toFixed(0)}KB)`);
    }
  }
  console.log('\nDone.');
})().catch(e => { console.error(e); process.exit(1); });
