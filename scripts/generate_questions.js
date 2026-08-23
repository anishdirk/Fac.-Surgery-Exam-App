// Generator script to build complete questions array
import fs from 'fs';
import path from 'path';

// Let's ensure directory exists
const dataDir = path.resolve('src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Building questions generator...');
