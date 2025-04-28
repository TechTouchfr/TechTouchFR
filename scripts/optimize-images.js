const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

const config = {
  source: 'src/assets/images/originals',
  destination: 'src/assets/images/optimized',
  qualityWebp: 80,
  qualityAvif: 50,
  resize: false,
  resizeWidth: 1200,
  resizeHeight: 630
};

async function optimizeImages() {
  const { source, destination, qualityWebp, qualityAvif, resize, resizeWidth, resizeHeight } = config;

  try {
    await fs.access(source);
  } catch (error) {
    console.log(`❌ Dossier source ${source} introuvable.`);
    return;
  }

  await fs.mkdir(destination, { recursive: true });

  const files = glob.sync(`${source}/*.{jpg,png}`);

  if (files.length === 0) {
    console.log(`⚠️ Aucun fichier JPG ou PNG trouvé dans ${source}.`);
    return;
  }

  let processedCount = 0;

  for (const file of files) {
    const fileName = path.parse(file).name;
    const webpOutput = path.join(destination, `${fileName}.webp`);
    const avifOutput = path.join(destination, `${fileName}.avif`);

    try {
      let image = sharp(file);

      if (resize) {
        image = image.resize(resizeWidth, resizeHeight);
      }

      await Promise.all([
        image.webp({ quality: qualityWebp }).toFile(webpOutput),
        image.avif({ quality: qualityAvif }).toFile(avifOutput)
      ]);

      console.log(`✅ Converted ${fileName} to WebP and AVIF`);
      processedCount++;
    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error.message);
    }
  }

  console.log(`✅ ${processedCount} image(s) optimisée(s) et convertie(s) en WebP et AVIF.`);
}

optimizeImages().catch(error => {
  console.error('❌ An error occurred:', error.message);
  process.exit(1);
});