const fs=require('node:fs');
const path=require('node:path');
const {buildEventsMain}=require('../site/events-content.cjs');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');

function buildEventsPage(){
  const pagePath=path.join(dist,'events','index.html');
  let html=fs.readFileSync(pagePath,'utf8');
  html=html
    .replace('<link rel="stylesheet" href="/shared/site-shell.css">','<link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/events.css">')
    .replace(/<main id="main">[\s\S]*?<\/main>/,buildEventsMain());
  html=html.replace(/[ \t]+$/gm,'');
  fs.writeFileSync(pagePath,html);
  fs.copyFileSync(path.join(root,'shared','events.css'),path.join(dist,'shared','events.css'));
}

process.once('beforeExit',buildEventsPage);
module.exports=buildEventsPage;
