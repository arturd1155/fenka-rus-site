(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.FenkaProjectForms=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function bindProjectForms(doc){
    if(!doc)return;
    doc.querySelectorAll('[data-project-interest]').forEach(link=>{
      if(link.dataset.projectFormBound==='true')return;
      link.dataset.projectFormBound='true';
      link.addEventListener('click',()=>{
        const intent=link.dataset.projectInterest;
        const interest=doc.querySelector('#project-application [name="interest"]');
        if(interest&&interest.options&&[...interest.options].some(option=>option.value===intent))interest.value=intent;
        const heading=doc.getElementById('project-application-title');
        if(heading)setTimeout(()=>heading.focus({preventScroll:true}),0);
      });
    });
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bindProjectForms(document),{once:true});
    else bindProjectForms(document);
  }

  return {bindProjectForms};
});
