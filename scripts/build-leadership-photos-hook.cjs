const fs = require('node:fs');
const path = require('node:path');

const portraits = [
  ['СМ', 'sergey-melnikov.png', 'Мельников Сергей Евгеньевич', 'melnikov'],
  ['ЗГ', 'german-zakharyaev.png', 'Захарьяев Герман Рашбилович', 'zakharyaev'],
  ['БА', 'alexander-boroda.png', 'Борода Александр Моисеевич', 'boroda'],
  ['ГГ', 'georgy-golukhov.png', 'Голухов Георгий Натанович', 'golukhov']
];

process.nextTick(() => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist', 'leadership-photos');
  fs.mkdirSync(output, { recursive: true });
  fs.copyFileSync(path.join(root, 'shared', 'leadership-photos.css'), path.join(root, 'dist', 'shared', 'leadership-photos.css'));

  const page = path.join(root, 'dist', 'leadership', 'index.html');
  let html = fs.readFileSync(page, 'utf8').replace('</head>', '<link rel="stylesheet" href="/shared/leadership-photos.css"></head>');
  html = html.replace(/<p class="leadership-source">[\s\S]*?<\/p>/, '');
  for (const name of ['Захарьяев Герман Рашбилович', 'Борода Александр Моисеевич', 'Голухов Георгий Натанович']) {
    html = html.replace(`<p class="leadership-card__role">Член Совета</p><h3>${name}</h3>`, `<p class="leadership-card__role">Вице-президент</p><h3>${name}</h3>`);
  }

  html = html.replace(/(<section class="leadership-grid"[\s\S]*?<\/section>)/, section => section.replace(/<article class="leadership-card">[\s\S]*?<\/article>/g, card => {
    if (card.includes('leadership-card__contacts')) return card;
    return card.replace('</div></article>', '<div class="leadership-card__contacts"><a href="mailto:info@fenkar.ru">info@fenkar.ru</a></div></div></article>');
  }));

  for (const [initials, file, name, slug] of portraits) {
    fs.copyFileSync(path.join(root, 'leadership-photos', file), path.join(output, file));
    const placeholder = `<div class="leadership-card__portrait" aria-hidden="true"><span>${initials}</span></div>`;
    const portrait = `<div class="leadership-card__portrait leadership-card__portrait--${slug}"><img src="/leadership-photos/${file}" alt="${name}"></div>`;
    if (!html.includes(placeholder)) throw new Error(`Leadership placeholder not found: ${name}`);
    html = html.replace(placeholder, portrait);
  }

  fs.writeFileSync(page, html);
});
