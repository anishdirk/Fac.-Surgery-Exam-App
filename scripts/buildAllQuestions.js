import fs from 'fs';
import path from 'path';

const outDir = path.resolve('src/data/questions');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Writing questions generator script...');
