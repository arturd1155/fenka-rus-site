const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});

for(const file of ['homepage-regions-map-v2.webp','homepage-regions-mobile.webp','homepage-russia-overlay.svg','regions-counter.js']){
  const source=path.join(root,file);
  if(!fs.existsSync(source))throw new Error(`Missing published asset: ${file}`);
  fs.copyFileSync(source,path.join(dist,file));
}
