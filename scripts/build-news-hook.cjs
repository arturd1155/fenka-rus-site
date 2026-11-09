const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const titleFromSlug=slug=>slug.split('-').map(x=>x==='i'?'и':x).join(' ').replace(/^./,c=>c.toUpperCase());
const formatDate=value=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value));
const paragraphs=value=>String(value||'').split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+esc(p.replace(/[*_`]/g,''))+'</p>').join('');

process.nextTick(()=>{
  const indexFile=path.join(root,'site','news-index.json');
  if(!fs.existsSync(indexFile))return;
  fs.copyFileSync(path.join(root,'shared','news.css'),path.join(dist,'shared','news.css'));
  fs.copyFileSync(path.join(root,'shared','news.js'),path.join(dist,'shared','news.js'));
  const base=fs.readFileSync(path.join(dist,'news','index.html'),'utf8');
  const header=base.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  const footer=base.match(/<footer class="global-footer">[\s\S]*?<\/footer>/)?.[0];
  if(!header||!footer)throw new Error('News hook could not read shared shell');
  const metas=JSON.parse(fs.readFileSync(indexFile,'utf8'));
  const items=metas.map(meta=>{
    const file=path.join(root,'site','news-items',meta.slug+'.json');
    const item=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{...meta,title:titleFromSlug(meta.slug),excerpt:'Материал из архива новостей ФЕНКА.',body:'Материал переносится из архива прежней версии сайта.',image:''};
    if(!item.title||/^-?\s*ОО ФЕНКА\s*$/i.test(item.title))item.title=/^\d+$/.test(item.slug)?'Новость из архива ФЕНКА':titleFromSlug(item.slug);
    if(!item.body||item.body.trim().length<20)item.body=item.excerpt;
    return {...item,displayDate:formatDate(item.date)};
  });
  const featured=items[0];
  const head=title=>'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — ФЕНКА</title><link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/news.css"></head><body>';
  const tail='<script src="/shared/site-shell.js"></script></body></html>';
  const featuredHtml='<article class="news-featured"><div class="news-featured__visual">'+(featured.image?'<img src="'+esc(featured.image)+'" alt="" decoding="async">':'')+'</div><div class="news-featured__copy"><span class="news-date">'+esc(featured.displayDate)+'</span><h2>'+esc(featured.title)+'</h2><p>'+esc(featured.excerpt)+'</p><a class="news-more-link" href="'+featured.internalUrl+'">Читать новость →</a></div></article>';
  const clientData=items.slice(1).map(({title,excerpt,image,year,internalUrl,displayDate})=>({title,excerpt,image,year,internalUrl,displayDate}));
  const years=[...new Set(items.map(x=>x.year))].sort((a,b)=>b-a);
  const catalogue=head('Новости')+header+'<main id="main"><div class="news-page"><section class="news-hero"><div class="news-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>Новости</span></nav><h1>Новости ФЕНКА</h1><p>События регионов, культурные инициативы, общественная деятельность и жизнь еврейских общин России.</p></div></section><div class="news-shell">'+featuredHtml+'<section class="news-tools" aria-label="Поиск и фильтр"><label>Поиск<input id="news-search" type="search" placeholder="Название или тема новости"></label><label>Год<select id="news-year"><option value="">Все годы</option>'+years.map(y=>'<option>'+y+'</option>').join('')+'</select></label></section><section class="news-grid" id="news-grid" aria-live="polite"></section><button class="news-load" id="news-more" type="button">Показать ещё</button></div><script type="application/json" id="news-data">'+JSON.stringify(clientData).replace(/</g,'\\u003c')+'</script><script src="/shared/news.js"></script></div></main>'+footer+tail;
  fs.writeFileSync(path.join(dist,'news','index.html'),catalogue);
  for(const item of items){
    const cover=item.image?'<figure class="news-article__cover"><img src="'+esc(item.image)+'" alt="" decoding="async"></figure>':'';
    const html=head(item.title)+header+'<main id="main"><div class="news-article"><article class="news-article__shell"><a class="news-article__back" href="/news/">← Все новости</a><h1>'+esc(item.title)+'</h1><span class="news-date">'+esc(item.displayDate)+'</span>'+cover+'<div class="news-article__body">'+paragraphs(item.body)+'</div></article></div></main>'+footer+tail;
    const target=path.join(dist,'news',item.slug,'index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
  }
});
