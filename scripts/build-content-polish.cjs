const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const slugs=['about','reports','privacy','events','support','documents','contacts'];
const publishingNote='<p>Раздел ФЕНКА подготовлен для размещения актуальной и проверенной информации.</p>';

function buildContentPolish(){
  fs.copyFileSync(path.join(root,'shared','content-polish.css'),path.join(dist,'shared','content-polish.css'));
  for(const slug of slugs){
    const pagePath=path.join(dist,slug,'index.html');
    let html=fs.readFileSync(pagePath,'utf8');
    html=html
      .replace(publishingNote,'')
      .replace('<link rel="stylesheet" href="/shared/site-shell.css">','<link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/content-polish.css">')
      .replace('<body>',`<body class="page-${slug}${slug==='about'?'':' content-polished'}">`);
    if(slug==='privacy')html=html.replace(/<footer class="legal-document__source">[\s\S]*?<\/footer>/,'');
    if(slug==='contacts')html=html.replace(/<p class="contacts-source">[\s\S]*?<\/p>/,'');
    fs.writeFileSync(pagePath,html);
  }
}

process.once('beforeExit',buildContentPolish);
module.exports=buildContentPolish;
