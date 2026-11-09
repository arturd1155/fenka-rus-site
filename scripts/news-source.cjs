const fs=require('node:fs');
const path=require('node:path');

function readNewsSitemaps(files){
  const seenUrls=new Set();
  const seenSlugs=new Map();
  const items=[];
  for(const file of files){
    const text=fs.readFileSync(path.resolve(file),'utf8');
    const pattern=/\[https?:\/\/fenka\.online\/news\/([^/]+)\/\]\((https?:\/\/fenka\.online\/news\/[^)]+\/?)\)\s*\r?\n(\d{4}-\d\d-\d\dT[^\s]+)/g;
    for(const match of text.matchAll(pattern)){
      const url=match[2];
      if(seenUrls.has(url))continue;
      seenUrls.add(url);
      const base=match[1];
      const count=(seenSlugs.get(base)||0)+1;
      seenSlugs.set(base,count);
      const slug=count===1?base:`${base}-${count}`;
      const date=match[3];
      items.push({url,date,year:Number(date.slice(0,4)),slug,internalUrl:`/news/${slug}/`});
    }
  }
  return items.sort((a,b)=>b.date.localeCompare(a.date));
}

if(require.main===module){
  const files=process.argv.slice(2);
  const items=readNewsSitemaps(files);
  const out=path.resolve('site','news-index.json');
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify(items,null,2));
  console.log(`Saved ${items.length} news items to ${out}`);
}

module.exports={readNewsSitemaps};
