const fs = require('node:fs');
const path = require('node:path');

const portraits = [
  ['СМ', 'sergey-melnikov.jpg', 'Мельников Сергей Евгеньевич', 'melnikov'],
  ['ДИ', 'igor-dabakarov.jpg', 'Дабакаров Игорь Амнерович', 'dabakarov'],
  ['ЗГ', 'german-zakharyaev.png', 'Захарьяев Герман Рашбилович', 'zakharyaev'],
  ['БА', 'alexander-boroda.png', 'Борода Александр Моисеевич', 'boroda'],
  ['ГГ', 'georgy-golukhov.png', 'Голухов Георгий Натанович', 'golukhov'],
  ['ГМ', 'mark-goldin.png', 'Гольдин Марк Эльевич', 'goldin'],
  ['ОМ', 'mikhail-oshtrakh.png', 'Оштрах Михаил Иосифович', 'oshtrakh'],
  ['КГ', 'gennady-katsnelson.png', 'Кацнельсон Геннадий Борисович', 'katsnelson'],
  ['ЮЕ', 'elena-yusfin.png', 'Юсфин Елена Леонидовна', 'yusfin'],
  ['ВИ', 'irina-veysman.png', 'Вейсман Ирина Зиновьевна', 'veysman'],
  ['ЛИ', 'igor-litvak.png', 'Литвак Игорь Маркович', 'litvak'],
  ['ТП', 'pavel-tipikin.png', 'Типикин Павел Николаевич', 'tipikin'],
  ['ШЕ', 'erukhom-shalmiev.png', 'Шальмиев Ерухом Илизирович', 'shalmiev']
];

const presidentStatement = 'Сохраняя многовековые традиции еврейского народа, мы не просто бережём прошлое — мы закладываем фундамент будущего. Наша миссия — объединять поколения, укреплять общины и создавать новые возможности для развития еврейской жизни в России. Ведь народ силён, пока жива его память, крепко его единство и есть кому продолжить его дело.';
const profiles = {
  melnikov: {
    name: 'Мельников Сергей Евгеньевич', role: 'Президент', email: 'info@fenkar.ru', phone: '', statement: presidentStatement,
    biography: [
      'Мельников Сергей Евгеньевич родился 22 августа 1959 года в г. Москве.',
      'В 1976 году поступил в Московский химико-технологический институт им. Д. И. Менделеева на факультет неорганической химии, который окончил в 1982 году и поступил на работу на опытный завод НИУИФ, где прошёл путь от мастера смены до заместителя начальника цеха по производству удобрений.',
      'В 1988 году поступил в Академию внешней торговли и после её окончания перешёл на работу в Союзагрохимэкспорт. Одновременно в 1988 году защитил диссертацию и получил звание кандидата технических наук.',
      'В Союзагрохимэкспорте прошёл путь от старшего инженера фирмы «Карбамид» до её директора, а позже стал заместителем генерального директора. Работал в Австрии генеральным директором фирмы «Уритранс».',
      'Является действительным членом Международной академии наук, экологии, безопасности человека и природы. Свободно владеет английским языком.',
      'С 2023 года является Президентом общественной организации «Федеральная еврейская национально-культурная автономия» (ОО «ФЕНКА») и членом Совета при Президенте Российской Федерации по межнациональным отношениям.'
    ]
  },
  dabakarov: {
    name: 'Дабакаров Игорь Амнерович', role: 'Исполнительный Вице-президент', email: 'ilezer@mail.ru', phone: '+7 (960) 372-76-13',
    biography: [
      'Член Совета ФЕНКА, Генеральный директор, Председатель Правления Ульяновской РЕНКА.',
      'Родился 2 сентября 1975г. в г.Самарканде.',
      'В 1996 году создал Ульяновскую городскую общественную организацию — еврейский молодёжный клуб «Мишпаха Гдола». В 1997 году зарегистрировал и по сей день является президентом этой организации.',
      'С 2000 года является председателем правления Ульяновской еврейской культурно-просветительской общественной организации «Шалом». С 2004 года избран председателем правления Ульяновской региональной еврейской национально-культурной автономии.',
      'С 2010 года — Президент Российского еврейского молодёжного конгресса. За успешную работу по организации еврейской жизни неоднократно награждался премиями Американского еврейского распределительного комитета «Джоинт», «Банчер», Федерации еврейских общин России, награждён премией Чарльза Хоффана как лучший руководитель еврейской общины России.',
      'Является членом Совета по делам национальностей при Губернаторе Ульяновской области, членом Генеральной Ассамблеи Евроазиатского еврейского конгресса, депутатом Европейского еврейского парламента, членом Общественной палаты Ульяновской области, членом Совета и Генеральным директором ФЕНКА.',
      'Воспитывает троих детей.'
    ]
  },
  zakharyaev: {
    name: 'Захарьяев Герман Рашбилович', role: 'Вице-президент', email: '9261315959@bk.ru', phone: '8 (926) 131-59-59',
    biography: [
      'Герман Рашбилович Захарьяев — известный бизнесмен и меценат, вице-президент Всемирного конгресса горских евреев, президент Международного благотворительного фонда горских евреев СТМЭГИ.',
      'Родился 7 июля 1971 года в поселке Красная (Еврейская) Слобода, г. Куба, в Азербайджане. В начале 1990-х годов переехал в Москву.',
      'Окончил Российскую академию народного хозяйства и государственной службы при Президенте РФ. Защитил диссертацию по теме «Эволюция религиозно-теологической концепции хасидизма» и получил степень кандидата философских наук.',
      'В августе 2001 года семьёй Захарьяевых был создан и зарегистрирован Региональный общественный фонд горских евреев СТМЭГИ. Цель фонда — продвижение проектов, направленных на развитие общинной жизни, сохранение и укрепление традиций горских евреев.',
      'На базе фонда появился Международный благотворительный фонд горских евреев, поддерживающий общинную жизнь во многих странах. Представительства СТМЭГИ работают в России, Израиле, Азербайджане и США.',
      'При поддержке Германа Захарьяева произведения Шолом-Алейхема были изданы на азербайджанском языке. В 2011 году при его активном участии была создана первая социальная сеть горских евреев.',
      'Герман Захарьяев выступил инициатором внесения в еврейский календарь памятной даты «Йом шихрур вэ ацала» — Дня спасения и освобождения. Женат, воспитывает четверых детей.'
    ]
  },
  boroda: { name: 'Борода Александр Моисеевич', role: 'Вице-президент', email: 'info@fenkar.ru', phone: '', biography: [] },
  golukhov: {
    name: 'Голухов Георгий Натанович', role: 'Вице-президент', email: 'info@fenkar.ru', phone: '',
    biography: [
      'Родился 24 июня 1960 года в городе Москва.',
      'В 1983 году окончил 2-й Московский ордена Ленина государственный медицинский институт им. Н. И. Пирогова, а в 2002 году — Академию народного хозяйства при Правительстве Российской Федерации.',
      'С 1988 по 2012 год — главный врач Городской клинической больницы № 31 Департамента здравоохранения города Москвы.',
      'С мая 2012 по октябрь 2014 года — Министр Правительства Москвы, руководитель Департамента здравоохранения города Москвы. С октября 2014 по январь 2015 года — президент Научно-исследовательского института организации здравоохранения и медицинского менеджмента Департамента здравоохранения города Москвы.',
      'С января 2015 года — президент Городской клинической больницы № 31. Доктор медицинских наук, профессор, член-корреспондент Российской академии наук, полковник медицинской службы.',
      'Награждён Орденом Дружбы, медалью «В память 850-летия Москвы», Золотым Почётным знаком «Общественное признание», знаком «Отличник здравоохранения» и другими наградами. Автор 103 печатных работ, в том числе 11 монографий.'
    ]
  },
  goldin: { name: 'Гольдин Марк Эльевич', role: 'Член Совета', email: 'hesed-izhevsk@mail.ru', phone: '8 (3412) 63-77-78', biography: ['Президент ЕНКА Удмуртской Республики.'] },
  oshtrakh: { name: 'Оштрах Михаил Иосифович', role: 'Член Совета', email: 'oshtrakh@gmail.com', phone: '8 (343) 359-83-09', biography: ['Президент ЕНКА Свердловской области'] },
  engel: { name: 'Энгель Виктория Михайловна', role: 'Член Совета', email: 'vm.engel@mail.ru', phone: '8 (495) 309-00-11 доб. 704', biography: [] },
  katsnelson: { name: 'Кацнельсон Геннадий Борисович', role: 'Член Совета', email: 'info@fenkar.ru', phone: '', biography: ['Крупный предприниматель, который руководит многопрофильным бизнесом в Самаре и Самарской области. Также известен своей благотворительной деятельностью.'] },
  yusfin: { name: 'Юсфин Елена Леонидовна', role: 'Член Совета', email: 'fenka613@gmail.ru', phone: '', biography: [] },
  veysman: { name: 'Вейсман Ирина Зиновьевна', role: 'Член Совета', email: 'irinaveis@mail.ru', phone: '+7 927 134-16-67', biography: [] },
  litvak: { name: 'Литвак Игорь Маркович', role: 'Член Совета', email: 'info@fenkar.ru', phone: '', biography: [] },
  tipikin: { name: 'Типикин Павел Николаевич', role: 'Член Совета', email: 'info@fenkar.ru', phone: '', biography: [] },
  shalmiev: { name: 'Шальмиев Ерухом Илизирович', role: 'Член Совета', email: 'info@fenkar.ru', phone: '', biography: [] }
};

process.nextTick(() => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist', 'leadership-photos', 'optimized');
  fs.mkdirSync(output, { recursive: true });
  fs.copyFileSync(path.join(root, 'shared', 'leadership-photos.css'), path.join(root, 'dist', 'shared', 'leadership-photos.css'));
  fs.copyFileSync(path.join(root, 'shared', 'leadership-profiles.js'), path.join(root, 'dist', 'shared', 'leadership-profiles.js'));

  const page = path.join(root, 'dist', 'leadership', 'index.html');
  let html = fs.readFileSync(page, 'utf8').replace('</head>', '<link rel="stylesheet" href="/shared/leadership-photos.css?v=20261114-profiles"></head>');
  html = html.replace(/<p class="leadership-source">[\s\S]*?<\/p>/, '');
  for (const name of ['Захарьяев Герман Рашбилович', 'Борода Александр Моисеевич', 'Голухов Георгий Натанович']) {
    html = html.replace(`<p class="leadership-card__role">Член Совета</p><h3>${name}</h3>`, `<p class="leadership-card__role">Вице-президент</p><h3>${name}</h3>`);
  }

  html = html.replace(/(<section class="leadership-grid"[\s\S]*?<\/section>)/, section => section.replace(/<article class="leadership-card">[\s\S]*?<\/article>/g, card => {
    if (card.includes('leadership-card__contacts')) return card;
    return card.replace('</div></article>', '<div class="leadership-card__contacts"><a href="mailto:info@fenkar.ru">info@fenkar.ru</a></div></div></article>');
  }));

  html = html.replace(/<section class="leadership-grid"([^>]*)>([\s\S]*?)<\/section>/, (section, attributes, content) => {
    const cards = content.match(/<article class="leadership-card">[\s\S]*?<\/article>/g) || [];
    const vicePresidents = cards.filter(card => card.includes('leadership-card__role">Вице-президент'));
    const members = cards.filter(card => !card.includes('leadership-card__role">Вице-президент'));
    vicePresidents.sort((left, right) => left.match(/<h3>([^<]+)/)[1].localeCompare(right.match(/<h3>([^<]+)/)[1], 'ru'));
    return `<section class="leadership-grid"${attributes}>${vicePresidents.join('')}${members.join('')}</section>`;
  });

  for (const [index, [initials, file, name, slug]] of portraits.entries()) {
    const optimizedFile = file.replace(/\.(?:png|jpe?g)$/i, '.jpg');
    fs.copyFileSync(path.join(root, 'leadership-photos', 'optimized', optimizedFile), path.join(output, optimizedFile));
    const placeholder = `<div class="leadership-card__portrait" aria-hidden="true"><span>${initials}</span></div>`;
    const loading = index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    const portraitVersion = slug === 'melnikov' ? '?v=20261114-melnikov2' : '';
    const portrait = `<div class="leadership-card__portrait leadership-card__portrait--${slug}"><img src="/leadership-photos/optimized/${optimizedFile}${portraitVersion}" alt="${name}" width="720" height="900" ${loading} decoding="async"></div>`;
    if (!html.includes(placeholder)) throw new Error(`Leadership placeholder not found: ${name}`);
    html = html.replace(placeholder, portrait);
  }

  html = html.replace(/<article class="leadership-card">[\s\S]*?<\/article>/g, card => {
    const entry = Object.entries(profiles).find(([, profile]) => card.includes(`<h3>${profile.name}</h3>`));
    if (!entry) throw new Error('Leadership profile data is missing for a card');
    const [slug, profile] = entry;
    return card
      .replace('<article class="leadership-card">', `<article class="leadership-card" data-leadership-id="${slug}">`)
      .replace('</div></article>', `<button class="leadership-card__open" type="button" aria-label="Подробнее о ${profile.name}">Подробнее <span aria-hidden="true">→</span></button></div></article>`);
  });

  const safeProfiles = JSON.stringify(profiles).replace(/</g, '\\u003c');
  const profileDialog = `<dialog class="leadership-profile" id="leadershipProfileDialog" aria-labelledby="leadershipProfileName"><div class="leadership-profile__shell"><button class="leadership-profile__close" type="button" data-profile-close aria-label="Закрыть">×</button><aside class="leadership-profile__aside"><div class="leadership-profile__portrait" data-profile-portrait><img alt="" width="720" height="900"><span aria-hidden="true"></span></div><p class="leadership-profile__role" data-profile-role></p></aside><article class="leadership-profile__body"><p class="leadership-profile__eyebrow">Руководство ФЕНКА</p><h2 id="leadershipProfileName"></h2><section class="leadership-profile__statement" data-profile-statement hidden><p class="leadership-profile__statement-label">Слово президента</p><blockquote></blockquote></section><div class="leadership-profile__biography" data-profile-biography></div><div class="leadership-profile__contacts" data-profile-contacts></div></article></div></dialog><script type="application/json" id="leadershipProfilesData">${safeProfiles}</script><script src="/shared/leadership-profiles.js?v=20261114-profiles"></script>`;
  html = html.replace('</body>', `${profileDialog}</body>`);

  fs.writeFileSync(page, html);
});
