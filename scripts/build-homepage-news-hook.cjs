const fs=require('node:fs');
const path=require('node:path');
const {loadLatestNews,updateHomepageFile}=require('../site/homepage-news.cjs');

process.nextTick(()=>{
  const root=path.resolve(__dirname,'..');
  const assets=path.join(root,'site-assets','news-images');
  const target=path.join(root,'dist','news-images');
  fs.rmSync(target,{recursive:true,force:true});
  if(fs.existsSync(assets))fs.cpSync(assets,target,{recursive:true});
  updateHomepageFile(path.join(root,'dist','index.html'),loadLatestNews(root));
});
