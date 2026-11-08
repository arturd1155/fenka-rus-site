const fs=require('fs');
const path=require('path');
const projects=require('../site/projects-data.cjs');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value)};

process.nextTick(()=>{
  fs.copyFileSync(path.join(root,'shared','projects.css'),path.join(dist,'shared','projects.css'));
  const base=fs.readFileSync(path.join(dist,'projects','index.html'),'utf8');
  const header=base.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  const footer=base.match(/<footer class="global-footer">[\s\S]*?<\/footer>/)?.[0];
  if(!header||!footer)throw new Error('Projects hook could not read shared site shell');
  const head=title=>'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — ФЕНКА</title><link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/projects.css"></head><body>';
  const scripts='<script src="/shared/site-shell.js"></script></body></html>';
  const cards=projects.map((p,i)=>'<a class="project-card" href="/projects/'+p.slug+'/"><span class="project-card__number">'+String(i+1).padStart(2,'0')+'</span><span class="project-card__category">'+esc(p.category)+'</span><h2>'+esc(p.title)+'</h2><p>'+esc(p.summary)+'</p><b>Открыть проект →</b></a>').join('');
  const catalogue=head('Проекты')+header+'<main><section class="section-hero"><div class="section-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>Проекты</span></nav><h1>Проекты ФЕНКА</h1><p>Культурные, образовательные и общественные инициативы федерального и регионального масштаба.</p></div></section><section class="section-content"><div class="section-shell"><div class="projects-intro"><p>Архив объединяет 25 программ ФЕНКА — от сохранения исторической памяти и культурного наследия до развития молодёжных лидеров и межнационального диалога.</p></div><div class="projects-grid">'+cards+'</div></div></section></main>'+footer+scripts;
  write(path.join(dist,'projects','index.html'),catalogue);
  for(const project of projects){
    const body=(project.sections||[]).map(s=>'<section><h2>'+esc(s[0])+'</h2><p>'+esc(s[1])+'</p></section>').join('')+(project.body||[]).map(p=>'<p>'+esc(p)+'</p>').join('');
    const detail=head(project.title)+header+'<main class="project-detail"><div class="section-shell"><a class="project-detail__back" href="/projects/">← Все проекты</a><div class="project-detail__layout"><article><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1>'+esc(project.title)+'</h1><p class="project-detail__lead">'+esc(project.summary)+'</p><div class="project-detail__body">'+body+'</div></article><aside><span>НАПРАВЛЕНИЕ</span><strong>'+esc(project.category)+'</strong><a href="/contacts/">Связаться с ФЕНКА →</a></aside></div></div></main>'+footer+scripts;
    write(path.join(dist,'projects',project.slug,'index.html'),detail);
  }
});
