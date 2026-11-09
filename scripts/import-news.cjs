const fs=require('node:fs');
const path=require('node:path');

const clean=s=>String(s||'').replace(/\r/g,'').trim();
const entities=s=>String(s||'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#039;|&apos;/gi,"'").replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));

function parseLegacyNews(source,meta){
  const titleLine=source.match(/^Title:\s*(.+)$/m)?.[1]||meta.slug.replace(/-/g,' ');
  const title=clean(titleLine.replace(/\s+-\s+ОО ФЕНКА\s*$/i,''));
  if(/(?:503 Service Unavailable|502 Bad Gateway|429 Too Many Requests)/i.test(title))throw new Error('Temporary server response');
  const markdown=source.split(/Markdown Content:\s*/i)[1]||source;
  const heading=`# ${title}`;
  let article=markdown.includes(heading)?markdown.slice(markdown.indexOf(heading)+heading.length):markdown;
  const stop=article.search(/\n(?:Поделиться|\[Новости\]\(https?:\/\/fenka\.online\/news\/?\))/i);
  if(stop>=0)article=article.slice(0,stop);
  const images=[...article.matchAll(/!\[[^\]]*\]\((https?:\/\/fenka\.online\/wp-content\/uploads\/[^)]+)\)/g)].map(m=>m[1]);
  article=article
    .replace(/!\[[^\]]*\]\([^)]+\)/g,'')
    .replace(/\[([^\]]+)\]\((?:https?:\/\/fenka\.online)?[^)]*\)/g,'$1')
    .replace(/^#+\s+/gm,'')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
  const paragraphs=article.split(/\n\s*\n/).map(clean).filter(Boolean);
  const excerpt=(paragraphs.find(p=>!/^Фото\s*:/i.test(p))||title).replace(/[*_`]/g,'').slice(0,260);
  return {...meta,title,excerpt,body:article,image:images[0]||'',images};
}

function parseLegacyHtml(html,meta){
  const metaValue=property=>entities(html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`,'i'))?.[1]||html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`,'i'))?.[1]||'');
  const title=clean(metaValue('og:title').replace(/\s+-\s+ОО ФЕНКА\s*$/i,''))||meta.slug.replace(/-/g,' ');
  if(/(?:503 Service Unavailable|502 Bad Gateway|429 Too Many Requests)/i.test(title))throw new Error('Temporary server response');
  const excerpt=clean(metaValue('og:description').replace(/\s*\[…\]\s*$/,''));
  const image=metaValue('og:image');
  const start=html.search(/<div[^>]+class=["'][^"']*\bcontent\b[^"']*["'][^>]*>/i);
  let fragment=start>=0?html.slice(start):html;
  const stop=fragment.search(/<div[^>]+class=["'][^"']*heateor_sss_sharing_container/i);
  if(stop>=0)fragment=fragment.slice(0,stop);
  fragment=fragment.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<h1[^>]*>[\s\S]*?<\/h1>/i,'').replace(/<(?:br|\/p|\/div|\/li|\/h[2-6])\s*>/gi,'\n\n').replace(/<[^>]+>/g,' ');
  const body=entities(fragment).replace(/[ \t]+/g,' ').replace(/\n\s*\n(?:\s*\n)+/g,'\n\n').trim();
  return {...meta,title,excerpt:excerpt||body.slice(0,260),body,image,images:image?[image]:[]};
}

async function fetchText(url,attempt=1){
  try{
    const response=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 FENKA archive migration'},signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw new Error(`${response.status} ${url}`);
    return {type:'html',text:await response.text()};
  }catch(error){
    if(attempt<4){await new Promise(r=>setTimeout(r,attempt*1800));return fetchText(url,attempt+1)}
    throw error;
  }
}

async function importAll({indexFile='site/news-index.json',outDir='site/news-items',concurrency=10,limit=Infinity}={}){
  const items=JSON.parse(fs.readFileSync(indexFile,'utf8')).slice(0,limit);
  fs.mkdirSync(outDir,{recursive:true});
  let cursor=0,done=0,failed=0;
  async function worker(){
    while(cursor<items.length){
      const meta=items[cursor++];
      const target=path.join(outDir,meta.slug+'.json');
      if(fs.existsSync(target)){done++;continue}
      try{
        const source=await fetchText(meta.url);
        fs.writeFileSync(target,JSON.stringify(source.type==='html'?parseLegacyHtml(source.text,meta):parseLegacyNews(source.text,meta),null,2));
        done++;
      }catch(error){failed++;fs.appendFileSync(path.join(outDir,'failures.log'),`${meta.url}\t${error.message}\n`)}
      if((done+failed)%25===0)console.log(`${done+failed}/${items.length}; saved ${done}; failed ${failed}`);
    }
  }
  await Promise.all(Array.from({length:Math.max(1,Number(concurrency)||1)},worker));
  console.log(`Import finished: saved ${done}, failed ${failed}, total ${items.length}`);
  return {done,failed,total:items.length};
}

if(require.main===module){
  const get=(flag,fallback)=>{const i=process.argv.indexOf(flag);return i>=0?process.argv[i+1]:fallback};
  importAll({concurrency:Number(get('--concurrency',10)),limit:Number(get('--limit',Infinity))}).catch(error=>{console.error(error);process.exitCode=1});
}

module.exports={parseLegacyNews,parseLegacyHtml,importAll};
