const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const source=path.join(root,'site-assets','home');
const destination=path.join(root,'dist','assets','home');

fs.mkdirSync(destination,{recursive:true});
for(const file of ['education-phone.jpg','education-desktop.jpg']){
  fs.copyFileSync(path.join(source,file),path.join(destination,file));
}
