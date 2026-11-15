const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('heritage source data and thumbnails are present locally',()=>{
  for(const file of ['site/heritage/data/videos.js','site/heritage/data/sinagogi.js']) assert.equal(fs.existsSync(file),true,`${file} must exist`);
  const videos=fs.readFileSync('site/heritage/data/videos.js','utf8');
  const synagogues=fs.readFileSync('site/heritage/data/sinagogi.js','utf8');
  assert.match(videos,/const videos\s*=\s*\[/);
  assert.match(videos,/vkEmbed/);
  assert.match(synagogues,/const sinagogi\s*=\s*\[/);
  assert.equal(fs.existsSync('site/heritage/thumbnails/evrei-cover.jpg'),true);
  assert.equal(fs.existsSync('site/heritage/thumbnails/nasledie-cover.jpg'),true);
  assert.equal(fs.existsSync('site/heritage/thumbnails/sinagogi-cover.jpg'),true);
});

test('media navigation targets the online library directly',()=>{
  const {sections}=require('../site/site-structure.cjs');
  const media=sections.find(section=>section.slug==='media');
  assert.equal(media.path,'/media/heritage/');
});

test('legacy media path redirects to the online library without an intermediate page',()=>{
  const html=fs.readFileSync('dist/media/index.html','utf8');
  assert.match(html,/<link rel="canonical" href="https:\/\/www\.fenka-rus\.ru\/media\/heritage\/">/);
  assert.match(html,/<meta http-equiv="refresh" content="0; url=\/media\/heritage\/">/);
  assert.match(html,/location\.replace\(['"]\/media\/heritage\/['"]\)/);
  assert.doesNotMatch(html,/media-landing|Медиатека ФЕНКА/);
});

test('build emits the heritage library inside the shared FENKA shell',()=>{
  assert.equal(fs.existsSync('dist/media/heritage/index.html'),true);
  const html=fs.readFileSync('dist/media/heritage/index.html','utf8');
  assert.match(html,/class="global-header"/);
  assert.match(html,/Главная/);
  assert.match(html,/Медиатека/);
  assert.match(html,/Наследие ФЕНКА/);
  for(const title of ['Евреи, изменившие мир','Наследие. Великие истории человечества','Синагоги мира']) assert.match(html,new RegExp(title));
  assert.match(html,/class="global-footer"/);
  assert.doesNotMatch(html,/bootstrap/i);
});

test('heritage styling is local, responsive, and exposes accessible controls',()=>{
  const html=fs.readFileSync('dist/media/heritage/index.html','utf8');
  const css=fs.readFileSync('dist/media/heritage/heritage.css','utf8');
  assert.match(html,/href="\/media\/heritage\/heritage\.css(?:\?[^\"]+)?"/);
  assert.match(html,/role="dialog"/);
  assert.match(html,/aria-modal="true"/);
  assert.match(html,/data-image-fallback/);
  assert.match(html,/Материалы не найдены/);
  assert.match(css,/\.heritage-page/);
  assert.match(css,/@media\s*\(max-width:\s*480px\)/);
  assert.match(css,/:focus-visible/);
  assert.doesNotMatch(css,/(^|})\s*body\s*\{/m);
});

test('desktop heritage hero shows all three portrait covers without cropping',()=>{
  const html=fs.readFileSync('dist/media/heritage/index.html','utf8');
  const css=fs.readFileSync('dist/media/heritage/heritage.css','utf8');
  const mosaic=css.match(/\.heritage-hero__mosaic\{[^}]*\}/)?.[0]||'';
  const covers=css.match(/\.heritage-hero__mosaic img\{[^}]*\}/)?.[0]||'';
  assert.match(mosaic,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(covers,/object-fit:contain/);
  assert.doesNotMatch(css,/\.heritage-hero__mosaic img:nth-child\(2\)\{[^}]*grid-row:span 2/);
  assert.match(html,/heritage\.css\?v=20261115-hero-covers/);
});

test('heritage client script implements normalized search and modal cleanup',()=>{
  const js=fs.readFileSync('dist/media/heritage/heritage.js','utf8');
  assert.match(js,/function normalizeQuery/);
  assert.match(js,/\.trim\(\)\.toLocaleLowerCase\(['"]ru['"]\)/);
  assert.match(js,/function openVideoModal/);
  assert.match(js,/function closeVideoModal/);
  assert.match(js,/replaceChildren\(\)/);
  assert.match(js,/event\.key\s*===\s*['"]Escape['"]/);
  assert.match(js,/addEventListener\(['"]error['"]/);
});

test('heritage page loads local data and behavior in dependency order',()=>{
  const html=fs.readFileSync('dist/media/heritage/index.html','utf8');
  const order=['/media/heritage/data/videos.js','/media/heritage/data/sinagogi.js','/media/heritage/heritage.js'];
  assert.ok(order.every(src=>html.includes(src)));
  assert.ok(html.indexOf(order[0]) < html.indexOf(order[2]));
  assert.ok(html.indexOf(order[1]) < html.indexOf(order[2]));
});

test('heritage browser data references only copied local thumbnails',()=>{
  const raw=fs.readFileSync('site/heritage/data/videos.js','utf8')+fs.readFileSync('site/heritage/data/sinagogi.js','utf8');
  const data=raw.replace(/^\s*\/\/.*$/gm,'');
  for(const [,relative] of data.matchAll(/(?:thumbnail|photo):\s*["']thumbnails\/([^"']+)["']/g)) assert.equal(fs.existsSync('dist/media/heritage/thumbnails/'+relative),true,relative);
});

test('build preserves the GitHub Pages custom domain',()=>{
  assert.equal(fs.existsSync('dist/CNAME'),true);
  assert.equal(fs.readFileSync('dist/CNAME','utf8').trim(),'www.fenka-rus.ru');
});

test('homepage keeps the heritage library out of the streamlined front page',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  assert.doesNotMatch(html,/\/media\/heritage\/#/);
  assert.doesNotMatch(html,/\/media\/heritage\/thumbnails\//);
});

test('homepage flagship initiatives are distinct from the media library',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const block=html.match(/<section class="section projects(?:\s[^"]*)?"[\s\S]*?<\/section>/)?.[0]||'';
  for(const title of ['Культурный отдел ФЕНКА','Новые горизонты','Фестиваль еврейской музыки в Казани']){
    assert.match(block,new RegExp(title));
  }
  assert.doesNotMatch(block,/Синагоги мира|Наследие ФЕНКА/);
});
