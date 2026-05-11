const { writePsd } = require('ag-psd');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function readAsImageData(filePath, width, height) {
  const { data } = await sharp(filePath)
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return {
    width,
    height,
    data: new Uint8ClampedArray(data)
  };
}

async function main() {
  const W = 800, H = 1000;
  const dir = __dirname;
  const outDir = path.join(dir, '..', '..');

  console.log('Lendo layer-bg.png...');
  const bgImageData = await readAsImageData(path.join(dir, 'layer-bg.png'), W, H);

  console.log('Lendo layer-text.png...');
  const textImageData = await readAsImageData(path.join(dir, 'layer-text.png'), W, H);

  console.log('Lendo preview completo...');
  const previewImageData = await readAsImageData(
    path.join(outDir, 'josi-post-1-preview.png'), W, H
  );

  console.log('Montando PSD...');
  const psd = {
    width: W,
    height: H,
    children: [
      {
        name: 'Referencia (oculta)',
        left: 0, top: 0, right: W, bottom: H,
        hidden: true,
        imageData: previewImageData,
      },
      {
        name: 'Textos e UI',
        left: 0, top: 0, right: W, bottom: H,
        imageData: textImageData,
      },
      {
        name: 'Foto + Gradiente',
        left: 0, top: 0, right: W, bottom: H,
        imageData: bgImageData,
      },
    ]
  };

  const buffer = writePsd(psd);
  const outputPath = path.join(outDir, 'josi-post-1.psd');
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
  console.log(`\n✅ PSD criado: josi-post-1.psd (${sizeMB} MB)`);
  console.log('Camadas:\n  1. Referencia (oculta)\n  2. Textos e UI\n  3. Foto + Gradiente');
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
