const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');

test('hero exposes the agreed narrative and one primary action',()=>{
  assert.match(html,/id="homeHero"/);
  assert.match(html,/id="heroMap"/);
  assert.match(html,/id="heroCollage"/);
  assert.match(html,/id="heroStatement"/);
  assert.match(html,/ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство\./);
  assert.equal((html.match(/class="[^"]*hero-primary[^"]*"/g)||[]).length,1);
  assert.match(html,/href="\/#aboutFenka"[^>]*>\s*Узнать о ФЕНКА/);
});

test('hero has a usable no-script and screen-reader structure',()=>{
  assert.match(html,/id="heroMap"[^>]*aria-hidden="true"/);
  assert.match(html,/<noscript>[\s\S]*ФЕНКА объединяет/);
  assert.match(html,/id="aboutFenka"/);
});

test('styles define all scenes and accessibility fallbacks',()=>{
  const sceneCss=fs.readFileSync('style.css','utf8');
  assert.match(sceneCss,/data-scene="network"/);
  assert.match(sceneCss,/data-scene="culture"/);
  assert.match(sceneCss,/data-scene="official"/);
  assert.match(sceneCss,/prefers-reduced-motion:\s*reduce/);
  assert.match(sceneCss,/@media\s*\(max-width:\s*720px\)/);
});

test('homepage initializes one interruptible hero controller',()=>{
  const js=fs.readFileSync('app.js','utf8');
  assert.match(html,/<script src="hero-controller\.js"><\/script>[\s\S]*<script src="app\.js"><\/script>/);
  assert.match(js,/matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(js,/addEventListener\('scroll'/);
  assert.match(js,/cancelAnimationFrame/);
  assert.match(js,/dataset\.scene/);
});

test('about section combines manifesto and history',()=>{
  assert.match(html,/class="fenka-manifesto"/);
  assert.equal((html.match(/class="manifesto-point"/g)||[]).length,3);
  assert.match(html,/class="fenka-timeline"/);
  assert.ok((html.match(/<time/g)||[]).length>=3);
});

test('distribution contains every homepage dependency',()=>{
  for(const file of ['index.html','style.css','app.js','hero-controller.js','fenka-logo-official.png','fenka-regions-visual-clean.png']){
    assert.equal(fs.existsSync(`dist/${file}`),true,`missing dist/${file}`);
  }
});

test('all about links target the implemented section and branding is official',()=>{
  assert.doesNotMatch(html,/href="#about"/);
  assert.equal((html.match(/src="fenka-logo-official\.png"/g)||[]).length,2);
});

test('distribution uses homepage at root and regions as a site section',()=>{
  const home=fs.readFileSync('dist/index.html','utf8');
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  assert.match(home,/id="homeHero"/);
  assert.match(home,/href="\/regions\/"/);
  assert.match(regions,/id="map"/);
  assert.match(regions,/class="global-brand"[^>]*href="\/"/);
});

test('published homepage has no local-only prototype asset links',()=>{
  const builtHtml=fs.readFileSync('dist/index.html','utf8');
  const builtCss=fs.readFileSync('dist/style.css','utf8');
  assert.doesNotMatch(builtHtml,/\.\.\/test\//);
  assert.doesNotMatch(builtCss,/\.\.\/test\//);
});

test('homepage does not duplicate the regions map and both headers use canonical routes',()=>{
  const regionsSource=fs.readFileSync('regions-interactive.html','utf8');
  assert.doesNotMatch(html,/<section class="map-section/);
  assert.doesNotMatch(fs.readFileSync('app.js','utf8'),/regionSearch/);
  const routes=['/#aboutFenka','/regions/','/#projects','/#events','/#media','/#news'];
  for(const route of routes){
    assert.match(html,new RegExp(`href="${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`),`home missing ${route}`);
    assert.match(regionsSource,new RegExp(`href="${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"`),`regions missing ${route}`);
  }
});

test('regions page keeps navigation available on narrow screens',()=>{
  const regionsSource=fs.readFileSync('regions-interactive.html','utf8');
  assert.match(regionsSource,/class="regions-menu-button"/);
  assert.match(regionsSource,/aria-controls="regionsNav"/);
  assert.match(regionsSource,/id="regionsNav"/);
  assert.match(regionsSource,/classList\.toggle\('open'/);
});