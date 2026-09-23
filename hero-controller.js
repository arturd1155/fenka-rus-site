(function(root){
  function clampProgress(value){return Number.isFinite(value)?Math.min(1,Math.max(0,value)):0}
  function getHeroScene(progress,reducedMotion=false){
    if(reducedMotion)return'official';
    const value=clampProgress(progress);
    if(value<.34)return'network';
    if(value<.72)return'culture';
    return'official';
  }
  const api={clampProgress,getHeroScene};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  if(root)root.FenkaHero=api;
})(typeof window!=='undefined'?window:globalThis);
