const fs=require('fs');
const path=require('path');
const projects=require('../site/projects-data.cjs');
const flagshipProjects=require('../site/flagship-projects.cjs');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value)};
const jpgCovers=new Set(['kod-naslediya','kinoklub-fenka-v-dome-narodov-rossii','shalom-rossiya','sinagogi-mira','onko-stop','zabota-o-svoih','festival-evrejskoj-muzyki']);
const coverFile=project=>project.slug+(jpgCovers.has(project.slug)?'.jpg':'.webp');

process.nextTick(()=>{
  fs.copyFileSync(path.join(root,'shared','projects.css'),path.join(dist,'shared','projects.css'));
  fs.copyFileSync(path.join(root,'shared','heritage-project.css'),path.join(dist,'shared','heritage-project.css'));
  const coversDir=path.join(dist,'assets','projects');
  fs.mkdirSync(coversDir,{recursive:true});
  for(const project of projects)fs.copyFileSync(path.join(root,'site-assets','projects',coverFile(project)),path.join(coversDir,coverFile(project)));
  const base=fs.readFileSync(path.join(dist,'projects','index.html'),'utf8');
  const header=base.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  const footer=base.match(/<footer class="global-footer">[\s\S]*?<\/footer>/)?.[0];
  if(!header||!footer)throw new Error('Projects hook could not read shared site shell');
  const head=title=>'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — ФЕНКА</title><link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/projects.css"><link rel="stylesheet" href="/shared/heritage-project.css"></head><body>';
  const scripts='<script src="/shared/site-shell.js"></script></body></html>';
  const cards=projects.map((p,i)=>{const showcase=flagshipProjects[p.slug];const featured=p.featured||showcase;return '<a class="project-card'+(featured?' project-card--featured':'')+'" href="/projects/'+p.slug+'/"><span class="project-card__cover"><img src="/assets/projects/'+coverFile(p)+'" alt="'+esc(showcase?.title||p.title)+'" width="1200" height="675" loading="lazy" decoding="async">'+(featured?'':'<span class="project-card__number">'+String(i+1).padStart(2,'0')+'</span>')+'</span><span class="project-card__content"><span class="project-card__category">'+esc(p.category)+'</span><h2>'+esc(showcase?.title||p.title)+'</h2><p>'+esc(showcase?.slogan||p.subtitle||p.summary)+'</p><b>Подробнее →</b></span></a>'}).join('');
  const catalogue=head('Проекты')+header+'<main><section class="section-hero"><div class="section-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>Проекты</span></nav><h1>Проекты ФЕНКА</h1><p>Культурные, образовательные и общественные инициативы федерального и регионального масштаба.</p></div></section><section class="section-content"><div class="section-shell"><div class="projects-grid">'+cards+'</div></div></section></main>'+footer+scripts;
  write(path.join(dist,'projects','index.html'),catalogue);
  for(const project of projects){
    const body=(project.sections||[]).map(s=>'<section><h2>'+esc(s[0])+'</h2><p>'+esc(s[1])+'</p></section>').join('')+(project.body||[]).map(p=>'<p>'+esc(p)+'</p>').join('');
    const heritage=project.slug==='kod-naslediya';
    const showcase=flagshipProjects[project.slug];
    const heritageActions='<nav class="heritage-action-grid" aria-label="Действия проекта"><a href="/media/heritage/"><strong>Исследовать медиатеку</strong><span>Фильмы, архивы, музыка и истории общин <b>→</b></span></a><a href="mailto:info@fenkar.ru?subject='+encodeURIComponent('Пополнить коллекцию проекта Код наследия')+'"><strong>Пополнить коллекцию</strong><span>Передать семейный архив или материалы общины <b>→</b></span></a><a href="/support/"><strong>Поддержать проект</strong><span>Помочь оцифровке и созданию новых материалов <b>→</b></span></a></nav>';
    const heritageSupport='<section class="heritage-support" aria-labelledby="heritage-support-title"><div><span>ПОДДЕРЖАТЬ ПРОЕКТ</span><h2 id="heritage-support-title">Помогите сохранить историю</h2><p>Ваше пожертвование — это новые оцифрованные архивы, сохранённые воспоминания, документальные фильмы и истории, которые смогут увидеть будущие поколения.</p></div><a class="project-support" href="/support/">Стать частью наследия <span aria-hidden="true">→</span></a></section>';
    const standard='<main class="project-detail"><div class="section-shell"><a class="project-detail__back" href="/projects/">← Все проекты</a><div class="project-detail__layout"><article><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1>'+esc(project.title)+'</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="'+esc(project.title)+'" width="1200" height="800" decoding="async"></figure><p class="project-detail__lead">'+esc(project.summary)+'</p><div class="project-detail__body">'+body+'</div></article><aside><span>НАПРАВЛЕНИЕ</span><strong>'+esc(project.category)+'</strong><a class="project-support" href="/support/"><span class="project-support__copy"><small>Ваша помощь важна</small><b>Поддержать проект</b></span><span class="project-support__icon" aria-hidden="true">→</span></a></aside></div></div></main>';
    const heritageLead=(project.body||[]).slice(0,2).map(p=>'<p>'+esc(p)+'</p>').join('');
    const heritageBody=(project.body||[]).slice(2).map(p=>'<p>'+esc(p)+'</p>').join('');
    const special='<main class="heritage-project"><section class="heritage-banner"><div class="section-shell"><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1 class="heritage-title-sr">Код наследия — цифровая медиатека еврейской жизни России</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="Код наследия — цифровая медиатека еврейской жизни России" width="1672" height="939" decoding="async"></figure>'+heritageActions+'</div></section><section class="heritage-story"><div class="section-shell"><header><span>О ПРОЕКТЕ</span><h2>История, которая продолжает жить</h2></header><article><div class="heritage-story__lead">'+heritageLead+'</div><div class="heritage-story__columns">'+heritageBody+'</div></article>'+heritageSupport+'</div></section></main>';
    const showcaseActions=showcase?'<nav class="heritage-action-grid" aria-label="Действия проекта">'+showcase.actions.map(action=>'<a href="'+esc(action[2])+'"><strong>'+esc(action[0])+'</strong><span>'+esc(action[1])+' <b>→</b></span></a>').join('')+'</nav>':'';
    const showcaseSupport=showcase?'<section class="heritage-support" aria-labelledby="project-support-title"><div><span>ПОДДЕРЖАТЬ ПРОЕКТ</span><h2 id="project-support-title">Помогите проекту развиваться</h2><p>'+esc(showcase.support)+'</p></div><a class="project-support" href="/support/">Поддержать проект <span aria-hidden="true">→</span></a></section>':'';
    const showcasePage=showcase?'<main class="heritage-project"><section class="heritage-banner"><div class="section-shell"><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1 class="heritage-title-sr">'+esc(showcase.title)+' — '+esc(showcase.slogan)+'</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="'+esc(showcase.title)+'" width="1672" height="939" decoding="async"></figure>'+showcaseActions+'</div></section><section class="heritage-story"><div class="section-shell"><header><span>О ПРОЕКТЕ</span><h2>'+esc(showcase.slogan)+'</h2></header><article><div class="heritage-story__lead"><p>'+esc(showcase.intro)+'</p></div><div class="heritage-story__columns"><p>'+esc(showcase.description)+'</p><p><strong>'+esc(showcase.accent)+'</strong></p></div></article>'+showcaseSupport+'</div></section></main>':'';
    const detail=head(showcase?.title||project.title)+header+(heritage?special:(showcase?showcasePage:standard))+footer+scripts;
    write(path.join(dist,'projects',project.slug,'index.html'),detail);
  }
});
