const fs=require('fs');
const path=require('path');
const {sections,socialLinks}=require('../site/site-structure.cjs');
const {buildHeritage}=require('./build-heritage.cjs');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const W=(target,source)=>{fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,source)};
const primary=['about','regions','projects','youth','events','media','news','contacts','support'];
const link=(section,active)=>'<a href="'+section.path+'"'+(section.slug===active?' aria-current="page"':'')+'>'+(section.navLabel||section.title)+'</a>';
function header(active){
  const children=['about','leadership','documents','reports'].map(slug=>sections.find(section=>section.slug===slug));
  return '<header class="global-header"><a class="global-brand" href="/"><img src="/fenka-logo-official.png" alt="ФЕНКА"></a><button class="global-menu-button" data-menu-toggle aria-expanded="false" aria-controls="siteNavigation"><span></span><span></span><span></span></button><nav class="global-nav" id="siteNavigation"><div class="global-nav-group"><button data-about-toggle aria-expanded="false" aria-controls="aboutMenu">О ФЕНКА</button><div class="global-submenu" id="aboutMenu" data-about-menu>'+children.map(section=>link(section,active)).join('')+'</div></div>'+primary.filter(slug=>slug!=='about').map(slug=>link(sections.find(section=>section.slug===slug),active)).join('')+'</nav></header>';
}
function footer(){
  return '<footer class="global-footer"><div><img src="/fenka-logo-official.png" alt="ФЕНКА"><p>Люди. Культура. Развитие.</p></div><nav>'+sections.map(section=>'<a href="'+section.path+'">'+section.title+'</a>').join('')+'</nav><div class="global-footer__social"><strong>Социальные сети</strong>'+socialLinks.map(item=>'<a href="'+item.href+'" target="_blank" rel="noopener noreferrer">'+item.label+'</a>').join('')+'</div></footer>';
}

process.nextTick(()=>buildHeritage({root,dist,W,header,footer}));
