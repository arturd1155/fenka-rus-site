const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('youth page publishes the approved cinematic navigation hero without numbering',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(html,/class="youth-landing"/);
  assert.match(html,/href="\/shared\/youth\.css"/);
  assert.match(html,/src="\/shared\/youth\.js"/);
  assert.match(html,/src="\/assets\/youth\/youth-hero\.jpg"/);
  for(const anchor of ['department','directions','team','projects','news']){
    assert.match(html,new RegExp(`href="#${anchor}"`));
    assert.match(html,new RegExp(`id="${anchor}"`));
  }
  for(const label of ['О департаменте','Направления работы','Команда','Проекты','Новости'])assert.match(html,new RegExp(label));
  assert.doesNotMatch(html,/>0[1-5]</);
  assert.doesNotMatch(html,/55\s+регионах/i);
  assert.doesNotMatch(html,/Структура подготовлена к наполнению/);
});

test('youth page keeps four approved focus areas and a mobile-safe interaction contract',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  const css=fs.readFileSync('dist/shared/youth.css','utf8');
  const js=fs.readFileSync('dist/shared/youth.js','utf8');
  for(const label of ['Образование','Развитие лидерства','Межнациональный диалог','Федеральные проекты'])assert.match(html,new RegExp(label));
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
  assert.match(css,/clip-path:/);
  assert.match(css,/min-height:\s*44px/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css,/\.youth-reveal\{opacity:1;transform:none\}/);
  assert.match(css,/\.youth-landing\.has-reveal \.youth-reveal/);
  assert.match(js,/IntersectionObserver/);
  assert.match(js,/classList\.add\('has-reveal'\)/);
  assert.match(js,/is-visible/);
});

test('youth page assets are local and published',()=>{
  for(const file of [
    'dist/shared/youth.css',
    'dist/shared/youth.js',
    'dist/assets/youth/youth-hero.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});
