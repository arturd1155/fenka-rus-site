const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const source=path.join(root,'homepage-russia-regions.svg');
const target=path.join(root,'homepage-russia-overlay.svg');

const svg=fs.readFileSync(source,'utf8').replace(
  '<g fill="url(#mapBlue)" stroke="#e8f0f7" stroke-opacity=".5" stroke-width=".65"',
  '<g fill="#0b5d99" fill-opacity=".16" stroke="#8bdeff" stroke-opacity=".92" stroke-width=".95"'
);

if(svg===fs.readFileSync(source,'utf8'))throw new Error('Homepage map overlay source signature was not found');
fs.writeFileSync(target,svg);
