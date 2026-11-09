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

test('regional chair portraits are published and used in cards and the detail dialog',()=>{
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  const portraits={
    'vladimir-savelyeva.png':'Владимирская область',
    'voronezh-konishchev.png':'Воронежская область',
    'kostroma-ganin.png':'Костромская область',
    'kursk-diner.png':'Курская область',
    'moscow-oblast-ivanova.png':'Московская область',
    'moscow-yakushev.png':'город Москва',
    'oryol-kamenskaya.png':'Орловская область',
    'ryazan-reznikov.png':'Рязанская область',
    'smolensk-levant.png':'Смоленская область',
    'yaroslavl-zakharov.png':'Ярославская область',
    'novosibirsk-gorbunov.jpg':'Новосибирская область',
    'omsk-birlyant.jpg':'Омская область',
    'crimea-gendin.jpg':'Республика Крым',
    'pyatigorsk-shalumova.jpg':'город Пятигорск',
    'dagestan-pinkhasov.jpg':'Республика Дагестан',
    'kislovodsk-lanovaya.jpg':'город Кисловодск',
    'krasnodar-armer.jpg':'Краснодарский край',
    'rostov-potapov.jpg':'Ростовская область',
    'north-ossetia-nazarova.jpg':'Республика Северная Осетия-Алания',
    'orenburg-suntsova.jpg':'Оренбургская область',
    'saratov-streltsin.jpg':'Саратовская область',
    'volgograd-motornaya.jpg':'Волгоградская область',
    'dzerzhinsk-nefedova.jpg':'город Дзержинск',
    'mari-el-basin.jpg':'Республика Марий Эл',
    'nizhny-novgorod-turaeva.jpg':'Нижегородская область',
    'penza-zheltova.jpg':'Пензенская область',
    'mordovia-drobin.jpg':'Республика Мордовия',
    'samara-kogan.jpg':'Самарская область',
    'tatarstan-pliskin.jpg':'Республика Татарстан',
    'astrakhan-kalinina.jpg':'Астрахань',
    'st-petersburg-lvova.jpg':'город Санкт-Петербург',
    'komi-korotaev.jpg':'Республика Коми',
    'karelia-tsvibel.jpg':'Республика Карелия',
    'vologda-viktorov.jpg':'Вологодская область',
    'tyumen-varkin.jpg':'Тюменская область'
  };
  for(const [file,name] of Object.entries(portraits)){
    assert.equal(fs.existsSync(`dist/region-leaders/${file}`),true,`${file} was not published`);
    assert.match(regions,new RegExp(`"${name.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}":"${file}"`));
  }
  assert.match(regions,/class="region-leader-photo region-leader-photo--'\+size\+'"/);
  assert.match(regions,/id="detailLeaderPhoto"/);
  assert.match(regions,/@media\(max-width:600px\)[\s\S]*\.leadership-preview\{grid-template-columns:1fr/);
  assert.match(regions,/function leadershipCompact\(r\)[\s\S]*?portrait\(r,'small'\)/);
});

test('regional directory applies approved removals, leaders and council portraits',()=>{
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  for(const removed of ['Калининградская область','BANDIT4D'])assert.doesNotMatch(regions,new RegExp(removed));
  assert.match(regions,/<strong>54<\/strong><span>региональных/);
  for(const leader of [
    'Черняк Ирина Иосифовна','Армер Владимир Александрович','Пинхасов Игорь Юшваевич',
    'Лановая Виктория Михайловна','Татьяна Семеновна Назарова','Стрельцин Яков Саввич',
    'Нефедова Вера Александровна','Закарян Елена Викторовна','Плискин Аркадий Дмитриевич',
    'Варкин Игорь Евгеньевич'
  ])assert.match(regions,new RegExp(leader));
  const councilPortraits={
    'Ульяновская область':'igor-dabakarov.jpg',
    'Ивановская область':'elena-yusfin.png',
    'Удмуртская Республика':'mark-goldin.png',
    'Свердловская область':'mikhail-oshtrakh.png'
  };
  for(const [region,file] of Object.entries(councilPortraits)){
    assert.match(regions,new RegExp(`"${region}":"${file}"`));
    assert.equal(fs.existsSync(`dist/region-leaders/${file}`),true);
  }
});

test('regional leader names contain no photo captions, glued titles or broken spacing',()=>{
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  assert.doesNotMatch(regions,/Место для фотографии|Фотография руководителя|Фотография будет добавлена после согласования/);
  const start=regions.indexOf('[',regions.indexOf('const districts='));
  const end=regions.indexOf('];',start)+1;
  const districts=JSON.parse(regions.slice(start,end));
  const byName=Object.fromEntries(districts.flatMap(d=>d.regions).map(r=>[r.name,r]));
  const expected={
    'Воронежская область':['Виктор Дмитриевич Конищев','Председатель автономии'],
    'Ярославская область':['Захаров Вячеслав Владимирович','Председатель Совета'],
    'Севастополь':['Олег Владимирович Янковский','Руководитель'],
    'Республика Мордовия':['Александр Иванович Дробин','Президент'],
    'Республика Хакасия':['Григорий Давидович Пехотник','Председатель'],
    'Иркутская область':['Игорь Эдуардович Пикерский','Президент'],
    'Еврейская автономная область':['Наум Беньаминович Ливант','Руководитель']
  };
  for(const [region,[leader,role]] of Object.entries(expected)){
    assert.equal(byName[region].leader,leader);
    assert.equal(byName[region].role,role);
  }
  assert.equal(byName['Приморский край'].leader,'Клебанов Григорий Вениаминович');
  for(const region of Object.values(byName))assert.doesNotMatch(region.leader||'',/Председател|Президент|Руководител|Тел\.|E-mail|https?:\/\//);
});
test('published regions build keeps district data before attaching tabs',()=>{
  const html=fs.readFileSync('dist/regions/index.html','utf8');
  assert.match(html,/const districts=/);
  assert.ok(html.indexOf('const districts=')<html.indexOf('function showAllRegions('));
});
test('publishes the approved regional leaders and new Donetsk and Mariupol branches',()=>{
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  const start=regions.indexOf('[',regions.indexOf('const districts='));
  const end=regions.indexOf('];',start)+1;
  const districts=JSON.parse(regions.slice(start,end));
  const byName=Object.fromEntries(districts.flatMap(d=>d.regions).map(r=>[r.name,r]));
  const leaders={
    'Ивановская область':'Юсфин Елена Леонидовна',
    'Калужская область':'Денисов Борис Михайлович',
    'Липецкая область':'Асеев Олег Владимирович',
    'Тверская область':'Ротенфельд Александр Евсеевич',
    'Архангельская область':'Лобанова Дарья Михайловна',
    'Приморский край':'Клебанов Григорий Вениаминович',
    'город Донецк':'Карнаух Дмитрий Викторович',
    'город Мариуполь':'Головин Юрий Всеволодович'
  };
  for(const [region,leader] of Object.entries(leaders))assert.equal(byName[region]?.leader,leader);
  assert.equal(byName['город Донецк'].organization,'Общественная организация местная национально-культурная автономия евреев города Донецка');
  assert.equal(byName['город Донецк'].registration,'26.02.2026');
  assert.equal(byName['город Мариуполь'].organization,'Общественная организация местная национально-культурная автономия евреев города Мариуполя');
  assert.equal(byName['город Мариуполь'].registration,'27.02.2026');
  const southern=districts.find(d=>d.name==='Южный федеральный округ');
  assert.ok(southern.regions.some(r=>r.name==='город Донецк'));
  assert.ok(southern.regions.some(r=>r.name==='город Мариуполь'));
});
test('Bryansk leadership is presented as two separate people cards',()=>{
  const regions=fs.readFileSync('dist/regions/index.html','utf8');
  const start=regions.indexOf('[',regions.indexOf('const districts='));
  const end=regions.indexOf('];',start)+1;
  const districts=JSON.parse(regions.slice(start,end));
  const bryansk=districts.flatMap(d=>d.regions).find(r=>r.name==='Брянская область');
  assert.deepEqual(bryansk.leaders,[
    {name:'Михаил Семенович Тительман',role:'Председатель Совета'},
    {name:'Черняк Ирина Иосифовна',role:''}
  ]);
  assert.match(regions,/function leadersFor\(r\)/);
  assert.match(regions,/class="region-card__leaders"/);
  assert.match(regions,/class="leadership-preview__people"/);
  assert.match(regions,/@media\(max-width:600px\)[\s\S]*\.leadership-preview__people/);
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
test('migrates all leadership records and approved council portraits',()=>{
  const leadership=fs.readFileSync('dist/leadership/index.html','utf8');
  for(const name of ['Мельников Сергей Евгеньевич','Дабакаров Игорь Амнерович','Захарьяев Герман Рашбилович','Борода Александр Моисеевич','Голухов Георгий Натанович','Гольдин Марк Эльевич','Оштрах Михаил Иосифович','Энгель Виктория Михайловна','Кацнельсон Геннадий Борисович','Юсфин Елена Леонидовна','Вейсман Ирина Зиновьевна','Литвак Игорь Маркович','Типикин Павел Николаевич','Шальмиев Ерухом Илизирович']) assert.match(leadership,new RegExp(name));
  assert.match(leadership,/Президент/);
  assert.match(leadership,/Исполнительный Вице-президент/);
  assert.equal((leadership.match(/class="leadership-card"/g)||[]).length,14);
  assert.doesNotMatch(leadership,/wp-content\/uploads/);
  assert.doesNotMatch(leadership,/Состав перенесён со страницы/);
  const portraits={
    'sergey-melnikov.jpg':'Мельников Сергей Евгеньевич',
    'igor-dabakarov.jpg':'Дабакаров Игорь Амнерович',
    'german-zakharyaev.png':'Захарьяев Герман Рашбилович',
    'alexander-boroda.png':'Борода Александр Моисеевич',
    'georgy-golukhov.png':'Голухов Георгий Натанович',
    'mark-goldin.png':'Гольдин Марк Эльевич',
    'mikhail-oshtrakh.png':'Оштрах Михаил Иосифович',
    'gennady-katsnelson.png':'Кацнельсон Геннадий Борисович',
    'elena-yusfin.png':'Юсфин Елена Леонидовна',
    'irina-veysman.png':'Вейсман Ирина Зиновьевна',
    'igor-litvak.png':'Литвак Игорь Маркович',
    'pavel-tipikin.png':'Типикин Павел Николаевич',
    'erukhom-shalmiev.png':'Шальмиев Ерухом Илизирович'
  };
  for(const [file,name] of Object.entries(portraits)){
    assert.match(leadership,new RegExp(`leadership-photos/${file}[\\s\\S]{0,900}${name}`));
    assert.equal(fs.existsSync(`dist/leadership-photos/${file}`),true);
  }
  for(const name of ['Захарьяев Герман Рашбилович','Борода Александр Моисеевич','Голухов Георгий Натанович']){
    assert.match(leadership,new RegExp(`Вице-президент[\\s\\S]{0,160}${name}`));
  }
  const council=leadership.match(/<section class="leadership-grid"[\s\S]*?<\/section>/)?.[0]||'';
  const vicePresidents=['Борода Александр Моисеевич','Голухов Георгий Натанович','Захарьяев Герман Рашбилович'];
  assert.ok(vicePresidents.every((name,index)=>index===0||council.indexOf(vicePresidents[index-1])<council.indexOf(name)));
  for(const card of council.match(/<article class="leadership-card">[\s\S]*?<\/article>/g)||[]){
    assert.match(card,/leadership-card__contacts/);
  }
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

test('leadership portraits use a full-width mobile crop instead of a narrow strip',()=>{
  const css=fs.readFileSync('dist/shared/leadership-photos.css','utf8');
  const mobile=css.match(/@media \(max-width: 600px\) \{[\s\S]*\}\s*$/)?.[0]||'';
  assert.match(mobile,/grid-template-columns:\s*1fr/);
  assert.match(mobile,/aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(mobile,/object-fit:\s*cover/);
  assert.doesNotMatch(mobile,/104px/);
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

test('projects archive is fully migrated into internal catalogue and detail pages',()=>{
  const catalogue=fs.readFileSync('dist/projects/index.html','utf8');
  assert.equal((catalogue.match(/class="project-card"/g)||[]).length,25);
  assert.doesNotMatch(catalogue,/Структура раздела|Раздел наполняется/);
  assert.doesNotMatch(catalogue,/Архив объединяет 25 программ ФЕНКА|class="projects-intro"/);
  for(const title of ['Память и Будущее','Фестиваль еврейской музыки','Культурный отдел','Школа лидеров ФЕНКА','Синергия'])assert.match(catalogue,new RegExp(title));
  for(const slug of ['pamyat-i-budushhee','festival-evrejskoj-muzyki','kulturnyj-otdel','shkola-liderov-fenka','strana-geroev']){
    const file=`dist/projects/${slug}/index.html`;
    assert.equal(fs.existsSync(file),true,`${file} is missing`);
    const detail=fs.readFileSync(file,'utf8');
    assert.match(detail,/href="\/projects\/"/);
    assert.doesNotMatch(detail,/fenka\.online\/project\//);
  }
  const memory=fs.readFileSync('dist/projects/pamyat-i-budushhee/index.html','utf8');
  assert.match(memory,/ПРОЕКТНАЯ ДЕЯТЕЛЬНОСТЬ/);
  assert.match(memory,/КУЛЬТУРНО-ПРОСВЕТИТЕЛЬСКИЙ ДИСКУРС/);
});

test('every project card and detail page uses its locally hosted cover',()=>{
  const projects=require('../site/projects-data.cjs');
  const catalogue=fs.readFileSync('dist/projects/index.html','utf8');
  assert.equal((catalogue.match(/class="project-card__cover"/g)||[]).length,projects.length);
  for(const project of projects){
    const cover=`/assets/projects/${project.slug}.webp`;
    assert.equal(fs.existsSync(`dist${cover}`),true,`${cover} is missing`);
    assert.match(catalogue,new RegExp(cover.replaceAll('/','\\/')));
    const detail=fs.readFileSync(`dist/projects/${project.slug}/index.html`,'utf8');
    assert.match(detail,new RegExp(cover.replaceAll('/','\\/')));
    assert.match(detail,/class="project-detail__cover"/);
  }
});

test('every project detail page has a prominent support action',()=>{
  const projects=require('../site/projects-data.cjs');
  for(const project of projects){
    const detail=fs.readFileSync(`dist/projects/${project.slug}/index.html`,'utf8');
    assert.match(detail,/<a class="project-support" href="\/support\/"><span class="project-support__copy"><small>Ваша помощь важна<\/small><b>Поддержать проект<\/b><\/span><span class="project-support__icon" aria-hidden="true">→<\/span><\/a>/);
    assert.doesNotMatch(detail,/Связаться с ФЕНКА/);
  }
});
