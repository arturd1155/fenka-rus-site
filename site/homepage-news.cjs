const fs=require('node:fs');
const path=require('node:path');

const START='<!-- HOME_NEWS_START -->';
const END='<!-- HOME_NEWS_END -->';
const esc=value=>String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const formatDate=value=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value)).replace(' г.','');

function renderHomepageNews(items){
  return items.slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))).filter(item=>item.image).slice(0,4).map((item,index)=>{
    const lead=index===0?' home-news-entry--lead':'';
    return `            <a class="home-news-entry${lead}" href="${esc(item.internalUrl)}" aria-label="Читать новость: ${esc(item.title)}"><img class="home-news-entry__image" src="${esc(item.image)}" width="320" height="180" loading="lazy" decoding="async" alt=""><span><small>Новости · ${esc(formatDate(item.date))}</small><h3>${esc(item.title)}</h3></span><i aria-hidden="true">→</i></a>`;
  }).join('\n');
}

function updateHomepageHtml(html,items){
  const rendered=renderHomepageNews(items);
  if(!rendered)throw new Error('Homepage news requires at least one item with an image');
  const start=html.indexOf(START),end=html.indexOf(END);
  if(start<0||end<start)throw new Error('Homepage news markers are missing');
  return html.slice(0,start+START.length)+'\n'+rendered+'\n            '+html.slice(end);
}

function loadLatestNews(root){
  const metas=JSON.parse(fs.readFileSync(path.join(root,'site','news-index.json'),'utf8'));
  return metas.map(meta=>{
    const file=path.join(root,'site','news-items',`${meta.slug}.json`);
    return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
  }).filter(Boolean).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}

function updateHomepageFile(file,items){
  fs.writeFileSync(file,updateHomepageHtml(fs.readFileSync(file,'utf8'),items));
}

module.exports={START,END,renderHomepageNews,updateHomepageHtml,loadLatestNews,updateHomepageFile};
