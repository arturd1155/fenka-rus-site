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

process.nextTick(() => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist', 'leadership-photos', 'optimized');
  fs.mkdirSync(output, { recursive: true });
  fs.copyFileSync(path.join(root, 'shared', 'leadership-photos.css'), path.join(root, 'dist', 'shared', 'leadership-photos.css'));

  const page = path.join(root, 'dist', 'leadership', 'index.html');
  let html = fs.readFileSync(page, 'utf8').replace('</head>', '<link rel="stylesheet" href="/shared/leadership-photos.css?v=20261114-mobile2"></head>');
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
    const portrait = `<div class="leadership-card__portrait leadership-card__portrait--${slug}"><img src="/leadership-photos/optimized/${optimizedFile}" alt="${name}" width="720" height="900" ${loading} decoding="async"></div>`;
    if (!html.includes(placeholder)) throw new Error(`Leadership placeholder not found: ${name}`);
    html = html.replace(placeholder, portrait);
  }

  fs.writeFileSync(page, html);
});
