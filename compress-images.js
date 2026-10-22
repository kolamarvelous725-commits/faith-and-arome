const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

const imageFiles = [
  '54fb4825-f77a-494e-ac9d-acc44585de10.jpeg',
  '8a417d14-e456-44f5-a76e-ca3b83108115.jpeg',
  '8d034b04-1bbe-4885-8492-13039bff5485.jpeg',
  '93d34d98-de4c-4b40-a4eb-c5cce79bf6ad.jpeg',
  'a945b5f2-eb3c-4cb3-8016-5992e023e444.jpeg',
  'd9513310-044f-44d1-b33d-87d8a06e4392.jpeg',
  'countdown.png',
  'direction.png',
  'dress code.png',
  'ending page.png',
  'first page.png',
  'hero write up.png',
  'schedule.png',
  'second section.png',
];

function formatSize(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

async function compress() {
  console.log('🗜️  Starting image compression...\n');
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of imageFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping (not found): ${file}`);
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    const sizeBefore = fs.statSync(filePath).size;
    totalBefore += sizeBefore;

    // Write to a temp file then replace
    const tmpPath = filePath + '.tmp';

    try {
      const image = sharp(filePath);

      if (ext === '.jpeg' || ext === '.jpg') {
        await image.jpeg({ quality: 75, mozjpeg: true }).toFile(tmpPath);
      } else if (ext === '.png') {
        await image.png({ compressionLevel: 9, effort: 10 }).toFile(tmpPath);
      }

      const sizeAfter = fs.statSync(tmpPath).size;
      totalAfter += sizeAfter;

      // Replace original with compressed version
      fs.unlinkSync(filePath);
      fs.renameSync(tmpPath, filePath);

      const saved = ((sizeBefore - sizeAfter) / sizeBefore * 100).toFixed(0);
      console.log(`✅ ${file}`);
      console.log(`   ${formatSize(sizeBefore)} → ${formatSize(sizeAfter)} (saved ${saved}%)\n`);
    } catch (err) {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      console.error(`❌ Error compressing ${file}:`, err.message);
    }
  }

  console.log('─────────────────────────────────────');
  console.log(`📊 Total: ${formatSize(totalBefore)} → ${formatSize(totalAfter)}`);
  const totalSaved = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(0);
  console.log(`💾 Overall saved: ${totalSaved}%`);
  console.log('✨ Done!');
}

compress();
