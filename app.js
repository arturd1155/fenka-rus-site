const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');if(menuButton&&mobileNav){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));mobileNav.classList.toggle('open',!open)});mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{mobileNav.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));}

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
