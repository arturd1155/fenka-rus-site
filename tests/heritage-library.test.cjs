const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('heritage source data and thumbnails are present locally',()=>{
  for(const file of ['site/heritage/data/videos.js','site/heritage/data/sinagogi.js']){
    assert.equal(fs.existsSync(file),true,`${file} must exist`);
  }
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
