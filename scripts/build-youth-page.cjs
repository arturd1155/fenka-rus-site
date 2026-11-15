const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');

function buildYouthPage(){
  const pagePath=path.join(dist,'youth','index.html');
  const pageSource=fs.readFileSync(path.join(root,'site','youth-page.html'),'utf8').trim();
  let html=fs.readFileSync(pagePath,'utf8');

  html=html
    .replace(/<link rel="preload" as="image" href="\/assets\/youth\/youth-hero(?:-community)?\.jpg">/g,'')
    .replace(/<link rel="stylesheet" href="\/shared\/youth\.css">/g,'')
    .replace(/<script src="\/mail-forms\.js(?:\?[^\"]*)?"><\/script>/g,'')
    .replace(/<script src="\/shared\/youth\.js(?:\?[^\"]*)?"><\/script>/g,'')
    .replace('<link rel="stylesheet" href="/shared/site-shell.css">','<link rel="stylesheet" href="/shared/site-shell.css"><link rel="preload" as="image" href="/assets/youth/youth-hero-community.jpg"><link rel="stylesheet" href="/shared/youth.css">')
    .replace(/<main id="main">[\s\S]*?<\/main>/,pageSource)
    .replace('</body>','<script src="/mail-forms.js?v=20261115-direct1"></script><script src="/shared/youth.js?v=20261115-direct1"></script></body>');

  fs.writeFileSync(pagePath,html);
  fs.copyFileSync(path.join(root,'shared','youth.css'),path.join(dist,'shared','youth.css'));
  fs.copyFileSync(path.join(root,'shared','youth.js'),path.join(dist,'shared','youth.js'));
  fs.mkdirSync(path.join(dist,'assets','youth'),{recursive:true});
  for(const file of ['youth-hero-community.jpg','evgeniya-polyanina.jpg','mirra-fleys.jpg']){
    fs.copyFileSync(path.join(root,'site-assets','youth',file),path.join(dist,'assets','youth',file));
  }
}

process.once('beforeExit',buildYouthPage);
module.exports=buildYouthPage;
