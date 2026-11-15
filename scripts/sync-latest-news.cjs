const fs=require('node:fs');
const path=require('node:path');
const {parseLegacyNews}=require('./import-news.cjs');
const {loadLatestNews,updateHomepageFile}=require('../site/homepage-news.cjs');

const MONTHS={января:1,февраля:2,марта:3,апреля:4,мая:5,июня:6,июля:7,августа:8,сентября:9,октября:10,ноября:11,декабря:12};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function originalImageUrl(url){
  const parsed=new URL(url);
  parsed.pathname=parsed.pathname.replace(/-\d+x\d+(?=\.(?:jpe?g|png|webp)$)/i,'');
  return parsed.href;
}

function parseArchiveFeed(source){
  const anchors=[...source.matchAll(/\((https?:\/\/fenka\.online\/news\/([^/)]+)\/)\)/g)];
  const groups=[];
  const byUrl=new Map();
  for(const anchor of anchors){
    const slug=anchor[2];
    if(!/^[a-z0-9][a-z0-9-]*$/i.test(slug))throw new Error(`Unsafe news slug: ${slug}`);
    let group=byUrl.get(anchor[1]);
    if(!group){group={url:anchor[1],slug,anchors:[],index:anchor.index};byUrl.set(anchor[1],group);groups.push(group)}
    group.anchors.push(anchor);
  }
  return groups.map((group,index)=>{
    const next=groups[index+1]?.index??source.length;
    const after=source.slice(group.index,next);
    const dateMatch=after.match(/(\d{1,2})\s+([А-Яа-яЁё]+)\s+(\d{4})/);
    if(!dateMatch)throw new Error(`Publication date is missing for ${group.url}`);
    const month=MONTHS[dateMatch[2].toLowerCase()];
    if(!month)throw new Error(`Unknown Russian month: ${dateMatch[2]}`);
    const offset=index;
    const base=Date.UTC(Number(dateMatch[3]),month-1,Number(dateMatch[1]),12,0,0)-offset*1000;
    const date=new Date(base).toISOString().replace('.000Z','+00:00');
    let image;
    for(const anchor of group.anchors){
      const before=source.slice(Math.max(0,anchor.index-700),anchor.index);
      const match=before.match(/\[!\[[^\]]*\]\((https?:\/\/fenka\.online\/wp-content\/uploads\/[^)]+)\)\]$/);
      if(match){image=originalImageUrl(match[1]);break}
    }
    return {url:group.url,slug:group.slug,date,year:Number(dateMatch[3]),internalUrl:`/news/${group.slug}/`,...(image?{image}:{})};
  });
}

async function fetchText(url,attempts=5){
  let last;
  for(let attempt=1;attempt<=attempts;attempt++){
    try{
      const response=await fetch(url,{headers:{accept:'text/plain','user-agent':'Mozilla/5.0 FENKA migration'},signal:AbortSignal.timeout(60000)});
      if(!response.ok)throw new Error(`${response.status} ${url}`);
      return await response.text();
    }catch(error){last=error;if(attempt<attempts)await sleep(attempt*2000)}
  }
  throw last;
}

async function syncLatest({root=path.resolve(__dirname,'..')}={}){
  const archive=await fetchText('https://r.jina.ai/https://fenka.online/news/');
  const remote=parseArchiveFeed(archive);
  const indexFile=path.join(root,'site','news-index.json');
  const itemDir=path.join(root,'site','news-items');
  const index=JSON.parse(fs.readFileSync(indexFile,'utf8'));
  const byUrl=new Map(index.map(item=>[item.url,item]));
  let created=0,updated=0;
  for(const meta of remote){
    const existing=byUrl.get(meta.url);
    if(existing){
      const file=path.join(itemDir,`${existing.slug}.json`);
      if(fs.existsSync(file)){
        const item=JSON.parse(fs.readFileSync(file,'utf8'));
        if(!item.image&&meta.image){item.image=meta.image;item.images=[meta.image];fs.writeFileSync(file,JSON.stringify(item,null,2)+'\n');updated++}
      }
      continue;
    }
    const article=await fetchText(`https://r.jina.ai/https://fenka.online/news/${meta.slug}/`);
    const item=parseLegacyNews(article,meta);
    if(meta.image){item.image=meta.image;item.images=[meta.image]}
    fs.writeFileSync(path.join(itemDir,`${meta.slug}.json`),JSON.stringify(item,null,2)+'\n');
    index.push(meta);byUrl.set(meta.url,meta);created++;
  }
  index.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  fs.writeFileSync(indexFile,JSON.stringify(index,null,2)+'\n');
  const items=loadLatestNews(root);
  updateHomepageFile(path.join(root,'index.html'),items);
  console.log(`Latest news sync: ${created} created, ${updated} images restored, ${index.length} total`);
  return {created,updated,total:index.length};
}

if(require.main===module)syncLatest().catch(error=>{console.error(error);process.exitCode=1});
module.exports={originalImageUrl,parseArchiveFeed,syncLatest};
