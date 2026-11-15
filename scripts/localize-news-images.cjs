const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {loadLatestNews,updateHomepageFile}=require('../site/homepage-news.cjs');
const {originalImageUrl}=require('./sync-latest-news.cjs');

function localPathFor(source){
  const canonical=originalImageUrl(source);
  const year=new URL(canonical).pathname.match(/\/uploads\/(\d{4})\//)?.[1]||'archive';
  const hash=crypto.createHash('sha256').update(canonical).digest('hex').slice(0,20);
  return `/news-images/${year}/${hash}.webp`;
}

function proxyUrlFor(source){
  const proxy=new URL('https://images.weserv.nl/');
  proxy.searchParams.set('url',originalImageUrl(source));
  proxy.searchParams.set('output','webp');
  proxy.searchParams.set('w','1200');
  proxy.searchParams.set('q','76');
  proxy.searchParams.set('we','1');
  return proxy.href;
}

function wordpressCdnUrlFor(source,{preserveSize=false}={}){
  const canonical=new URL(preserveSize?source:originalImageUrl(source));
  const proxy=new URL(`https://i0.wp.com/${canonical.hostname}${canonical.pathname}`);
  proxy.searchParams.set('w','1200');
  proxy.searchParams.set('quality','76');
  proxy.searchParams.set('strip','all');
  return proxy.href;
}

function localizeItemImages(item,manifest,{fallback='/news-images/fallback.svg'}={}){
  const replace=value=>{
    if(typeof value!=='string'||!/^https?:\/\//.test(value))return value;
    return manifest[originalImageUrl(value)]||fallback;
  };
  return {
    ...item,
    image:replace(item.image),
    ...(Array.isArray(item.images)?{images:item.images.map(replace)}:{})
  };
}

function collectImageSources(records,manifest,priorFailures=[]){
  const sourceMap=new Map();
  const add=(source,candidate=source)=>{
    if(typeof source!=='string'||!/^https?:\/\//.test(source))return;
    const canonical=originalImageUrl(source);
    if(!sourceMap.has(canonical))sourceMap.set(canonical,new Set());
    sourceMap.get(canonical).add(candidate);
  };
  for(const source of Object.keys(manifest||{}))add(source);
  for(const failure of priorFailures||[])add(failure?.source);
  for(const {item} of records||[])for(const value of [item.image,...(Array.isArray(item.images)?item.images:[])])add(value,value);
  return [...sourceMap].map(([canonical,values])=>({canonical,candidates:[...values].sort((a,b)=>Number(b!==canonical)-Number(a!==canonical))}));
}

function writeJsonIfChanged(file,value){
  const next=JSON.stringify(value,null,2)+'\n';
  if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==next)fs.writeFileSync(file,next);
}

function applyLocalizedReferences({root=path.resolve(__dirname,'..'),manifest}={}){
  const itemDir=path.join(root,'site','news-items');
  const indexFile=path.join(root,'site','news-index.json');
  const resolvedManifest=manifest||JSON.parse(fs.readFileSync(path.join(root,'site','news-image-manifest.json'),'utf8'));
  for(const file of fs.readdirSync(itemDir).filter(file=>file.endsWith('.json'))){
    const target=path.join(itemDir,file);
    const item=JSON.parse(fs.readFileSync(target,'utf8'));
    writeJsonIfChanged(target,localizeItemImages(item,resolvedManifest));
  }
  const index=JSON.parse(fs.readFileSync(indexFile,'utf8')).map(item=>localizeItemImages(item,resolvedManifest));
  writeJsonIfChanged(indexFile,index);
  updateHomepageFile(path.join(root,'index.html'),loadLatestNews(root));
  return {items:index.length};
}

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function download(source,target,attempts=5){
  let last;
  for(let attempt=1;attempt<=attempts;attempt++){
    for(const url of [wordpressCdnUrlFor(source,{preserveSize:true}),wordpressCdnUrlFor(source),proxyUrlFor(source)])try{
      const response=await fetch(url,{headers:{accept:'image/webp,image/*','user-agent':'Mozilla/5.0 FENKA image migration'},signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw new Error(`${response.status} ${source}`);
      const type=response.headers.get('content-type')||'';
      if(!type.startsWith('image/'))throw new Error(`Unexpected content type ${type} for ${source}`);
      const data=Buffer.from(await response.arrayBuffer());
      if(data.length<200)throw new Error(`Image is too small for ${source}`);
      fs.mkdirSync(path.dirname(target),{recursive:true});
      fs.writeFileSync(target,data);
      return data.length;
    }catch(error){last=error}
    if(attempt<attempts)await sleep(attempt*1500);
  }
  throw last;
}

async function localizeAll({root=path.resolve(__dirname,'..'),concurrency=16}={}){
  const itemDir=path.join(root,'site','news-items');
  const assetRoot=path.join(root,'site-assets');
  const manifestFile=path.join(root,'site','news-image-manifest.json');
  const failuresFile=path.join(root,'site','news-image-failures.json');
  const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
  const priorFailures=fs.existsSync(failuresFile)?JSON.parse(fs.readFileSync(failuresFile,'utf8')):[];
  const files=fs.readdirSync(itemDir).filter(file=>file.endsWith('.json'));
  const records=files.map(file=>({file,item:JSON.parse(fs.readFileSync(path.join(itemDir,file),'utf8'))}));
  const sources=collectImageSources(records,manifest,priorFailures);
  let cursor=0,downloaded=0,skipped=0,bytes=0;
  const failures=[];
  async function worker(){
    while(cursor<sources.length){
      const entry=sources[cursor++];
      const source=entry.canonical;
      const local=manifest[source]||localPathFor(source);
      const target=path.join(assetRoot,local.replace(/^\//,''));
      try{
        if(fs.existsSync(target)&&fs.statSync(target).size>200)skipped++;
        else{
          let last;
          for(const candidate of entry.candidates)try{bytes+=await download(candidate,target);last=null;break}catch(error){last=error}
          if(last)throw last;
          downloaded++;
        }
        manifest[source]=local;
      }catch(error){failures.push({source,error:error.message})}
      const done=downloaded+skipped+failures.length;
      if(done%100===0){writeJsonIfChanged(manifestFile,manifest);console.log(`${done}/${sources.length}; downloaded ${downloaded}; failed ${failures.length}`)}
    }
  }
  await Promise.all(Array.from({length:Math.max(1,Number(concurrency)||1)},worker));
  writeJsonIfChanged(manifestFile,manifest);
  applyLocalizedReferences({root,manifest});
  if(failures.length)writeJsonIfChanged(failuresFile,failures);
  else if(fs.existsSync(failuresFile))fs.rmSync(failuresFile);
  console.log(`Image localization: ${downloaded} downloaded, ${skipped} reused, ${failures.length} failed, ${(bytes/1024/1024).toFixed(1)} MB`);
  return {downloaded,skipped,failures,bytes,total:sources.length};
}

if(require.main===module){
  const pos=process.argv.indexOf('--concurrency');
  localizeAll({concurrency:pos>=0?Number(process.argv[pos+1]):16}).then(result=>{if(result.failures.length)process.exitCode=2}).catch(error=>{console.error(error);process.exitCode=1});
}
module.exports={localPathFor,proxyUrlFor,wordpressCdnUrlFor,localizeItemImages,collectImageSources,applyLocalizedReferences,localizeAll};
