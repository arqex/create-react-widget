import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const toCopy = [
  'injection',
  'public',
  'src',
  'index.css',
  'index.html',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'widget.config.ts'
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_PATH = path.resolve(__dirname, '../src');
const TEMPLATE_PATH = path.resolve(__dirname, '../template');
console.log('Copying template files...');
fs.emptyDirSync(TEMPLATE_PATH);
toCopy.forEach((file) => {
  const srcPath = path.resolve(SRC_PATH, file);
  const destPath = path.resolve(TEMPLATE_PATH, file);
  fs.copySync(srcPath, destPath, {'overrite': true, 'recursive': true});
});
console.log('Done.');