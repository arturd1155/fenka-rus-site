const fs = require('node:fs');
const path = require('node:path');

process.nextTick(() => {
  const root = path.resolve(__dirname, '..');
  const source = path.join(root, 'sergey-melnikov-president.png');
  const target = path.join(root, 'dist', 'sergey-melnikov-president.png');
  fs.copyFileSync(source, target);
});
