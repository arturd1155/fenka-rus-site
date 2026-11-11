const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');

process.nextTick(()=>{
  fs.copyFileSync(
    path.join(root,'homepage-regions-map.png'),
    path.join(root,'dist','homepage-regions-map.png')
  );
});
