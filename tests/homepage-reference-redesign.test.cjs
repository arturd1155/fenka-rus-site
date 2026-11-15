const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

const read=file=>fs.readFileSync(file,'utf8');
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
  const styles=read('style.css');
  assert.equal((html.match(/class="fenka-ribbon__segment/g)||[]).length,4);
  for(const label of ['Люди','Регионы','Культура','Развитие'])assert.match(html,new RegExp(`class="fenka-ribbon__segment[^"]*"[\\s\\S]*?${label}`));
  assert.match(html,/class="fenka-ribbon__core"[\s\S]*?<strong>ФЕНКА<\/strong>/);
  assert.match(styles,/\.home-system__layout\s*\{[^}]*grid-template-columns/);
  assert.match(styles,/\.fenka-ribbon__segment img\s*\{[^}]*object-fit:contain/);
});

test('builds the six-tile directions panorama with a mobile snap strip',()=>{
  const html=read('index.html');
  const styles=read('style.css');
  assert.equal((html.match(/class="direction-tile/g)||[]).length,6);
  assert.match(html,/class="direction-panorama"/);
  assert.match(styles,/\.direction-panorama\s*\{[^}]*grid-template-columns:repeat\(6/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.direction-panorama\s*\{[^}]*overflow-x:auto[^}]*scroll-snap-type:x mandatory/);
  assert.match(styles,/\.direction-tile img\s*\{[^}]*object-fit:contain/);
});
