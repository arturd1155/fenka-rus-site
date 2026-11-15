const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(
  path.join(root, 'homepage-reference.css'),
  path.join(dist, 'homepage-reference.css')
);
