const fs=require('fs');
const path=require('path');
const projects=require('../site/projects-data.cjs');
const flagshipProjects=require('../site/flagship-projects.cjs');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const esc=value=>String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const write=(file,value)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value);};
const jpgCovers=new Set(['kod-naslediya','kinoklub-fenka-v-dome-narodov-rossii','shalom-rossiya','sinagogi-mira','onko-stop','zabota-o-svoih','festival-evrejskoj-muzyki','rossiya-mnogonatsionalnaya','ruka-druzhby','dialog','strana-geroev','strana-geroev-2','litsa-rossii','klub-mezhnatsionalnyh-initsiativ','shkola-liderov-fenka','edinstvo-natsij','fishki-ot-ilezera-i-mishki','mezhdunarodnyj-forum-evrejskoj-molodyozhi','litsa-rossii-xxi-vek','den-spaseniya-i-osvobozhdeniya','vinogradniki-akivy','kulturnyj-otdel']);
const coverFile=project=>project.slug+(jpgCovers.has(project.slug)?'.jpg':'.webp');
const actionOptions=action=>action[3]||{};
const isFormAction=action=>action[2]==='#project-application';
const formActions=project=>(project.actions||[]).filter(isFormAction);

function renderAction(action){
  const [label,description,href]=action;
  const options=actionOptions(action);
  const external=options.external||/^https?:\/\//.test(href);
  const attributes=[`href="${esc(href)}"`];
  if(external)attributes.push('target="_blank"','rel="noopener noreferrer"');
  if(isFormAction(action))attributes.push(`data-project-interest="${esc(options.interest||label)}"`);
  return `<a ${attributes.join(' ')}><strong>${esc(label)}</strong><span>${esc(description)} <b aria-hidden="true">${external?'↗':'→'}</b></span></a>`;
}

function renderActions(actions){
  if(!actions||actions.length===0)return '';
  return `<nav class="heritage-action-grid" aria-label="Действия проекта">${actions.map(renderAction).join('')}</nav>`;
}

function renderProjectForm(project){
  const intents=[...new Set(formActions(project).map(action=>actionOptions(action).interest||action[0]))];
  if(intents.length===0)return '';
  const title=project.title;
  const interestControl=intents.length===1
    ?`<input type="hidden" name="interest" data-mail-label="Что вас интересует" value="${esc(intents[0])}">`
    :`<label class="project-application__field project-application__field--wide"><span>Что вас интересует</span><select name="interest" data-mail-label="Что вас интересует" required>${intents.map(intent=>`<option value="${esc(intent)}">${esc(intent)}</option>`).join('')}</select></label>`;
  return `<section class="project-application" id="project-application" aria-labelledby="project-application-title"><div class="project-application__intro"><span>ЗАЯВКА</span><h2 id="project-application-title" tabindex="-1">Связаться по проекту</h2><p>Оставьте контакты — команда ФЕНКА получит обращение напрямую и свяжется с вами.</p></div><form class="project-application__form" data-mail-form data-mail-recipient="info@fenkar.ru" data-mail-subject="Заявка с сайта ФЕНКА — ${esc(title)}"><input type="hidden" name="project" data-mail-label="Проект" value="${esc(title)}">${interestControl}<label class="project-application__field"><span>ФИО</span><input name="fullName" data-mail-label="ФИО" autocomplete="name" required></label><label class="project-application__field"><span>Город или регион</span><input name="location" data-mail-label="Город или регион" autocomplete="address-level1" required></label><label class="project-application__field project-application__field--wide"><span>Телефон, Telegram или email</span><input name="contact" data-mail-label="Контакт" autocomplete="email" required></label><label class="project-application__field project-application__field--wide"><span>Комментарий</span><textarea name="comment" data-mail-label="Комментарий" rows="5" placeholder="Расскажите немного о вашем запросе"></textarea></label><label class="project-application__consent"><input name="consent" type="checkbox" data-mail-label="Согласие на обработку данных" data-mail-value="Подтверждено" required><span>Я согласен(на) с <a href="/privacy/">политикой конфиденциальности</a> и обработкой данных для обратной связи.</span></label><div class="project-application__actions"><button type="submit" disabled data-mail-submit>Отправить заявку <span aria-hidden="true">→</span></button><p data-mail-status aria-live="polite" aria-atomic="true"></p></div><p class="project-application__fallback">Если отправка недоступна, напишите нам: <strong>info@fenkar.ru</strong></p></form></section>`;
}

const pageEnd=withForm=>'<script src="/shared/site-shell.js"></script>'+(withForm?'<script src="/mail-forms.js?v=20261115-projects2"></script><script src="/shared/project-forms.js?v=20261115-projects1"></script>':'')+'</body></html>';

process.nextTick(()=>{
  fs.rmSync(path.join(dist,'projects','videoroliki-na-kanale-fenka'),{recursive:true,force:true});
  fs.rmSync(path.join(dist,'assets','projects','videoroliki-na-kanale-fenka.webp'),{force:true});
  fs.copyFileSync(path.join(root,'shared','projects.css'),path.join(dist,'shared','projects.css'));
  fs.copyFileSync(path.join(root,'shared','heritage-project.css'),path.join(dist,'shared','heritage-project.css'));
  fs.copyFileSync(path.join(root,'shared','project-forms.js'),path.join(dist,'shared','project-forms.js'));
  const coversDir=path.join(dist,'assets','projects');
  fs.mkdirSync(coversDir,{recursive:true});
  for(const project of projects)fs.copyFileSync(path.join(root,'site-assets','projects',coverFile(project)),path.join(coversDir,coverFile(project)));

  const base=fs.readFileSync(path.join(dist,'projects','index.html'),'utf8');
  const header=base.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  const footer=base.match(/<footer class="global-footer">[\s\S]*?<\/footer>/)?.[0];
  if(!header||!footer)throw new Error('Projects hook could not read shared site shell');
  const head=title=>'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' — ФЕНКА</title><link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/projects.css"><link rel="stylesheet" href="/shared/heritage-project.css"></head><body>';
  const cards=projects.map(project=>{
    const showcase=flagshipProjects[project.slug];
    const featured=project.featured||showcase;
    return '<a class="project-card'+(featured?' project-card--featured':'')+'" href="/projects/'+project.slug+'/"><span class="project-card__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="'+esc(showcase?.title||project.title)+'" width="1200" height="675" loading="lazy" decoding="async"></span><span class="project-card__content"><span class="project-card__category">'+esc(project.category)+'</span><h2>'+esc(showcase?.title||project.title)+'</h2><p>'+esc(showcase?.slogan||project.subtitle||project.summary)+'</p><b>Подробнее →</b></span></a>';
  }).join('');
  const catalogue=head('Проекты')+header+'<main><section class="section-hero"><div class="section-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>Проекты</span></nav><h1>Проекты ФЕНКА</h1><p>Культурные, образовательные и общественные инициативы федерального и регионального масштаба.</p></div></section><section class="section-content"><div class="section-shell"><div class="projects-grid">'+cards+'</div></div></section></main>'+footer+pageEnd(false);
  write(path.join(dist,'projects','index.html'),catalogue);

  for(const project of projects){
    const body=(project.sections||[]).map(section=>'<section><h2>'+esc(section[0])+'</h2><p>'+esc(section[1])+'</p></section>').join('')+(project.body||[]).map(paragraph=>'<p>'+esc(paragraph)+'</p>').join('');
    const heritage=project.slug==='kod-naslediya';
    const showcase=flagshipProjects[project.slug];
    const projectSource=showcase||project;
    const projectForm=renderProjectForm(projectSource);
    const hasProjectForm=Boolean(projectForm);
    const projectActions=renderActions(project.actions);
    const heritageActions='<nav class="heritage-action-grid" aria-label="Действия проекта"><a href="/media/heritage/"><strong>Исследовать медиатеку</strong><span>Фильмы, архивы, музыка и истории общин <b>→</b></span></a><a href="mailto:info@fenkar.ru?subject='+encodeURIComponent('Пополнить коллекцию проекта Код наследия')+'"><strong>Пополнить коллекцию</strong><span>Передать семейный архив или материалы общины <b>→</b></span></a><a href="/support/"><strong>Поддержать проект</strong><span>Помочь оцифровке и созданию новых материалов <b>→</b></span></a></nav>';
    const heritageSupport='<section class="heritage-support" aria-labelledby="heritage-support-title"><div><span>ПОДДЕРЖАТЬ ПРОЕКТ</span><h2 id="heritage-support-title">Помогите сохранить историю</h2><p>Ваше пожертвование — это новые оцифрованные архивы, сохранённые воспоминания, документальные фильмы и истории, которые смогут увидеть будущие поколения.</p></div><a class="project-support" href="/support/">Стать частью наследия <span aria-hidden="true">→</span></a></section>';
    const standard='<main class="project-detail"><div class="section-shell"><a class="project-detail__back" href="/projects/">← Все проекты</a><div class="project-detail__layout"><article><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1>'+esc(project.title)+'</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="'+esc(project.title)+'" width="1200" height="675" decoding="async"></figure>'+projectActions+'<p class="project-detail__lead">'+esc(project.summary)+'</p><div class="project-detail__body">'+body+'</div>'+projectForm+'</article><aside><span>НАПРАВЛЕНИЕ</span><strong>'+esc(project.category)+'</strong><a class="project-support" href="/support/"><span class="project-support__copy"><small>Ваша помощь важна</small><b>Поддержать проект</b></span><span class="project-support__icon" aria-hidden="true">→</span></a></aside></div></div></main>';
    const heritageLead=(project.body||[]).slice(0,2).map(paragraph=>'<p>'+esc(paragraph)+'</p>').join('');
    const heritageBody=(project.body||[]).slice(2).map(paragraph=>'<p>'+esc(paragraph)+'</p>').join('');
    const special='<main class="heritage-project"><section class="heritage-banner"><div class="section-shell"><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1 class="heritage-title-sr">Код наследия — цифровая медиатека еврейской жизни России</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="Код наследия — цифровая медиатека еврейской жизни России" width="1672" height="939" decoding="async"></figure>'+heritageActions+'</div></section><section class="heritage-story"><div class="section-shell"><header><span>О ПРОЕКТЕ</span><h2>История, которая продолжает жить</h2></header><article><div class="heritage-story__lead">'+heritageLead+'</div><div class="heritage-story__columns">'+heritageBody+'</div></article>'+heritageSupport+'</div></section></main>';
    const showcaseActions=showcase?renderActions(showcase.actions):'';
    const showcaseSupport=showcase?'<section class="heritage-support" aria-labelledby="project-support-title"><div><span>ПОДДЕРЖАТЬ ПРОЕКТ</span><h2 id="project-support-title">'+esc(showcase.supportTitle||'Помогите проекту развиваться')+'</h2><p>'+esc(showcase.support)+'</p></div><a class="project-support" href="/support/">Поддержать проект <span aria-hidden="true">→</span></a></section>':'';
    const showcaseBody=showcase?(showcase.body||[showcase.description]).filter(Boolean).map(paragraph=>'<p>'+esc(paragraph)+'</p>').join(''):'';
    const showcasePage=showcase?'<main class="heritage-project"><section class="heritage-banner"><div class="section-shell"><p class="breadcrumbs"><a href="/">Главная</a> — <a href="/projects/">Проекты</a></p><h1 class="heritage-title-sr">'+esc(showcase.title)+' — '+esc(showcase.slogan)+'</h1><figure class="project-detail__cover"><img src="/assets/projects/'+coverFile(project)+'" alt="'+esc(showcase.title)+'" width="1672" height="939" decoding="async"></figure>'+showcaseActions+'</div></section><section class="heritage-story"><div class="section-shell"><header><span>О ПРОЕКТЕ</span><h2>'+esc(showcase.slogan)+'</h2></header><article><div class="heritage-story__lead"><p>'+esc(showcase.intro)+'</p></div><div class="heritage-story__columns">'+showcaseBody+'<p><strong>'+esc(showcase.accent)+'</strong></p></div></article>'+projectForm+showcaseSupport+'</div></section></main>':'';
    const detail=head(showcase?.title||project.title)+header+(heritage?special:(showcase?showcasePage:standard))+footer+pageEnd(hasProjectForm);
    write(path.join(dist,'projects',project.slug,'index.html'),detail);
  }
});
