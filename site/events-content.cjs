const events=[
  {
    slug:'obraz-evreya-v-sovetskom-kino',
    year:'2026',
    category:'Киноисследование',
    title:'Образ еврея в советском кино',
    posterTitle:'Образ еврея\nв советском кино',
    lead:'Двухсерийный документальный фильм о том, как менялся образ еврея на советском экране с 1918 по 1991 год.',
    schedules:[
      {date:'2026-10-05',dateLabel:'5 октября 2026',period:'Часть I · 1918–1953',guestTime:'17:00'},
      {date:'2026-10-07',dateLabel:'7 октября 2026',period:'Часть II · 1953–1991',guestTime:'17:00'}
    ],
    location:'Дом народов России',
    address:'Москва, Подсосенский пер., 21, стр. 1',
    details:[
      'Авторы фильма — Леонид Иоффе и Вячеслав Ячников. Леонид Иоффе — журналист, телережиссёр, исследователь и преподаватель. Вячеслав Ячников — культурный деятель и кинодокументалист.',
      'Фильм рассказывает о выдающихся актёрах, воплотивших образ еврея в советском кино, и охватывает кинематограф периода с 1918 по 1991 год.'
    ]
  },
  {
    slug:'shenkman-posledniy-polet',
    year:'2026',
    category:'Документальный фильм',
    title:'Шенкман. Последний полёт',
    posterTitle:'Шенкман\nПоследний полёт',
    lead:'Фильм-расследование Александра Мартиросова о выдающемся организаторе авиационного производства Матвее Шенкмане.',
    schedules:[{date:'2026-04-20',dateLabel:'20 апреля 2026',guestTime:'18:30',startTime:'19:00'}],
    location:'Москва',
    address:'Москва, 1-я Сокольническая ул., 8',
    details:[
      'Матвей Борисович Шенкман возглавил авиазавод после пяти расстрелянных предыдущих директоров и в самом начале войны вывел предприятие на массовое производство знаменитого штурмовика Ил-2.',
      'Он мог твёрдо сказать Сталину «нет», оградил завод от проверок НКВД на несколько лет, а затем попал в две авиакатастрофы менее чем за год. Картина исследует историю жизни и загадку гибели руководителя, чей опыт остаётся актуальным и сегодня.'
    ]
  },
  {
    slug:'karuza',
    year:'2026',
    category:'Военная драма',
    title:'Каруза',
    posterTitle:'Каруза',
    lead:'Военная драма, основанная на реальных событиях: история собаки, спасавшей людей от голода во время блокады Ленинграда.',
    schedules:[{date:'2026-02-25',dateLabel:'25 февраля 2026',guestTime:'17:30',startTime:'18:00'}],
    location:'Дом народов России',
    address:'Москва, Подсосенский пер., 21, стр. 1',
    details:[
      'После просмотра состоится встреча с режиссёром Иваном Харатьяном и обсуждение фильма.'
    ]
  },
  {
    slug:'bimbat-zhizn-nad-zemley',
    year:'2025',
    category:'Докудрама',
    title:'Бимбат. Жизнь над землёй',
    posterTitle:'Бимбат\nЖизнь над землёй',
    lead:'Документально-игровой фильм о Давиде Бимбате — инженере, изобретателе и мечтателе, посвятившем жизнь возрождению дирижаблестроения.',
    schedules:[{date:'2025-12-09',dateLabel:'9 декабря 2025',startTime:'18:00'}],
    location:'Дом народов России',
    address:'Москва, Подсосенский пер., 21, стр. 1',
    facts:['Производство: телекомпания «Телекон», 2025','Режиссёр: Александр Мартиросов'],
    details:[
      'В начале 1960-х годов в Нижнем Тагиле Давид Залманович Бимбат создал общественное конструкторское бюро дирижаблестроения, сконструировал и поднял в воздух первый советский дирижабль на гелии. Это история о верности мечте, внутренней свободе и движении вперёд вопреки сомнениям и сопротивлению.',
      'Фильм — призёр международного кинофестиваля «Соль Земли», победитель международного кинофестиваля «Северный характер», обладатель диплома Мурманского отделения Русского географического общества и финалист конкурса «ТЭФИ-Регион-25».'
    ]
  },
  {
    slug:'iz-ada-v-ad',
    year:'2025',
    category:'Игровое кино',
    title:'Из ада в ад',
    posterTitle:'Из ада\nв ад',
    lead:'Показ фильма Дмитрия Астрахана с последующей встречей с режиссёром и обсуждением киноленты.',
    schedules:[{date:'2025-07-07',dateLabel:'7 июля 2025',guestTime:'15:00',startTime:'15:30'}],
    location:'Дом народов России',
    address:'Москва, Подсосенский пер., 21, стр. 1',
    facts:['Продолжительность: 1 час 40 минут'],
    details:[
      'После киносеанса состоялись встреча с режиссёром Дмитрием Астраханом и обсуждение фильма.'
    ]
  }
];

const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[char]));

function renderSchedule(schedule){
  return `<div class="event-schedule__item">
    <div class="event-schedule__date"><time datetime="${schedule.date}">${escapeHtml(schedule.dateLabel)}</time>${schedule.period?`<span>${escapeHtml(schedule.period)}</span>`:''}</div>
    <div class="event-schedule__times">
      ${schedule.guestTime?`<span><small>Сбор гостей</small><time datetime="${schedule.date}T${schedule.guestTime}">${schedule.guestTime}</time></span>`:''}
      ${schedule.startTime?`<span><small>Начало показа</small><time datetime="${schedule.date}T${schedule.startTime}">${schedule.startTime}</time></span>`:''}
    </div>
  </div>`;
}

function renderEvent(event){
  return `<article class="event-card" data-event-slug="${event.slug}" aria-labelledby="event-${event.slug}">
    <div class="event-card__poster" aria-label="Место для афиши фильма «${escapeHtml(event.title)}»">
      <span>Афиша будет добавлена</span>
      <strong>${event.posterTitle.split('\n').map(escapeHtml).join('<br>')}</strong>
      <i aria-hidden="true">ФЕНКА · Киноклуб</i>
    </div>
    <div class="event-card__body">
      <p class="event-card__category">${escapeHtml(event.category)}</p>
      <h3 id="event-${event.slug}">${escapeHtml(event.title)}</h3>
      <p class="event-card__lead">${escapeHtml(event.lead)}</p>
      <div class="event-schedule">${event.schedules.map(renderSchedule).join('')}</div>
      <div class="event-card__place">
        <span aria-hidden="true">⌖</span>
        <p><strong>${escapeHtml(event.location)}</strong><small>${escapeHtml(event.address)}</small></p>
      </div>
      ${event.facts?.length?`<ul class="event-card__facts">${event.facts.map(fact=>`<li>${escapeHtml(fact)}</li>`).join('')}</ul>`:''}
      <details class="event-card__details">
        <summary>О фильме <span aria-hidden="true">＋</span></summary>
        <div>${event.details.map(paragraph=>`<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
      </details>
    </div>
  </article>`;
}

function renderYear(year,title){
  return `<section class="events-year" aria-labelledby="events-${year}">
    <header class="events-year__header"><p>${year}</p><h2 id="events-${year}">${title}</h2></header>
    <div class="events-list">${events.filter(event=>event.year===year).map(renderEvent).join('')}</div>
  </section>`;
}

function buildEventsMain(){
  return `<main id="main">
    <section class="events-hero">
      <div class="section-shell events-hero__inner">
        <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>—</span><span>События</span></nav>
        <p class="events-hero__eyebrow">Культурная программа ФЕНКА</p>
        <h1>Кино, которое помогает сохранять память</h1>
        <p class="events-hero__lead">Показы игрового и документального кино, встречи с авторами и разговор о людях, истории и выборе.</p>
      </div>
    </section>
    <section class="events-program">
      <div class="section-shell">
        <div class="events-intro"><p>Кинопрограмма</p><h2>Афиша и архив показов</h2><span>Собрали программу в единую хронологию: даты, время и место теперь видны сразу, а подробности открываются внутри карточки.</span></div>
        ${renderYear('2026','Программа 2026')}
        ${renderYear('2025','Архив 2025')}
      </div>
    </section>
  </main>`;
}

module.exports={events,buildEventsMain};
