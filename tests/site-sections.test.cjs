const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

const routes=['regions','leadership','documents','reports','about','projects','youth','events','media','news','support','contacts','privacy'];
const primary=['/about/','/regions/','/projects/','/youth/','/events/','/media/','/news/','/contacts/','/support/'];

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
  const socialBlock=footer.match(/<div class="global-footer__social">([\s\S]*?)<\/div>/)?.[1]||'';
  assert.equal((socialBlock.match(/rel="noopener noreferrer"/g)||[]).length,3);
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
test('migrates documents and financial reports without legacy source captions',()=>{
  const documents=fs.readFileSync('dist/documents/index.html','utf8');
  const reports=fs.readFileSync('dist/reports/index.html','utf8');
  assert.match(documents,/Ustav-ot-29\.01\.2023g\.\.pdf/);
  assert.match(documents,/RegistracijaRENKA\.rar/);
  assert.match(documents,/fz-o-naccult-avtonomii\.rtf/);
  assert.doesNotMatch(documents,/Источник: старый сайт ФЕНКА/);
  for(const id of ['ZABS_y82JjFctw','bbUazqvc18eTxg','FmTywswvMQrgxQ']) assert.match(reports,new RegExp(id));
  assert.match(reports,/2022/);
  assert.match(reports,/2021/);
  assert.match(reports,/2020/);
});
test('migrates the approved personal data consent without legacy placeholders',()=>{
  const privacy=fs.readFileSync('dist/privacy/index.html','utf8');
  assert.match(privacy,/Согласие на обработку персональных данных/);
  assert.match(privacy,/Общественная организация «Федеральная еврейская национально-культурная автономия» \(ОО «ФЕНКА»\)/);
  assert.match(privacy,/fenka\.online/);
  assert.match(privacy,/info@fenkar\.ru/);
  assert.match(privacy,/115093, г\. Москва, пер\. Партийный, д\. 1, корп\. 57, стр\. 3/);
  assert.match(privacy,/20 апреля 2020 года/);
  assert.doesNotMatch(privacy,/#(?:SITE_URL|PD_TERMS_PAGE_URL|LEGAL_NAME|ADMIN_EMAIL|LEGAL_ADDRESS)#/);
});
test('migrates head office contacts with safe actionable links and map',()=>{
  const contacts=fs.readFileSync('dist/contacts/index.html','utf8');
  assert.match(contacts,/Головной офис/);
  assert.match(contacts,/\+7 \(903\) 130-11-43/);
  assert.match(contacts,/\+7 \(499\) 130-11-43/);
  assert.match(contacts,/mailto:info@fenkar\.ru/);
  assert.match(contacts,/115093, г\. Москва, пер\. Партийный, д\. 1, корп\. 57, стр\. 3/);
  assert.match(contacts,/101000, г\. Москва, Подсосенский пер\., 21, стр\. 1/);
  assert.match(contacts,/yandex\.ru\/map-widget\/v1\/-\/CCUo5UHeGC/);
  assert.doesNotMatch(contacts,/promeco73\.ru/);
});
test('migrates all leadership records without portrait files',()=>{
  const leadership=fs.readFileSync('dist/leadership/index.html','utf8');
  for(const name of ['Мельников Сергей Евгеньевич','Дабакаров Игорь Амнерович','Захарьяев Герман Рашбилович','Борода Александр Моисеевич','Голухов Георгий Натанович','Гольдин Марк Эльевич','Оштрах Михаил Иосифович','Энгель Виктория Михайловна','Кацнельсон Геннадий Борисович','Юсфин Елена Леонидовна','Вейсман Ирина Зиновьевна','Литвак Игорь Маркович','Типикин Павел Николаевич','Шальмиев Ерухом Илизирович']) assert.match(leadership,new RegExp(name));
  assert.match(leadership,/Президент/);
  assert.match(leadership,/Исполнительный Вице-президент/);
  assert.equal((leadership.match(/class="leadership-card"/g)||[]).length,14);
  assert.doesNotMatch(leadership,/wp-content\/uploads/);
});
test('leadership hero omits the generic placeholder description',()=>{
  const leadership=fs.readFileSync('dist/leadership/index.html','utf8');
  const contacts=fs.readFileSync('dist/contacts/index.html','utf8');
  assert.doesNotMatch(leadership,/Раздел ФЕНКА подготовлен для размещения актуальной и проверенной информации\./);
  assert.match(contacts,/Раздел ФЕНКА подготовлен для размещения актуальной и проверенной информации\./);
});
test('leadership page has one harmonious title and a dedicated compact hero',()=>{
  const leadership=fs.readFileSync('dist/leadership/index.html','utf8');
  assert.equal((leadership.match(/Руководство и Совет ФЕНКА/g)||[]).length,1);
  assert.match(leadership,/<section class="section-hero section-hero--leadership">/);
  assert.match(leadership,/<h1>Руководство и Совет ФЕНКА<\/h1>/);
  assert.doesNotMatch(leadership,/<h1>Руководство<\/h1>/);
  assert.doesNotMatch(leadership,/class="leadership-intro"/);
});
test('youth department is a working media-free section ready for approved content',()=>{
  const youth=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(youth,/<h1>Молодёжный департамент ФЕНКА<\/h1>/);
  for(const title of ['О департаменте','Направления работы','Команда','Проекты','Новости']) assert.match(youth,new RegExp(title));
  assert.match(youth,/href="\/youth\/" aria-current="page">МолДеп<\/a>/);
  assert.doesNotMatch(youth,/<img[^>]+class="youth/);
});
test('migrates the complete official about content into a structured page',()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
  const about=fs.readFileSync('dist/about/index.html','utf8');
  assert.match(about,/Миссия ОО «ФЕНКА»/);
  assert.match(about,/содействие формированию толерантности и гражданского общества в России/i);
  assert.match(about,/сохранение национальной самобытности, развитие еврейского языка, образования, национальной культуры/);
  for(const title of ['Сохранение национальной культуры','Национальное образование','Национальные традиции','Доступ к культурному наследию','Поддержка еврейской общины','Культурная жизнь','Диалог с государством','Межнациональное сотрудничество']) assert.ok(about.includes(title));
  assert.equal((about.match(/class="about-direction"/g)||[]).length,8);
  assert.match(about,/Как ФЕНКА реализует свои задачи/);
  assert.match(about,/создаёт библиотеки, клубы, музеи и мемориалы/);
  for(const phrase of ['на основе исторического опыта жизни еврейской общины','органами государственной власти и местного самоуправления','свидетельства очевидцев','различных форм образования детей и взрослых','за счёт средств ОО «ФЕНКА»','увековечиванию памяти евреев — жителей России','специальных пилотных проектов ОО «ФЕНКА»','лидеров (профессионалов и добровольцев)']) assert.ok(about.includes(phrase));
  assert.match(about,/Восемь перспективных направлений/);
  assert.doesNotMatch(about,/Раздел ФЕНКА подготовлен для размещения актуальной и проверенной информации/);
  assert.doesNotMatch(about,/Раздел наполняется|Структура раздела/);
});
test('about page has a responsive federal-modern presentation',()=>{
  const css=fs.readFileSync('shared/about.css','utf8');
  for(const selector of ['.section-hero--about','.about-mission','.about-task-grid','.about-methods','.about-directions','.about-links']) assert.match(css,new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(css,/\.about-task-grid\{[^}]*grid-template-columns:repeat\(2/);
  assert.match(css,/@media\(max-width:760px\)/);
  assert.match(css,/\.about-task-grid,\.about-directions,\.about-links\{grid-template-columns:1fr\}/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('published pages contain no links that jump to the top as placeholders',()=>{
  const pages=['dist/index.html','dist/regions/index.html'];
  for(const page of pages){
    const html=fs.readFileSync(page,'utf8');
    assert.doesNotMatch(html,/href=["']#["']/i,`${page} must not contain href="#"`);
  }
  const home=fs.readFileSync('dist/index.html','utf8');
  assert.match(home,/href="\/leadership\/">Руководство/);
  assert.match(home,/href="\/documents\/">Документы/);
  assert.match(home,/href="\/reports\/">Отчётность/);
});
