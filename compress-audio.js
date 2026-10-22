const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const input  = 'assets/obim.mp3';
const output = 'assets/obim-compressed.mp3';

console.log('Using ffmpeg at:', ffmpegInstaller.path);
console.log('Compressing MP3...');

ffmpeg(input)
  .audioBitrate(96)          // 96kbps — good quality, much smaller
  .audioChannels(2)
  .audioFrequency(44100)
  .output(output)
  .on('start', cmd => console.log('Command:', cmd))
  .on('progress', p => process.stdout.write(`\rProgress: ${Math.round(p.percent || 0)}%`))
  .on('end', () => {
    const fs = require('fs');
    const before = (fs.statSync(input).size / 1024 / 1024).toFixed(2);
    const after  = (fs.statSync(output).size / 1024 / 1024).toFixed(2);
    console.log(`\n✅ Done! ${before}MB → ${after}MB`);
    // Replace original
    fs.copyFileSync(output, input);
    fs.unlinkSync(output);
    console.log('✅ Original replaced with compressed version.');
  })
  .on('error', err => console.error('❌ Error:', err.message))
  .run();
