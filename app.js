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
const homepageMobileCoordinates={"Брянская область":[15.14,42.30],"Владимирская область":[20.24,44.67],"Воронежская область":[15.66,49.82],"Ивановская область":[21.25,43.93],"Калужская область":[17.09,42.70],"Костромская область":[21.94,42.76],"Курская область":[14.42,46.35],"Липецкая область":[16.70,48.92],"Московская область":[18.74,42.04],"город Москва":[18.79,42.43],"Орловская область":[15.55,44.55],"Рязанская область":[18.59,46.16],"Смоленская область":[15.79,37.78],"Тверская область":[19.20,39.20],"Ярославская область":[21.41,42.00],"Архангельская область":[27.95,32.47],"Вологодская область":[22.86,39.69],"Республика Карелия":[23.45,31.23],"Республика Коми":[29.19,44.62],"Ленинградская область":[19.98,30.04],"город Санкт-Петербург":[20.41,29.79],"Астрахань":[15.59,67.76],"Волгоградская область":[15.60,60.10],"Краснодарский край":[9.53,58.85],"Республика Крым":[7.07,52.50],"Ростовская область":[11.88,56.70],"Севастополь":[6.47,52.15],"город Донецк":[11.65,53.29],"город Мариуполь":[10.70,54.21],"Республика Дагестан":[12.57,72.54],"город Кисловодск":[10.53,65.23],"город Пятигорск":[10.84,65.45],"Республика Северная Осетия-Алания":[10.92,69.00],"Саратовская область":[18.76,57.31],"Нижегородская область":[21.91,47.79],"город Дзержинск":[21.60,47.42],"Оренбургская область":[23.76,65.49],"Пензенская область":[19.68,53.65],"Пермский край":[28.83,55.04],"Республика Марий Эл":[23.87,50.80],"Республика Мордовия":[20.59,52.27],"Республика Татарстан":[23.76,53.24],"Самарская область":[22.16,58.51],"Удмуртская Республика":[26.51,54.83],"Ульяновская область":[22.21,55.09],"Свердловская область":[30.22,60.31],"Тюменская область":[33.03,62.86],"Республика Хакасия":[47.69,80.62],"Иркутская область":[56.52,84.44],"Новосибирская область":[42.39,75.53],"Омская область":[36.42,71.67],"Томская область":[44.08,72.88],"Еврейская автономная область":[77.73,80.70],"Приморский край":[80.00,92.82]};
function initHomepageRegionMarkers(){const layer=document.querySelector('#heroRegionMarkers');if(!layer)return;layer.innerHTML=homepageRegions.map(region=>{const [mx,my]=homepageMobileCoordinates[region.name]||[region.x,region.y];return `<a class="hero-region-marker" href="/regions/" aria-label="${region.name} — открыть раздел регионов" style="--x:${region.x}%;--y:${region.y}%;--mx:${mx}%;--my:${my}%"><span class="hero-region-marker__label">${region.name}</span></a>`}).join('')}
initHomepageRegionMarkers();

function initHomepageNetwork(){const network=document.querySelector('#heroNetwork');if(!network)return;const mobile=matchMedia('(max-width: 720px)').matches;const point=region=>{const [mx,my]=homepageMobileCoordinates[region.name]||[region.x,region.y];return mobile?{x:mx,y:my}:region};const connections=[[0,9],[9,14],[9,20],[20,26],[14,33],[33,39],[39,45],[45,47],[47,48],[48,49],[49,51],[51,52],[52,53],[26,30],[30,32],[32,41],[41,42],[42,45],[3,4],[4,45],[39,42],[45,49]];network.innerHTML=connections.map(([from,to],index)=>{const a=point(homepageRegions[from]),b=point(homepageRegions[to]),curve=Math.max(2,Math.abs(b.x-a.x)*.13),cx=(a.x+b.x)/2,cy=Math.min(a.y,b.y)-curve,id=`hero-route-${index}`;return `<g class="hero-network__connection" style="--delay:${(index%8)*.34}s"><path id="${id}" pathLength="1" class="hero-network__line hero-network__line--glow" d="M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}"/><path pathLength="1" class="hero-network__line hero-network__line--core" d="M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}"/><circle class="hero-network__pulse" r=".32"><animateMotion dur="${5.2+(index%5)*.45}s" begin="${(index%7)*-.7}s" repeatCount="indefinite"><mpath href="#${id}"/></animateMotion></circle></g>`}).join('')}
initHomepageNetwork();
matchMedia('(max-width: 720px)').addEventListener('change',initHomepageNetwork);

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
