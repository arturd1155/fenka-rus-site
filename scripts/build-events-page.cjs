const fs=require('node:fs');
const path=require('node:path');
const {buildEventsMain}=require('../site/events-content.cjs');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const eventAssets=[
  'shenkman-posledniy-polet.webp',
  'karuza.webp',
  'bimbat-zhizn-nad-zemley.webp',
  'iz-ada-v-ad.webp'
];

function buildEventsPage(){
  const pagePath=path.join(dist,'events','index.html');
  let html=fs.readFileSync(pagePath,'utf8');
  html=html
    .replace('<link rel="stylesheet" href="/shared/site-shell.css">','<link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/events.css">')
    .replace(/<main id="main">[\s\S]*?<\/main>/,buildEventsMain());
  html=html.replace(/[ \t]+$/gm,'');
  fs.writeFileSync(pagePath,html);
  fs.copyFileSync(path.join(root,'shared','events.css'),path.join(dist,'shared','events.css'));
  const targetAssets=path.join(dist,'assets','events');
  fs.mkdirSync(targetAssets,{recursive:true});
  for(const asset of eventAssets)fs.copyFileSync(path.join(root,'site-assets','events',asset),path.join(targetAssets,asset));
}

process.once('beforeExit',buildEventsPage);
module.exports=buildEventsPage;
