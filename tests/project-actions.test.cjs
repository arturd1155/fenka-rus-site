const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

const read=slug=>fs.readFileSync(`dist/projects/${slug}/index.html`,'utf8');
const count=(html,pattern)=>(html.match(pattern)||[]).length;

test.before(()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
});

test('project CTAs use the approved direct destinations and removals',()=>{
  const kinoklub=read('kinoklub-fenka-v-dome-narodov-rossii');
  assert.match(kinoklub,/href="\/events\/"[^>]*><strong>Афиша кинопоказов<\/strong>/);
  assert.match(kinoklub,/href="#project-application"[^>]*data-project-interest="Стать участником"/);

  const shalom=read('shalom-rossiya');
  assert.doesNotMatch(shalom,/Познакомиться с игрой/);
  assert.match(shalom,/data-project-interest="Получить игру"/);

  const synagogues=read('sinagogi-mira');
  assert.match(synagogues,/href="\/media\/heritage\/#sinagogi"/);
  assert.match(synagogues,/data-project-interest="Предложить историю"/);

  const onko=read('onko-stop');
  assert.doesNotMatch(onko,/Подать заявку на грант/);
  assert.match(onko,/data-project-interest="Узнать о программе"/);

  const memory=read('pamyat-i-budushhee');
  assert.match(memory,/data-project-interest="Стать участником"/);
  assert.doesNotMatch(memory,/<strong>Узнать о программе<\/strong>/);

  const culture=read('kulturnyj-otdel');
  assert.match(culture,/href="\/events\/"[^>]*><strong>Наши мероприятия<\/strong>/);
  assert.match(culture,/data-project-interest="Предложить сотрудничество"/);

  const forum=read('mezhdunarodnyj-forum-evrejskoj-molodyozhi');
  assert.match(forum,/data-project-interest="Стать участником"/);
  assert.match(forum,/href="\/support\/"/);
});

test('external project resources open safely with a visible external cue',()=>{
  const fishki=read('fishki-ot-ilezera-i-mishki');
  assert.doesNotMatch(fishki,/Записаться на мастер-класс/);
  assert.match(fishki,/href="https:\/\/www\.youtube\.com\/playlist\?list=PLsBSS5DnV6C-yOsMhcAb7OJFYFbjYDd0n"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[\s\S]*?Посмотреть рецепты[\s\S]*?↗/);

  const festival=read('festival-evrejskoj-muzyki');
  assert.match(festival,/href="https:\/\/vk\.ru\/kazanjewishfest\?ysclid=mwi7f2eqci882068550"[^>]*target="_blank"[^>]*rel="noopener noreferrer"[\s\S]*?О фестивале[\s\S]*?↗/);
  assert.match(festival,/data-project-interest="Стать участником"/);

  const faces=read('litsa-rossii-xxi-vek');
  assert.equal(count(faces,/href="https:\/\/disk\.yandex\.ru\/d\/pF2-5Znd_WhQFw"/g),2);
  assert.match(faces,/Посмотреть книгу-альбом/);
  assert.match(faces,/Познакомиться с героями/);
  assert.doesNotMatch(faces,/<strong>Узнать о проекте<\/strong>/);
});

test('support-only projects expose one support action and no upper action grid',()=>{
  const slugs=[
    'edinstvo-natsij',
    'vinogradniki-akivy',
    'den-spaseniya-i-osvobozhdeniya',
    'vserossijskaya-programma-etnicheskoe-raznoobrazie-sila-rossii',
    'strana-geroev-2',
    'kinoforum-rukopozhatie',
    'litsa-rossii',
    'klub-mezhnatsionalnyh-initsiativ',
    'rossiya-mnogonatsionalnaya',
    'ruka-druzhby',
    'dialog',
    'strana-geroev'
  ];
  for(const slug of slugs){
    const html=read(slug);
    assert.doesNotMatch(html,/class="heritage-action-grid"/,`${slug} must not have an upper action grid`);
    assert.equal(count(html,/<a class="project-support" href="\/support\/">/g),1,`${slug} must have one project support link`);
    assert.match(html,/Поддержать проект/);
  }
});

test('application projects render one background-sending form without mailto CTAs',()=>{
  const slugs=[
    'kinoklub-fenka-v-dome-narodov-rossii',
    'shalom-rossiya',
    'sinagogi-mira',
    'onko-stop',
    'zabota-o-svoih',
    'festival-evrejskoj-muzyki',
    'pamyat-i-budushhee',
    'mezhdunarodnyj-forum-evrejskoj-molodyozhi',
    'kulturnyj-otdel',
    'shkola-liderov-fenka'
  ];
  for(const slug of slugs){
    const html=read(slug);
    assert.equal(count(html,/id="project-application"/g),1,`${slug} must render one form section`);
    assert.match(html,/data-mail-form/);
    assert.match(html,/data-mail-recipient="info@fenkar\.ru"/);
    assert.match(html,/data-mail-subject="Заявка с сайта ФЕНКА — /);
    assert.match(html,/name="fullName"[^>]*required/);
    assert.match(html,/name="location"[^>]*required/);
    assert.match(html,/name="contact"[^>]*required/);
    assert.match(html,/name="consent"[^>]*required/);
    assert.match(html,/data-mail-status[^>]*aria-live="polite"/);
    assert.match(html,/<button type="submit"[^>]*disabled[^>]*data-mail-submit/);
    assert.match(html,/src="\/mail-forms\.js\?v=20261115-projects2"/);
    assert.match(html,/src="\/shared\/project-forms\.js\?v=20261115-projects1"/);
    assert.doesNotMatch(html,/href="mailto:/);
  }
});

test('multi-action forms offer editable intent options while single-action forms keep intent hidden',()=>{
  const care=read('zabota-o-svoih');
  assert.match(care,/<select[^>]*name="interest"[^>]*required/);
  assert.match(care,/<option value="Узнать о программе">Узнать о программе<\/option>/);
  assert.match(care,/<option value="Подать заявку">Подать заявку<\/option>/);

  const horizons=read('shkola-liderov-fenka');
  assert.match(horizons,/<select[^>]*name="interest"[^>]*required/);
  assert.match(horizons,/<option value="Стать участником">Стать участником<\/option>/);
  assert.match(horizons,/<option value="Узнать о программе">Узнать о программе<\/option>/);

  const kinoklub=read('kinoklub-fenka-v-dome-narodov-rossii');
  assert.match(kinoklub,/<input type="hidden" name="interest"[^>]*value="Стать участником">/);
  assert.doesNotMatch(kinoklub,/<select[^>]*name="interest"/);
});
