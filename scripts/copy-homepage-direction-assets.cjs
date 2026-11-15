const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const source=path.join(root,'site-assets','home');
const destination=path.join(root,'dist','assets','home');

fs.mkdirSync(destination,{recursive:true});
for(const file of [
  'education-phone.jpg',
  'education-desktop.jpg',
  'culture-phone.jpg',
  'culture-desktop.jpg',
  'youth-phone.jpg',
  'youth-desktop.jpg',
  'social-phone.jpg',
  'social-desktop.jpg',
  'regional-phone.jpg',
  'regional-desktop.jpg',
  'dialogue-phone.jpg',
  'dialogue-desktop.jpg'
]){
  fs.copyFileSync(path.join(source,file),path.join(destination,file));
}
