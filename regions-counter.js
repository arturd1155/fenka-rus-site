(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports){
    module.exports=api;
    return;
  }
  root.FenkaRegionCounters=api;
  const start=()=>api.initRegionCounters(root.document,root);
  if(root.document.readyState==='loading')root.document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function formatCounter(value,suffix=''){
    return String(Math.max(0,Math.round(value)))+suffix;
  }

  function animateCounter(element,environment,duration=1200){
    const target=Number(element.dataset.countTo);
    if(!Number.isFinite(target))return;
    const suffix=element.dataset.countSuffix||'';
    const startedAt=environment.performance.now();
    element.textContent=formatCounter(0,suffix);
    function step(timestamp){
      const progress=Math.min(1,Math.max(0,(timestamp-startedAt)/duration));
      const eased=1-Math.pow(1-progress,3);
      element.textContent=formatCounter(target*eased,suffix);
      if(progress<1)environment.requestAnimationFrame(step);
    }
    environment.requestAnimationFrame(step);
  }

  function initRegionCounters(documentRef,environment){
    const counters=[...documentRef.querySelectorAll('[data-count-to]')];
    if(!counters.length)return;
    const reducedMotion=environment.matchMedia&&environment.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reducedMotion||typeof environment.IntersectionObserver!=='function'||typeof environment.requestAnimationFrame!=='function')return;
    counters.forEach(counter=>{counter.textContent=formatCounter(0,counter.dataset.countSuffix||'');});
    const observer=new environment.IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        observer.unobserve(entry.target);
        animateCounter(entry.target,environment);
      });
    },{threshold:.4});
    counters.forEach(counter=>observer.observe(counter));
  }

  return {formatCounter,animateCounter,initRegionCounters};
});
