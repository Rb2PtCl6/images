import * as fs from 'node:fs';
import { spawn } from 'child_process';

const config = JSON.parse(fs.readFileSync('config.json'));
const storage = {};

async function executeCommand(compressionLevel, format, archiveFormat, interaction) {
  return new Promise((resolve, reject) => {
    const action = spawn('7z', [
      'a',
      `-mx${compressionLevel}`,
      `${format}-${compressionLevel}-${interaction}.${archiveFormat}`,
      `${format}.${format}`,
    ]);

    action.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    action.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    action.on('error', (error) => {
      console.error(`error: ${error.message}`);
      reject(error);
    });

    action.on('close', (code) => {
      console.log(`Process exited with code ${code}`);
      resolve();
    });
  });
}

(async function () {
  for (const format of config.formats) {
    storage[format] = {
      original_size: fs.statSync(`${format}.${format}`).size,
    };

    for (const archiveFormat of config.achive_formats) {
      storage[format][archiveFormat] = {};

      for (const compressionLevel of config.compression_levels) {
        storage[format][archiveFormat][compressionLevel] = {};

        for (const interaction of config.interactions) {
          const start = Date.now();
          await executeCommand(compressionLevel, format, archiveFormat, interaction);
          const end = Date.now();
          const duration = end - start;

          storage[format][archiveFormat][compressionLevel][interaction] = {
            size: fs.statSync(`${format}-${compressionLevel}-${interaction}.${archiveFormat}`).size,
            time: duration,
          };
        }
      }
    }
  }

  console.log(storage);
  fs.writeFileSync('out.json', JSON.stringify(storage, null, 2));
})();
