const fs=require('fs');
const crypto=require('crypto');

const source=fs.readFileSync('homepage-russia-regions.svg','utf8');
const overlay=fs.readFileSync('homepage-russia-overlay.svg','utf8');
const expected=source.replace(
  '<g fill="url(#mapBlue)" stroke="#e8f0f7" stroke-opacity=".5" stroke-width=".65"',
  '<g fill="#0b5d99" fill-opacity=".16" stroke="#8bdeff" stroke-opacity=".92" stroke-width=".95"'
);

if(overlay!==expected)throw new Error('Homepage overlay is out of sync with its source');
if(overlay!==fs.readFileSync('dist/homepage-russia-overlay.svg','utf8')){
  throw new Error('Published homepage overlay is out of sync');
}

for(const file of ['homepage-russia-regions.svg','homepage-russia-overlay.svg','dist/homepage-russia-overlay.svg']){
  const svg=fs.readFileSync(file,'utf8');
  const ids=[...svg.matchAll(/data-region="([^"]+)"/g)].map(match=>match[1]);
  if(ids.length!==89||new Set(ids).size!==89){
    throw new Error(`${file} does not contain 89 unique regions`);
  }
  const hash=crypto.createHash('sha256').update(svg).digest('hex').slice(0,12);
  console.log(`${file}: ${fs.statSync(file).size} bytes, sha256 ${hash}`);
}

for(const file of ['index.html','dist/index.html','style.css','dist/style.css']){
  const contents=fs.readFileSync(file,'utf8');
  if(!contents.includes('homepage-russia-overlay.svg?v=20261121-map89')){
    throw new Error(`${file} does not reference the current map cache key`);
  }
  if(contents.includes('homepage-russia-overlay.svg?v=20261112-concept2')){
    throw new Error(`${file} still references the previous map cache key`);
  }
}

console.log('Homepage map assets and cache keys are synchronized.');
