const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

const routes=['regions','leadership','documents','reports','about','projects','events','media','news','support','contacts','privacy'];
const primary=['/about/','/regions/','/projects/','/events/','/media/','/news/','/contacts/','/support/'];

test('site structure defines every approved route in order',()=>{
  const {sections}=require('../site/site-structure.cjs');
  assert.deepEqual(sections.map(item=>item.slug),routes);
});

test('build creates every approved route with shared navigation',()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
  for(const slug of routes){
    const html=fs.readFileSync(`dist/${slug}/index.html`,'utf8');
    assert.match(html,/<header class="global-header"/);
    assert.match(html,/<main(?: id="main")?>/);
    assert.match(html,/<footer class="global-footer"/);
    for(const path of primary) assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`));
    assert.equal((html.match(/aria-current="page"/g)||[]).length,slug==='privacy'?0:1);
  }
});

test('shared shell is responsive, keyboard accessible and has official social links',()=>{
  const css=fs.readFileSync('shared/site-shell.css','utf8');
  const js=fs.readFileSync('shared/site-shell.js','utf8');
  const footer=fs.readFileSync('dist/about/index.html','utf8');
  assert.match(css,/@media\s*\(max-width:\s*1020px\)/);
  assert.match(css,/@media\s*\(max-width:\s*480px\)/);
  assert.match(css,/overflow-wrap:\s*anywhere/);
  assert.match(js,/event\.key\s*===\s*'Escape'/);
  assert.match(js,/aria-expanded/);
  for(const href of ['https://vk.ru/fenkarus?ysclid=mue1bx5o93573807833','https://t.me/fenkarus','https://max.ru/join/t1856SKfg2tv8TdYnIjARxurVWQK_ATuRZmt5hLfPoo']) assert.match(footer,new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.equal((footer.match(/rel="noopener noreferrer"/g)||[]).length,3);
});

test('homepage and regions use permanent routes without duplicate homepage map',()=>{
  for(const file of ['dist/index.html','dist/regions/index.html']){
    const html=fs.readFileSync(file,'utf8');
    for(const path of primary) assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`));
    assert.doesNotMatch(html,/href="\/#(?:aboutFenka|projects|events|media|news|join)"/);
  }
  assert.doesNotMatch(fs.readFileSync('dist/index.html','utf8'),/<section class="map-section/);
});

 test('legacy homepage script tolerates shared navigation',()=>{ assert.match(fs.readFileSync('app.js','utf8'),/if\(menuButton&&mobileNav\)/); });

test('regions tabs switch between district map and complete region list',()=>{
  const html=fs.readFileSync('regions-interactive.html','utf8');
  assert.match(html,/data-view="map"/);
  assert.match(html,/data-view="list"/);
  assert.match(html,/function showAllRegions\(/);
  assert.match(html,/viewButtons\.forEach/);
});
test('published regions build keeps district data before attaching tabs',()=>{
  const html=fs.readFileSync('dist/regions/index.html','utf8');
  assert.match(html,/const districts=/);
  assert.ok(html.indexOf('const districts=')<html.indexOf('function showAllRegions('));
});