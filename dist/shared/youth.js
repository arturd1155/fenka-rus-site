(()=>{
  const page=document.querySelector('.youth-landing');
  if(!page)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>page.classList.add('is-ready'));
  const items=[...page.querySelectorAll('.youth-reveal')];
  if(reduced||!('IntersectionObserver' in window)){
    items.forEach(item=>item.classList.add('is-visible'));
    return;
  }
  page.classList.add('has-reveal');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.14,rootMargin:'0px 0px -8%'});
  items.forEach(item=>observer.observe(item));
})();
