const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');if(menuButton&&mobileNav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));mobileNav.classList.toggle('open',!open)});mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));}

const homepageRegions=[
  {name:'город Санкт-Петербург',x:16,y:31},{name:'Ленинградская область',x:14.8,y:29.5},{name:'Республика Карелия',x:20,y:23},{name:'Архангельская область',x:29,y:23},{name:'Республика Коми',x:38,y:29},{name:'Вологодская область',x:25,y:35},
  {name:'Тверская область',x:21.5,y:42},{name:'Смоленская область',x:15.5,y:47},{name:'Брянская область',x:15.8,y:54},{name:'город Москва',x:23.3,y:48},{name:'Московская область',x:22.5,y:50},{name:'Калужская область',x:20.2,y:52},
  {name:'Орловская область',x:19.3,y:56},{name:'Курская область',x:18.2,y:59},{name:'Владимирская область',x:26,y:49},{name:'Ивановская область',x:27.4,y:45},{name:'Костромская область',x:29.5,y:42},{name:'Ярославская область',x:27.3,y:39.5},
  {name:'Рязанская область',x:27.3,y:53},{name:'Липецкая область',x:25.8,y:57.5},{name:'Воронежская область',x:24.8,y:61},{name:'город Донецк',x:20.5,y:66.5},{name:'город Мариуполь',x:19,y:69},{name:'Республика Крым',x:14.5,y:73},
  {name:'Севастополь',x:12.5,y:74.5},{name:'Краснодарский край',x:18.5,y:72},{name:'Ростовская область',x:22.5,y:67},{name:'город Кисловодск',x:23.2,y:75.5},{name:'город Пятигорск',x:24.3,y:74},{name:'Республика Северная Осетия-Алания',x:25.5,y:76.2},
  {name:'Республика Дагестан',x:29.2,y:76},{name:'Волгоградская область',x:31.5,y:64},{name:'Астрахань',x:35.5,y:70},{name:'Нижегородская область',x:32.3,y:49},{name:'город Дзержинск',x:31.5,y:51},{name:'Республика Марий Эл',x:34.2,y:47},
  {name:'Республика Мордовия',x:30.5,y:55},{name:'Пензенская область',x:32.5,y:58},{name:'Ульяновская область',x:36,y:55},{name:'Республика Татарстан',x:38.2,y:50},{name:'Самарская область',x:39,y:58},{name:'Саратовская область',x:35,y:62},
  {name:'Оренбургская область',x:43,y:63},{name:'Удмуртская Республика',x:40,y:45},{name:'Пермский край',x:43.5,y:40},{name:'Свердловская область',x:49,y:43},{name:'Тюменская область',x:54,y:45},{name:'Омская область',x:58.5,y:52},
  {name:'Новосибирская область',x:64,y:57},{name:'Томская область',x:66,y:49},{name:'Республика Хакасия',x:71,y:63},{name:'Иркутская область',x:75,y:58},{name:'Еврейская автономная область',x:87,y:55},{name:'Приморский край',x:91.5,y:66}
];
function initHomepageRegionMarkers(){const layer=document.querySelector('#heroRegionMarkers');if(!layer)return;layer.innerHTML=homepageRegions.map(region=>`<a class="hero-region-marker" href="/regions/" aria-label="${region.name} — открыть раздел регионов" style="--x:${region.x}%;--y:${region.y}%"><span class="hero-region-marker__label">${region.name}</span></a>`).join('')}
initHomepageRegionMarkers();

function initHomepageHero(){
  const hero=document.querySelector('#homeHero');
  if(!hero||!window.FenkaHero)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame=0;
  const introStart=performance.now();
  let userTookControl=false;
  function render(now){
    const rect=hero.getBoundingClientRect();
    const scrollProgress=-rect.top/Math.max(1,rect.height-innerHeight);
    const introProgress=Math.min(1,(now-introStart)/3600);
    const progress=userTookControl?scrollProgress:Math.max(scrollProgress,introProgress*.34);
    hero.dataset.scene=window.FenkaHero.getHeroScene(progress,reduced);
    hero.style.setProperty('--hero-progress',window.FenkaHero.clampProgress(progress));
    frame=0;
    if(!reduced&&!userTookControl&&introProgress<1)frame=requestAnimationFrame(render);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(render)}
  addEventListener('scroll',()=>{userTookControl=true;schedule()},{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('pagehide',()=>{if(frame)cancelAnimationFrame(frame)},{once:true});
  schedule();
}
initHomepageHero();
