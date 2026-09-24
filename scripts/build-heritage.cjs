const fs=require('fs');
const path=require('path');
const {renderMediaLanding,renderHeritageBody,pageDocument}=require('../site/heritage/render.cjs');
function copyTree(source,target){
  fs.mkdirSync(target,{recursive:true});
  for(const entry of fs.readdirSync(source,{withFileTypes:true})){
    const from=path.join(source,entry.name),to=path.join(target,entry.name);
    if(entry.isDirectory()) copyTree(from,to);else fs.copyFileSync(from,to);
  }
}
function buildHeritage({root,dist,W,header,footer}){
  const mediaHeader='<section class="section-hero"><div class="section-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>Медиатека</span></nav><h1>Медиатека</h1><p>Культурные, образовательные и архивные материалы ФЕНКА.</p></div></section>';
  W(path.join(dist,'media','index.html'),pageDocument({title:'Медиатека',header:header('media'),body:'<main id="main">'+mediaHeader+renderMediaLanding()+'</main>',footer:footer(),heritageStyles:true}));
  W(path.join(dist,'media','heritage','index.html'),pageDocument({title:'Наследие ФЕНКА',header:header('media'),body:renderHeritageBody(),footer:footer(),heritage:true}));
  const source=path.join(root,'site','heritage'),target=path.join(dist,'media','heritage');
  for(const item of ['data','thumbnails']) copyTree(path.join(source,item),path.join(target,item));
  for(const item of ['heritage.css','heritage.js']){const from=path.join(source,item);if(fs.existsSync(from))fs.copyFileSync(from,path.join(target,item))}
}
module.exports={buildHeritage};
