const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});

for(const file of ['homepage-regions-map.png','homepage-regions-mobile.webp','homepage-russia-regions.svg']){
  const source=path.join(root,file);
  if(!fs.existsSync(source))throw new Error(`Missing homepage map asset: ${file}`);
  fs.copyFileSync(source,path.join(dist,file));
}
