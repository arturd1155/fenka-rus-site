const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');

function buildSupportPage(){
  const pagePath=path.join(root,'dist','support','index.html');
  const content=fs.readFileSync(path.join(root,'site','support-page.html'),'utf8').trim();
  let html=fs.readFileSync(pagePath,'utf8');
  html=html.replace(/<section class="section-content"><div class="section-shell"><div class="content-scaffold">[\s\S]*?<\/div><\/div><\/section>/,content);
  fs.writeFileSync(pagePath,html);
}

process.once('beforeExit',buildSupportPage);
module.exports=buildSupportPage;
