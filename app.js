const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));mobileNav.classList.toggle('open',!open)});mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));

const regions={
  'Москва':{org:'Московская еврейская национально-культурная автономия',focus:'Культура, образование, молодёжные проекты'},
  'Санкт-Петербург':{org:'Санкт-Петербургская еврейская национально-культурная автономия',focus:'Культурные программы, наследие, общественные инициативы'},
  'Пермский край':{org:'Пермская региональная еврейская национально-культурная автономия',focus:'Волонтёрство, культура, социальные проекты'},
  'Республика Дагестан':{org:'Дагестанская региональная еврейская национально-культурная автономия',focus:'Образование, фестивали, сохранение наследия'},
  'Новосибирская область':{org:'Новосибирская региональная еврейская национально-культурная автономия',focus:'Культура, региональные события, молодёжь'},
  'Приморский край':{org:'Приморская региональная еврейская национально-культурная автономия',focus:'Межнациональный диалог, культура, образование'}
};
const regionName=document.getElementById('regionName');const regionOrg=document.getElementById('regionOrg');const regionFocus=document.getElementById('regionFocus');const points=document.querySelectorAll('.region-points button');function selectRegion(name){const data=regions[name];if(!data)return;regionName.textContent=name;regionOrg.textContent=data.org;regionFocus.textContent=data.focus;points.forEach(p=>p.classList.toggle('active',p.dataset.region===name));document.getElementById('regionCard').scrollIntoView({behavior:'smooth',block:'nearest'})}points.forEach(p=>p.addEventListener('click',()=>selectRegion(p.dataset.region)));

const search=document.getElementById('regionSearch');const results=document.getElementById('searchResults');search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();const found=Object.keys(regions).filter(name=>name.toLowerCase().includes(q));results.innerHTML='';if(!q||!found.length){results.classList.remove('open');return}found.forEach(name=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.addEventListener('click',()=>{search.value=name;results.classList.remove('open');selectRegion(name)});results.appendChild(b)});results.classList.add('open')});document.addEventListener('click',e=>{if(!e.target.closest('.map-search'))results.classList.remove('open')});

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
