const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=slug=>fs.readFileSync(`dist/${slug}/index.html`,'utf8');
const generic='Раздел ФЕНКА подготовлен для размещения актуальной и проверенной информации.';

test('site build wires the content cleanup after the about-page hook',()=>{
  const script=fs.readFileSync('scripts/build-site.cjs','utf8');
  const aboutHook=script.indexOf("require('./build-about-hook.cjs')");
  const polishHook=script.indexOf("require('./build-content-polish.cjs')");
  assert.ok(aboutHook>=0);
  assert.ok(polishHook>aboutHook);
});

test('published institutional pages omit internal publishing notes',()=>{
  for(const slug of ['reports','privacy','events','support','documents','contacts']){
    const html=read(slug);
    assert.doesNotMatch(html,new RegExp(generic.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),`${slug} must not expose the internal publishing note`);
    assert.match(html,new RegExp(`<body class="page-${slug}`));
    assert.match(html,/href="\/shared\/content-polish\.css"/);
  }
});

test('privacy page keeps the legal text but removes legacy source controls',()=>{
  const html=read('privacy');
  assert.match(html,/<ol>/);
  assert.match(html,/Согласие на обработку персональных данных/);
  assert.doesNotMatch(html,/Источник: прежняя версия сайта ФЕНКА/);
  assert.doesNotMatch(html,/Открыть исходную страницу/);
  assert.doesNotMatch(html,/class="legal-document__source"/);
});

test('contacts page omits the legacy transfer note',()=>{
  const html=read('contacts');
  assert.doesNotMatch(html,/Контактные данные перенесены с/);
  assert.doesNotMatch(html,/class="contacts-source"/);
  assert.doesNotMatch(html,/fenka\.online\/kontakty/);
});

test('about page removes transfer notes, charter caption and decorative counters only',()=>{
  const html=read('about');
  assert.doesNotMatch(html,/Текст перенесён со страницы/);
  assert.doesNotMatch(html,/Основание: Устав ОО «ФЕНКА»/);
  assert.doesNotMatch(html,/class="about-source"/);
  const goals=html.match(/<div class="about-task-grid">[\s\S]*?<\/section>/)?.[0]||'';
  const strategy=html.match(/<div class="about-directions">[\s\S]*?<\/section>/)?.[0]||'';
  assert.equal((goals.match(/class="about-task"/g)||[]).length,8);
  assert.equal((strategy.match(/class="about-direction"/g)||[]).length,8);
  assert.doesNotMatch(goals,/<span>\d{2}<\/span>/);
  assert.doesNotMatch(strategy,/<span>\d{2}<\/span>/);
  assert.match(html,/class="about-methods"[\s\S]*?<ol>/);
});

test('page-specific spacing stylesheet is local and mobile safe',()=>{
  const css=fs.readFileSync('dist/shared/content-polish.css','utf8');
  for(const selector of ['.page-documents','.page-reports','.page-privacy','.page-contacts'])assert.match(css,new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/overflow-wrap:anywhere/);
  assert.match(css,/\.page-reports \.report-card,\.page-contacts \.contacts-card\{min-width:0/);
  assert.match(css,/@media\(max-width:760px\)[\s\S]*\.page-events \.content-scaffold,\.page-support \.content-scaffold\{grid-template-columns:1fr\}/);
});
