(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.FenkaMailForms=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const OFFICIAL_RECIPIENT='info@fenkar.ru';

  function buildMailto({recipient,subject,fields}){
    if(recipient!==OFFICIAL_RECIPIENT)throw new Error(`Формы ФЕНКА должны отправляться на ${OFFICIAL_RECIPIENT}`);
    const body=(fields||[])
      .filter(([,value])=>String(value??'').trim())
      .map(([label,value])=>`${label}: ${String(value).trim()}`)
      .join('\n');
    return `mailto:${recipient}?subject=${encodeURIComponent(subject||'Обращение с сайта ФЕНКА')}&body=${encodeURIComponent(body)}`;
  }

  function bindMailForms(doc,navigate){
    if(!doc)return;
    const openMail=navigate||function(href){window.location.href=href;};
    doc.querySelectorAll('[data-mail-form]').forEach(form=>{
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if(!form.reportValidity())return;
        const data=new FormData(form);
        const fields=[...form.elements]
          .filter(element=>element.name&&element.type!=='submit'&&element.type!=='checkbox')
          .map(element=>[element.dataset.mailLabel||element.name,data.get(element.name)]);
        const href=buildMailto({recipient:form.dataset.mailRecipient,subject:form.dataset.mailSubject,fields});
        const status=form.querySelector('[data-mail-status]');
        if(status)status.textContent='Открываем почтовое приложение. Проверьте данные и нажмите «Отправить» в письме.';
        openMail(href);
      });
    });
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bindMailForms(document),{once:true});
    else bindMailForms(document);
  }

  return {buildMailto,bindMailForms};
});
