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

test('homepage hero uses the approved standalone map and an accessible marker layer',()=>{
  assert.match(html,/src="homepage-regions-map-v2\.webp\?v=20261112-concept2"/);
  assert.doesNotMatch(html,/class="hero-connections"/);
  assert.match(html,/id="heroRegionMarkers"/);
  assert.doesNotMatch(html,/id="heroMap"[^>]*aria-hidden="true"/);
  assert.match(html,/aria-label="Региональные отделения ФЕНКА на карте России"/);
});

test('homepage marker data renders named links to the unchanged regions section',()=>{
  const js=fs.readFileSync('app.js','utf8');
  const markerRecords=js.match(/\{name:'[^']+',x:\d+(?:\.\d+)?,y:\d+(?:\.\d+)?\}/g)||[];
  assert.ok(markerRecords.length>=40,`expected at least 40 regional markers, got ${markerRecords.length}`);
  assert.match(js,/heroRegionMarkers/);
  assert.match(js,/href="\/regions\/"/);
  assert.match(js,/aria-label/);
  assert.match(js,/--x/);
  assert.match(js,/--y/);
  const regionsSource=fs.readFileSync('regions-interactive.html','utf8');
  assert.match(regionsSource,/src="fenka-regions-visual-clean\.png"/);
  assert.doesNotMatch(regionsSource,/homepage-regions-map\.png/);
});

test('homepage map markers remain usable on keyboard and mobile',()=>{
  const css=fs.readFileSync('style.css','utf8');
  assert.match(css,/\.hero-region-marker\{/);
  assert.match(css,/\.hero-region-marker:focus-visible/);
  assert.match(css,/\.hero-region-marker__label/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-region-marker/);
});

test('homepage map fills the sticky viewport without illustration gutters',()=>{
  const css=fs.readFileSync('style.css','utf8');
  assert.match(css,/\.hero-map\{[^}]*inset:0/);
  assert.match(css,/\.story-hero\[data-scene="network"\] \.hero-map\{[^}]*transform:none/);
  assert.match(css,/\.hero-map__visual\{[^}]*inset:0[^}]*width:100%[^}]*height:100%[^}]*transform:none/);
  assert.match(css,/\.hero-map__visual:after\{[^}]*linear-gradient\(180deg[^}]*linear-gradient\(90deg/);
  assert.match(css,/\.hero-map__visual\{[^}]*width:max\([^}]*height:max\(/);
  assert.match(css,/width:max\(100vw,178\.9vh\)/);
  assert.match(css,/height:max\(100vh,55\.9vw\)/);
  assert.match(css,/data-scene="culture"\] \.hero-map\{opacity:\.72;[^}]*filter:brightness/);
  assert.match(css,/\.hero-map__visual>img\{[^}]*object-fit:cover/);
  assert.match(css,/\.hero-map__visual>img\{[^}]*object-position:center center/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__visual>img\{[^}]*object-position:/);
});

test('final hero statement stays readable over the animated map',()=>{
  const css=fs.readFileSync('style.css','utf8');
  assert.match(css,/\.story-hero\[data-scene="official"\]\{[^}]*background:#031427[^}]*color:#fff/);
  assert.match(css,/\.story-hero\[data-scene="official"\] \.hero-stage:after\{[^}]*opacity:1/);
  assert.match(css,/\.hero-stage:after\{[^}]*radial-gradient\(ellipse at 55% 58%/);
  assert.match(css,/\.story-hero\[data-scene="official"\] \.hero-map\{[^}]*filter:brightness\(\.4\d\)/);
  assert.match(css,/\.story-hero\[data-scene="official"\] \.hero-statement h1\{[^}]*text-shadow:/);
});

test('handshake stays subordinate to the exact map layer',()=>{
  const css=fs.readFileSync('style.css','utf8');
  assert.match(css,/\.hero-map__art:after\{[^}]*z-index:1[^}]*radial-gradient\(ellipse at 53% 59%[^}]*rgba\(3,20,39,\.78\)/);
  assert.match(css,/\.hero-map__data\{[^}]*z-index:2/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__art:after\{[^}]*radial-gradient\(ellipse at 50% 57%/);
});

test('homepage cache-busts hero CSS and JavaScript after mobile fixes',()=>{
  assert.match(html,/href="style\.css\?v=20261112-mobile9"/);
  assert.match(html,/src="hero-controller\.js\?v=20261112-mobile9"/);
  assert.match(html,/src="app\.js\?v=20261112-mobile9"/);
});

test('homepage renders a decorative animated network behind clickable markers',()=>{
  const js=fs.readFileSync('app.js','utf8');
  const css=fs.readFileSync('style.css','utf8');
  assert.match(html,/id="heroNetwork"[^>]*aria-hidden="true"/);
  assert.match(js,/heroNetwork/);
  assert.match(js,/hero-network__line/);
  assert.match(js,/pathLength="1"/);
  assert.match(js,/hero-network__pulse/);
  assert.match(css,/@keyframes networkLineDraw/);
  assert.match(css,/@keyframes networkPulseTravel/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-network__connection:nth-child\(n\+\d+\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.hero-network/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)[\s\S]*\.hero-region-markers\{display:block/);
});

test('mobile hero shows the whole map and disables expensive continuous effects',()=>{
  const css=fs.readFileSync('style.css','utf8');
  assert.match(html,/<source media="\(max-width: 720px\)" srcset="homepage-regions-mobile\.webp\?v=20261112-concept2" type="image\/webp">/);
  assert.match(html,/class="hero-map__geography" src="homepage-russia-overlay\.svg\?v=20261112-concept2"/);
  assert.match(html,/src="homepage-regions-map-v2\.webp\?v=20261112-concept2"/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__visual\{[^}]*inset:0[^}]*width:100%[^}]*height:100%/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__art img\{[^}]*object-fit:cover/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.story-hero\[data-scene="network"\] \.hero-map\{transform:none/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__art img\{[^}]*max-height:none/);
  assert.match(css,/\.hero-map__art img\{[^}]*max-height:none[^}]*object-fit:cover/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map \.hero-map__geography\{[^}]*width:100%[^}]*max-height:none/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__data\{[^}]*top:19%[^}]*width:96vw[^}]*aspect-ratio:1280\/650/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map \.hero-map__geography\{[^}]*mix-blend-mode:screen/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-map__geography\{display:block/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-network__connection:nth-child\(n\+9\)\{display:none/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-network__pulse\{display:none/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-network__line\{animation:none;stroke-dashoffset:0/);
  assert.match(css,/@media\(max-width:720px\)[\s\S]*\.hero-region-marker:before\{animation:none/);
});

test('mobile hero assets and exact geography are included in the static build',()=>{
  const build=fs.readFileSync('scripts/build-site.cjs','utf8')+fs.readFileSync('scripts/copy-homepage-map-assets.cjs','utf8');
  assert.match(build,/homepage-regions-mobile\.webp/);
  assert.match(build,/homepage-regions-map-v2\.webp/);
  assert.match(build,/homepage-russia-overlay\.svg/);
  assert.equal(fs.existsSync('homepage-regions-mobile.webp'),true);
  assert.equal(fs.existsSync('homepage-regions-map-v2.webp'),true);
  assert.equal(fs.existsSync('homepage-russia-overlay.svg'),true);
  assert.ok(fs.statSync('homepage-regions-mobile.webp').size<700_000,'mobile hero background must stay below 700 KB');
  assert.ok(fs.statSync('homepage-russia-overlay.svg').size<350_000,'mobile vector map must stay below 350 KB');
});

test('hero has a usable no-script and screen-reader structure',()=>{
  assert.doesNotMatch(html,/id="heroMap"[^>]*aria-hidden="true"/);
  assert.match(html,/id="heroCollage"[^>]*aria-hidden="true"/);
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
  assert.match(html,/<script src="hero-controller\.js\?v=20261112-mobile9"><\/script>[\s\S]*<script src="app\.js\?v=20261112-mobile9"><\/script>/);
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
  for(const file of ['index.html','style.css','app.js','hero-controller.js','fenka-logo-official.png','fenka-regions-visual-clean.png','homepage-regions-map-v2.webp','homepage-regions-mobile.webp','homepage-russia-overlay.svg']){
    assert.equal(fs.existsSync(`dist/${file}`),true,`missing dist/${file}`);
  }
});

test('all about links target the implemented section and branding is official',()=>{
  assert.doesNotMatch(html,/href="#about"/);
  assert.equal((html.match(/src="fenka-logo-official\.png"/g)||[]).length,2);
});

test('homepage omits the president and online library promos',()=>{
  assert.doesNotMatch(html,/<section class="section media"/);
  assert.doesNotMatch(html,/<section class="section official"/);
  assert.doesNotMatch(html,/Слово президента ФЕНКА/i);
  assert.doesNotMatch(html,/Онлайн-библиотека/i);
  assert.doesNotMatch(html,/href="\/#media"/);
  assert.ok((html.match(/href="\/media\/"/g)||[]).length>=2,'desktop and mobile media navigation must use /media/');
});

test('homepage initiatives use a responsive full-card editorial mosaic',()=>{
  const css=fs.readFileSync('style.css','utf8');
  const block=html.match(/<section class="section projects(?:\s[^"]*)?"[\s\S]*?<\/section>/)?.[0]||'';
  assert.equal((block.match(/<a[^>]*class="initiative-card(?:\s|\")/g)||[]).length,4);
  assert.equal((block.match(/initiative-card--lead/g)||[]).length,1);
  assert.match(block,/href="\/projects\/kod-naslediya\/"[^>]*class="initiative-card initiative-card--lead"/);
  assert.match(block,/initiative-art--horizons/);
  for(const cover of ['kod-naslediya.jpg','kulturnyj-otdel.webp','festival-evrejskoj-muzyki.webp'])assert.match(css,new RegExp(cover.replace('.','\\.')));
  assert.match(css,/\.initiative-grid\{[^}]*grid-template-columns:repeat\(12,1fr\)/);
  assert.match(css,/\.initiative-card:focus-visible\{[^}]*outline:/);
  assert.match(css,/@media\(hover:hover\)[\s\S]*\.initiative-card:hover \.initiative-art\{[^}]*transform:scale/);
  assert.match(css,/@media\(max-width:900px\)[\s\S]*\.initiative-grid\{[^}]*grid-template-columns:repeat\(2,1fr\)/);
  assert.match(css,/@media\(max-width:640px\)[\s\S]*\.initiative-grid\{[^}]*grid-template-columns:1fr/);
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
  const routes=['/#aboutFenka','/regions/','/#projects','/#events','/media/','/#news'];
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
