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

test('build emits a media landing page with an internal heritage entry point',()=>{
  const html=fs.readFileSync('dist/media/index.html','utf8');
  assert.match(html,/Медиатека ФЕНКА/);
  assert.match(html,/href="\/media\/heritage\/heritage\.css"/);
  assert.match(html,/href="\/media\/heritage\/"/);
  assert.match(html,/Наследие ФЕНКА/);
  assert.doesNotMatch(html,/arturd1155\.github\.io\/nasledie-fenka/);
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
  assert.match(html,/href="\/media\/heritage\/heritage\.css"/);
  assert.match(html,/role="dialog"/);
  assert.match(html,/aria-modal="true"/);
  assert.match(html,/data-image-fallback/);
  assert.match(html,/Материалы не найдены/);
  assert.match(css,/\.heritage-page/);
  assert.match(css,/@media\s*\(max-width:\s*480px\)/);
  assert.match(css,/:focus-visible/);
  assert.doesNotMatch(css,/(^|})\s*body\s*\{/m);
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

test('homepage previews real heritage collections with working library links',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const expected=[
    ['/media/heritage/#evrei','/media/heritage/thumbnails/evrei-cover.jpg'],
    ['/media/heritage/#istorii','/media/heritage/thumbnails/nasledie-cover.jpg'],
    ['/media/heritage/#sinagogi','/media/heritage/thumbnails/sinagogi-cover.jpg']
  ];
  for(const [href,src] of expected){
    assert.match(html,new RegExp(`href="${href}"`));
    assert.match(html,new RegExp(`src="${src}"`));
  }
  assert.match(html,/href="\/media\/heritage\/"[^>]*>Открыть всю библиотеку/);
});

test('homepage flagship initiatives are distinct from the media library',()=>{
  const html=fs.readFileSync('dist/index.html','utf8');
  const block=html.match(/<section class="section projects"[\s\S]*?<\/section>/)?.[0]||'';
  for(const title of ['Культурный отдел ФЕНКА','Новые горизонты','Фестиваль еврейской музыки в Казани']){
    assert.match(block,new RegExp(title));
  }
  assert.doesNotMatch(block,/Синагоги мира|Наследие ФЕНКА/);
});
