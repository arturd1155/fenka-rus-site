const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

test.before(()=>{
  execFileSync(process.execPath,['scripts/build-youth-page.cjs']);
});

test('youth page publishes the approved cinematic navigation hero without numbering',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(html,/class="youth-landing"/);
  assert.match(html,/href="\/shared\/youth\.css"/);
  assert.match(html,/src="\/shared\/youth\.js\?v=20261115-direct1"/);
  assert.match(html,/src="\/assets\/youth\/youth-hero-community\.jpg"/);
  for(const anchor of ['department','directions','team','projects','application']){
    assert.match(html,new RegExp(`href="#${anchor}"`));
    assert.match(html,new RegExp(`id="${anchor}"`));
  }
  for(const label of ['О департаменте','Направления работы','Команда','Проекты','Участие'])assert.match(html,new RegExp(label));
  assert.doesNotMatch(html,/>0[1-5]</);
  assert.doesNotMatch(html,/55\s+регионах/i);
  assert.doesNotMatch(html,/Структура подготовлена к наполнению/);
});

test('youth page uses the supplied community photograph as its opening image',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(html,/src="\/assets\/youth\/youth-hero-community\.jpg"[^>]+width="1280"[^>]+height="854"/);
  assert.equal(fs.existsSync('dist/assets/youth/youth-hero-community.jpg'),true);
  assert.deepEqual(
    fs.readFileSync('dist/assets/youth/youth-hero-community.jpg'),
    fs.readFileSync('site-assets/youth/youth-hero-community.jpg')
  );
});

test('youth page keeps four approved focus areas and a mobile-safe interaction contract',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  const css=fs.readFileSync('dist/shared/youth.css','utf8');
  const js=fs.readFileSync('dist/shared/youth.js','utf8');
  for(const label of ['Образование','Развитие лидерства','Межнациональный диалог','Региональные инициативы'])assert.match(html,new RegExp(label));
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
  assert.match(css,/clip-path:/);
  assert.match(css,/min-height:\s*(?:4[4-9]|[5-9]\d)px/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css,/\.youth-reveal\{[^}]*opacity:1;[^}]*transform:none/);
  assert.match(css,/\.youth-landing\.has-reveal \.youth-reveal/);
  assert.match(js,/IntersectionObserver/);
  assert.match(js,/classList\.add\('has-reveal'\)/);
  assert.match(js,/is-visible/);
});

test('youth page assets are local and published',()=>{
  for(const file of [
    'dist/shared/youth.css',
    'dist/shared/youth.js',
    'dist/assets/youth/youth-hero.jpg',
    'dist/assets/youth/evgeniya-polyanina.jpg',
    'dist/assets/youth/mirra-fleys.jpg'
  ])assert.equal(fs.existsSync(file),true,`${file} must be published`);
});

test('youth page publishes the approved team with accessible local portraits',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(html,/Полянина Евгения Сергеевна/);
  assert.match(html,/руководитель Молодёжного департамента ФЕНКА/i);
  assert.match(html,/Флейс Мирра Михайловна/);
  assert.match(html,/координатор по привлечению участников и развитию сообщества/i);
  assert.match(html,/src="\/assets\/youth\/evgeniya-polyanina\.jpg"[^>]+alt="Евгения Полянина"[^>]+loading="lazy"/);
  assert.match(html,/src="\/assets\/youth\/mirra-fleys\.jpg"[^>]+alt="Мирра Флейс"[^>]+loading="lazy"/);
});

test('youth page presents all five supplied regional projects without invented metrics',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  for(const title of [
    'Цаирим ба-Митбах',
    'Кулинарные корни',
    'От идеи к звёздам',
    'Мобильная экспозиция памяти Холокоста',
    'Цдака 2026'
  ])assert.match(html,new RegExp(title));
  for(const city of ['Брянск','Тверь','Ижевск','Сыктывкар','Оренбург'])assert.match(html,new RegExp(`>${city}<`));
  assert.equal((html.match(/data-project-interest=/g)||[]).length,5);
  assert.doesNotMatch(html,/\b55\s+регион/);
  assert.doesNotMatch(html,/бюджет|миллион(?:а|ов)?\s+руб/i);
});

test('participation calls open one structured application dialog and preselect a project',()=>{
  const html=fs.readFileSync('dist/youth/index.html','utf8');
  const js=fs.readFileSync('dist/shared/youth.js','utf8');
  assert.match(html,/<dialog[^>]+id="youthApplication"/);
  for(const name of ['fullName','city','contact','interest','message','privacy'])assert.match(html,new RegExp(`name="${name}"`));
  assert.match(html,/href="\/privacy\/"/);
  assert.match(html,/Мирр[аы] Флейс/);
  assert.match(html,/info@fenkar\.ru/);
  assert.match(js,/dataset\.projectInterest/);
  assert.match(html,/src="\/mail-forms\.js\?v=20261115-direct1"/);
  assert.match(js,/window\.FenkaMailForms[\s\S]*mailForms\.submitToInbox/);
  assert.doesNotMatch(js,/window\.location\.href\s*=\s*`mailto:/);
  assert.match(html,/id="youthApplicationForm"[^>]+data-mail-recipient="info@fenkar\.ru"/);
  assert.match(js,/form\.dataset\.mailRecipient/);
  assert.match(js,/reportValidity\(\)/);
  assert.doesNotMatch(html,/откроется почтовое приложение/i);
});

test('youth content stays mobile-safe, readable and limited to the youth visual layer',()=>{
  const css=fs.readFileSync('dist/shared/youth.css','utf8');
  assert.match(css,/\.youth-team-grid/);
  assert.match(css,/\.youth-project-grid/);
  assert.match(css,/\.youth-application/);
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
  assert.match(css,/@media\s*\(max-width:\s*380px\)/);
  assert.match(css,/object-fit:\s*cover/);
  assert.match(css,/:focus-visible/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.doesNotMatch(css,/(^|\})\s*(body|main|section|article|button|input|select|textarea)\s*\{/m);
});
