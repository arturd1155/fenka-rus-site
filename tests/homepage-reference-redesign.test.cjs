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
    for(const date of ['2026-11-20','2026-11-23'])assert.match(html,new RegExp(date));
    for(const cover of ['kod-naslediya.jpg','kulturnyj-otdel.jpg','shkola-liderov-fenka.jpg','festival-evrejskoj-muzyki.jpg'])assert.match(html,new RegExp(`<img[^>]+${cover}`));
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
  assert.equal((html.match(/class="direction-tile"/g)||[]).length,6);
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
  assert.match(section,/class="project-mosaic__card project-mosaic__culture-card"[\s\S]*?<img src="\/assets\/projects\/kulturnyj-otdel\.jpg"/);
  assert.match(styles,/\.project-mosaic__culture-card \.project-mosaic__media img\{[^}]*width:100%[^}]*object-fit:cover/);
});

test('builds the combined homepage feed with preserved events and news',()=>{
  const html=read('index.html');
  const styles=readStyles();
  const feed=html.match(/<div class="home-feed">[\s\S]*?<\/div>\s*<section class="section home-join/)?.[0]||'';
  assert.match(feed,/class="[^"]*home-feed__events/);
  assert.match(feed,/class="[^"]*home-feed__news/);
  assert.equal((feed.match(/class="home-event-row"/g)||[]).length,2);
  assert.equal((feed.match(/class="home-news-entry(?: |")/g)||[]).length,4);
  for(const date of ['2026-11-20','2026-11-23'])assert.match(feed,new RegExp(date));
  for(const title of ['Новые горизонты — 2026','Единство народов — в силе диалога'])assert.match(feed,new RegExp(title));
  assert.match(feed,/time class="home-event-row__date-range"/);
  assert.equal((feed.match(/<img class="home-news-entry__image"/g)||[]).length,4);
  assert.doesNotMatch(feed,/href="\/news\/" aria-label="Читать новость/);
  for(const action of ['Подробнее','Читать новость'])assert.match(feed,new RegExp(action));
  assert.match(styles,/\.home-feed__grid\s*\{[^}]*grid-template-columns:repeat\(2/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-feed__grid\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/\.home-event-row>a[^\{]*\{[^}]*width:44px[^}]*height:44px/);
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
  assert.match(styles,/\.footer-grid>div>a:not\(\.brand\)\{[^}]*min-height:44px/);
  assert.match(styles,/\.global-footer a\{[^}]*min-height:44px/);
});

test('copies the dedicated homepage stylesheet during every distribution build',()=>{
  assert.match(read('scripts/build-site.cjs'),/require\('\.\/copy-homepage-reference-css\.cjs'\)/);
  assert.equal(read('dist/homepage-reference.css'),read('homepage-reference.css'));
});

test('news image build removes stale generated assets before copying',()=>{
  const hook=fs.readFileSync('scripts/build-homepage-news-hook.cjs','utf8');
  assert.match(hook,/fs\.rmSync\(target,\{recursive:true,force:true\}\)/);
  assert.match(hook,/fs\.cpSync\(assets,target,\{recursive:true\}\)/);
});

test('cache-busts the corrected reference layout for immediate visibility',()=>{
  for(const file of ['index.html','dist/index.html']){
    assert.match(read(file),/homepage-reference\.css\?v=20261116-culture1/);
  }
});

test('keeps direction photographs above the card background on mobile',()=>{
  const styles=read('homepage-reference.css');
  assert.match(styles,/\.direction-tile\{[^}]*isolation:isolate/);
});

test('provides homepage responsive and reduced-motion resilience',()=>{
  const styles=readStyles();
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-join__layout\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.home-newsletter__layout\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:420px\)\{[\s\S]*\.home-join__grid\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(prefers-reduced-motion:reduce\)\{[\s\S]*\.home-join__action[\s\S]*\.home-newsletter/);
});

test('matches the compact editorial rhythm of the approved desktop reference',()=>{
  const styles=read('homepage-reference.css');
  assert.match(styles,/\/\* Exact reference density correction \*\//);
  assert.match(styles,/\.home-system\{[^}]*padding:52px 0 56px/);
  assert.match(styles,/\.fenka-ribbon\{[^}]*min-height:400px[^}]*transform:none/);
  assert.match(styles,/\.home-directions\{[^}]*padding:46px 0 48px/);
  assert.match(styles,/\.direction-tile\{[^}]*height:260px/);
  assert.match(styles,/\.direction-tile img\{[^}]*object-fit:cover/);
  assert.match(styles,/\.home-projects\{[^}]*padding:48px 0 52px/);
  assert.match(styles,/\.project-mosaic\{[^}]*height:430px/);
  assert.match(styles,/\.home-feed\{[^}]*padding:46px 0 50px/);
  assert.match(styles,/\.home-join\{[^}]*padding:34px 0 36px/);
  assert.match(styles,/\.home-newsletter\{[^}]*padding:32px 0 34px/);
});

test('keeps the compact reference composition on mobile without stacking four oversized system cards',()=>{
  const styles=read('homepage-reference.css');
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.fenka-ribbon\{[^}]*min-height:520px[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[^}]*grid-template-rows:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.direction-tile[^\{]*\{[^}]*height:300px/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.direction-tile h3\{[^}]*font-size:20px/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.direction-tile p\{[^}]*font-size:10px/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.project-mosaic\{[^}]*height:auto/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.project-mosaic__rail \.project-mosaic__card\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:420px\)\{[\s\S]*\.home-event-row\{[^}]*grid-template-columns:76px minmax\(0,1fr\)/);
  assert.match(styles,/\.home-event-row time\.home-event-row__date-range\s*\{[^}]*grid-template-columns:1fr/);
  assert.match(styles,/@media\(max-width:420px\)\{[\s\S]*\.home-news-entry[^\{]*\{[^}]*padding-right:0/);
  assert.match(styles,/@media\(max-width:420px\)\{[\s\S]*\.home-news-entry>i\{[^}]*display:none/);
});

test('keeps FENKA system images and labels clear on desktop and mobile',()=>{
  const styles=read('homepage-reference.css');
  assert.match(styles,/\.fenka-ribbon:before\{display:none\}/);
  assert.match(styles,/\.fenka-ribbon__segment img\{[^}]*z-index:0[^}]*opacity:\.9/);
  assert.match(styles,/\.fenka-ribbon__segment:after\{[^}]*z-index:1/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.fenka-ribbon__segment--people span,\.fenka-ribbon__segment--regions span\{[^}]*top:16px!important[^}]*bottom:auto!important/);
  assert.match(styles,/@media\(max-width:720px\)\{[\s\S]*\.fenka-ribbon__segment--culture span,\.fenka-ribbon__segment--development span\{[^}]*top:auto!important[^}]*bottom:16px!important/);
});

test('keeps compact editorial labels readable at normal desktop zoom',()=>{
  const styles=read('homepage-reference.css');
  assert.match(styles,/\.fenka-ribbon__segment small\{[^}]*font-size:9px/);
  assert.match(styles,/\.fenka-ribbon__core p\{[^}]*font-size:9px/);
  assert.match(styles,/\.direction-tile p\{[^}]*font-size:9px/);
});

test('publishes the approved homepage wording, current phone and working newsletter handoff',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.doesNotMatch(html,/Федеральный центр/);
    assert.doesNotMatch(html,/конкретные культурные проекты/);
    assert.doesNotMatch(html,/Россия · единое культурное пространство/);
    assert.match(html,/href="tel:\+74991301143">\+7 \(499\) 130-11-43<\/a>/);
    assert.match(html,/<form class="home-newsletter__form"[^>]+data-mail-form[^>]+data-mail-recipient="info@fenkar\.ru"/);
    assert.match(html,/<button type="submit">Подписаться<\/button>/);
    assert.match(html,/<script src="mail-forms\.js\?v=20261115-direct1"><\/script>/);
  }
  assert.match(read('homepage-reference.css'),/\.home-newsletter__status\{[^}]*grid-column:1\/-1/);
});

test('education direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--education">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/education-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/education-desktop\.jpg"[^>]+width="971"[^>]+height="1619"/);
  }
  for(const file of [
    'dist/assets/home/education-phone.jpg',
    'dist/assets/home/education-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('culture and heritage direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--culture">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/culture-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/culture-desktop\.jpg"[^>]+width="971"[^>]+height="1619"/);
  }
  for(const file of [
    'dist/assets/home/culture-phone.jpg',
    'dist/assets/home/culture-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('youth initiatives direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--youth">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/youth-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/youth-desktop\.jpg"[^>]+width="971"[^>]+height="1619"/);
  }
  for(const file of [
    'dist/assets/home/youth-phone.jpg',
    'dist/assets/home/youth-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('social programs direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--social">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/social-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/social-desktop\.jpg"[^>]+width="971"[^>]+height="1619"/);
  }
  for(const file of [
    'dist/assets/home/social-phone.jpg',
    'dist/assets/home/social-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('regional development direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--regional">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/regional-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/regional-desktop\.jpg"[^>]+width="1254"[^>]+height="1254"/);
  }
  for(const file of [
    'dist/assets/home/regional-phone.jpg',
    'dist/assets/home/regional-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('interethnic dialogue direction serves the supplied desktop and phone photographs',()=>{
  for(const file of ['index.html','dist/index.html']){
    const html=read(file);
    assert.match(html,/<picture class="direction-tile__media direction-tile__media--dialogue">[\s\S]*?<source media="\(max-width: 720px\)" srcset="\/assets\/home\/dialogue-phone\.jpg">[\s\S]*?<img src="\/assets\/home\/dialogue-desktop\.jpg"[^>]+width="971"[^>]+height="1619"/);
  }
  for(const file of [
    'dist/assets/home/dialogue-phone.jpg',
    'dist/assets/home/dialogue-desktop.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});
