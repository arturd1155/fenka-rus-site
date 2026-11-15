const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const read=file=>fs.readFileSync(file,'utf8');
const readStyles=()=>read('style.css')+read('homepage-reference.css');
const normalize=value=>value.replace(/\r\n/g,'\n').trimEnd();
const heroFixture=normalize(read('tests/fixtures/homepage-hero.html'));
const extractHero=html=>normalize(html.match(/    <section class="story-hero"[\s\S]*?^    <\/section>/m)?.[0]||'');
const normalizeBuiltHero=hero=>hero.replace('href="/about/"','href="/#aboutFenka"');

test('keeps the approved hero untouched while installing the reference section order',()=>{
  const source=read('index.html');
  const built=read('dist/index.html');
  assert.equal(extractHero(source),heroFixture);
  assert.equal(normalizeBuiltHero(extractHero(built)),heroFixture);
  const hooks=['home-system','home-directions','home-projects','home-feed','home-join','home-newsletter'];
  for(const html of [source,built]){
    let cursor=html.indexOf('</section>',html.indexOf('id="homeHero"'));
    for(const hook of hooks){
      const next=html.indexOf(hook,cursor);
      assert.ok(next>cursor,`${hook} must follow the previous homepage section`);
      cursor=next;
    }
    for(const title of ['Код наследия','Культурный отдел ФЕНКА','Новые горизонты','Фестиваль еврейской музыки в Казани'])assert.match(html,new RegExp(title));
    for(const date of ['2026-10-14','2026-11-03'])assert.match(html,new RegExp(date));
    for(const cover of ['kod-naslediya.jpg','kulturnyj-otdel.webp','shkola-liderov-fenka.jpg','festival-evrejskoj-muzyki.jpg'])assert.match(html,new RegExp(`<img[^>]+${cover}`));
  }
});

test('builds the FENKA system ribbon from four local visual segments',()=>{
  const html=read('index.html');
  const styles=readStyles();
  assert.equal((html.match(/class="fenka-ribbon__segment/g)||[]).length,4);
  for(const label of ['Люди','Регионы','Культура','Развитие'])assert.match(html,new RegExp(`class="fenka-ribbon__segment[^"]*"[\\s\\S]*?${label}`));
  assert.match(html,/class="fenka-ribbon__core"[\s\S]*?<strong>ФЕНКА<\/strong>/);
  assert.match(styles,/\.home-system__layout\s*\{[^}]*grid-template-columns/);
  assert.match(styles,/\.fenka-ribbon__segment img\s*\{[^}]*object-fit:contain/);
});

test('builds the six-tile directions panorama with a mobile snap strip',()=>{
  const html=read('index.html');
  const styles=readStyles();
  assert.equal((html.match(/class="direction-tile/g)||[]).length,6);
  assert.match(html,/class="direction-panorama"/);
  assert.match(styles,/\.direction-panorama\s*\{[^}]*grid-template-columns:repeat\(6/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.direction-panorama\s*\{[^}]*overflow-x:auto[^}]*scroll-snap-type:x mandatory/);
  assert.match(styles,/\.direction-tile img\s*\{[^}]*object-fit:contain/);
});

test('builds the four-project mosaic without dropping existing initiatives',()=>{
  const html=read('index.html');
  const styles=readStyles();
  const section=html.match(/<section class="[^"]*home-projects[\s\S]*?<\/section>/)?.[0]||'';
  assert.match(section,/class="[^"]*\bproject-mosaic\b/);
  assert.equal((section.match(/project-mosaic__card/g)||[]).length,4);
  assert.equal((section.match(/project-mosaic__lead/g)||[]).length,1);
  assert.match(section,/class="project-mosaic__rail"[\s\S]*?(project-mosaic__card[\s\S]*?){3}/);
  for(const href of ['/projects/kod-naslediya/','/projects/kulturnyj-otdel/','/projects/','/projects/festival-evrejskoj-muzyki/'])assert.match(section,new RegExp(`href="${href}"`));
  for(const title of ['Код наследия','Культурный отдел ФЕНКА','Новые горизонты','Фестиваль еврейской музыки в Казани'])assert.match(section,new RegExp(title));
  assert.match(styles,/\.project-mosaic__media\s*\{[^}]*aspect-ratio:16\/9/);
  assert.match(styles,/\.project-mosaic__media img\s*\{[^}]*object-fit:contain/);
});

test('builds the combined homepage feed with preserved events and news',()=>{
  const html=read('index.html');
  const styles=readStyles();
  const feed=html.match(/<div class="home-feed">[\s\S]*?<\/div>\s*<section class="section home-join/)?.[0]||'';
  assert.match(feed,/class="[^"]*home-feed__events/);
  assert.match(feed,/class="[^"]*home-feed__news/);
  assert.equal((feed.match(/class="home-event-row"/g)||[]).length,2);
  assert.equal((feed.match(/class="home-news-entry(?: |")/g)||[]).length,4);
  for(const date of ['2026-10-14','2026-11-03'])assert.match(feed,new RegExp(date));
  for(const title of ['Киноклуб ФЕНКА в Доме народов России','Лекция «Еврейское наследие регионов России»','ЕНКА Евпатории получила в дар сидур XVIII века','первый семейный национальный забег'])assert.match(feed,new RegExp(title));
  assert.match(styles,/\.home-feed__grid\s*\{[^}]*grid-template-columns:repeat\(2/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-feed__grid\s*\{[^}]*grid-template-columns:1fr/);
});

test('builds the four-action participation band from current destinations',()=>{
  const html=read('index.html');
  const styles=readStyles();
  const section=html.match(/<section class="[^"]*home-join[\s\S]*?<\/section>/)?.[0]||'';
  assert.equal((section.match(/class="home-join__action(?: |")/g)||[]).length,4);
  for(const href of ['/regions/','/contacts/','/support/'])assert.match(section,new RegExp(`href="${href}"`));
  assert.equal((section.match(/href="\/contacts\/"/g)||[]).length,2);
  assert.match(section,/class="home-join__action home-join__action--accent" href="\/support\/"/);
  assert.match(styles,/\.home-join__action\s*\{[^}]*min-height:(?:4[4-9]|[5-9]\d|\d{3,})px/);
});

test('finishes homepage accessibility with labelled fields, real footer links, and focus rings',()=>{
  const html=read('index.html');
  const styles=readStyles();
  const newsletter=html.match(/<section class="[^"]*home-newsletter[\s\S]*?<\/section>/)?.[0]||'';
  for(const id of ['newsletter-name','newsletter-email']){
    assert.match(newsletter,new RegExp(`<label[^>]+for="${id}"`));
    assert.match(newsletter,new RegExp(`<input[^>]+id="${id}"[^>]+name="`));
  }
  for(const href of ['/about/','/leadership/','/documents/','/reports/','/regions/','/projects/','/youth/','/media/heritage/','/events/','/news/','/contacts/','/privacy/','/support/'])assert.match(html,new RegExp(`href="${href}"`));
  assert.match(styles,/\.home-join__action:focus-visible/);
  assert.match(styles,/\.home-newsletter[^,{]*:focus-visible/);
  assert.match(styles,/footer[^,{]*:focus-visible/);
});

test('provides homepage responsive and reduced-motion resilience',()=>{
  const styles=readStyles();
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-join__layout\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-newsletter__layout\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:420px\)\{[\s\S]*\.home-join__grid\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(prefers-reduced-motion:reduce\)\{[\s\S]*\.home-join__action[\s\S]*\.home-newsletter/);
});
