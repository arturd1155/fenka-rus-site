const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

let html='';

test.before(()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
  html=fs.readFileSync('dist/events/index.html','utf8');
});

function eventSlice(slug){
  const start=html.indexOf(`data-event-slug="${slug}"`);
  assert.notEqual(start,-1,`event ${slug} is published`);
  const next=html.indexOf('data-event-slug="',start+20);
  return html.slice(start,next===-1?html.length:next);
}

test('publishes five unique normalized film events without the duplicated Shenkman entry',()=>{
  assert.equal((html.match(/data-event-slug="/g)||[]).length,5);
  assert.equal((html.match(/data-event-slug="shenkman-posledniy-polet"/g)||[]).length,1);
  for(const title of [
    'Бимбат. Жизнь над землёй',
    'Из ада в ад',
    'Шенкман. Последний полёт',
    'Образ еврея в советском кино',
    'Каруза'
  ])assert.match(html,new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.doesNotMatch(html,/Здесь будут размещены основные материалы|Раздел наполняется/);
});

test('preserves supplied dates, guest times, screening times and addresses without inventing missing facts',()=>{
  for(const datetime of [
    '2025-07-07T15:00','2025-07-07T15:30','2025-12-09T18:00',
    '2026-02-25T17:30','2026-02-25T18:00','2026-04-20T18:30','2026-04-20T19:00',
    '2026-10-05T17:00','2026-10-07T17:00'
  ])assert.match(html,new RegExp(`datetime="${datetime}"`));
  assert.match(html,/Подсосенский пер\., 21, стр\. 1/);
  assert.match(html,/1-я Сокольническая ул\., 8/);
  const shenkman=eventSlice('shenkman-posledniy-polet');
  assert.match(shenkman,/<strong>Москва<\/strong>/);
  assert.doesNotMatch(shenkman,/Киноклуб ФЕНКА/);
  const october=eventSlice('obraz-evreya-v-sovetskom-kino');
  assert.doesNotMatch(october,/Начало (?:показа|просмотра|киносеанса)/);
  assert.match(october,/1918–1953/);
  assert.match(october,/1953–1991/);
});

test('uses semantic disclosures and replaceable 4:5 poster slots in the published page',()=>{
  assert.match(html,/href="\/shared\/events\.css"/);
  assert.equal((html.match(/<details class="event-card__details">/g)||[]).length,5);
  assert.equal((html.match(/class="event-card__poster"/g)||[]).length,5);
  assert.equal((html.match(/Афиша будет добавлена/g)||[]).length,5);
  const css=fs.readFileSync('dist/shared/events.css','utf8');
  assert.match(css,/aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(css,/@media\s*\(max-width:\s*720px\)/);
  assert.match(css,/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css,/:focus-visible/);
  assert.doesNotMatch(html,/[ \t]+$/m);
});
