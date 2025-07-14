const https = require('https');
const fs = require('fs');
const path = require('path');

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, 'src', 'public', 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Free sound URLs (these are example URLs - you'll need to replace with actual working URLs)
const sounds = {
  rain: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_164734d8c8.mp3?filename=rain-ambient-001.mp3',
  fire: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_164734d8c8.mp3?filename=fire-crackling-001.mp3',
  whitenoise: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_164734d8c8.mp3?filename=white-noise-001.mp3',
  train: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_164734d8c8.mp3?filename=train-whistle-001.mp3',
  cafe: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_164734d8c8.mp3?filename=cafe-ambience-001.mp3'
};

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(audioDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filename}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllSounds() {
  console.log('Starting sound downloads...');
  
  for (const [name, url] of Object.entries(sounds)) {
    try {
      await downloadFile(url, `${name}.mp3`);
    } catch (error) {
      console.log(`Error downloading ${name}: ${error.message}`);
    }
  }
  
  console.log('Download complete!');
}

downloadAllSounds(); 