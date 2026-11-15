(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.FenkaMailForms=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const OFFICIAL_RECIPIENT='info@fenkar.ru';

  function buildPayload({recipient,subject,fields}){
    if(recipient!==OFFICIAL_RECIPIENT)throw new Error(`Формы ФЕНКА должны отправляться на ${OFFICIAL_RECIPIENT}`);
    const payload={
      _subject:subject||'Обращение с сайта ФЕНКА',
      _template:'table',
      _captcha:'false',
      _honey:''
    };
    for(const [label,value] of fields||[]){
      const clean=String(value??'').trim();
      if(clean)payload[label]=clean;
    }
    return payload;
  }

  async function submitToInbox(options,request){
    const payload=buildPayload(options);
    const send=request||(typeof fetch==='function'?fetch.bind(globalThis):null);
    if(!send)throw new Error('Отправка формы недоступна в этом браузере.');
    const response=await send(`https://formsubmit.co/ajax/${OFFICIAL_RECIPIENT}`,{
      method:'POST',
      headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify(payload)
    });
    let result={};
    try{result=await response.json();}catch{}
    if(!response.ok||result.success===false||result.success==='false')throw new Error('Не удалось отправить форму.');
    return result;
  }

  function bindMailForms(doc,submitter){
    if(!doc)return;
    const send=submitter||submitToInbox;
    doc.querySelectorAll('[data-mail-form]').forEach(form=>{
      form.addEventListener('submit',async event=>{
        event.preventDefault();
        if(!form.reportValidity()||form.dataset.sending==='true')return;
        const data=new FormData(form);
        const fields=[...form.elements]
          .filter(element=>element.name&&element.type!=='submit'&&(element.type!=='checkbox'||element.checked))
          .map(element=>[
            element.dataset.mailLabel||element.name,
            element.type==='checkbox'?(element.dataset.mailValue||'Подтверждено'):data.get(element.name)
          ]);
        const status=form.querySelector('[data-mail-status]');
        const button=form.querySelector('[type="submit"]');
        form.dataset.sending='true';
        form.setAttribute('aria-busy','true');
        if(button)button.disabled=true;
        if(status)status.textContent='Отправляем…';
        try{
          await send({recipient:form.dataset.mailRecipient,subject:form.dataset.mailSubject,fields});
          form.reset();
          if(status)status.textContent='Спасибо! Данные отправлены в ФЕНКА.';
        }catch{
          if(status)status.textContent='Не удалось отправить. Попробуйте ещё раз или напишите на info@fenkar.ru.';
        }finally{
          delete form.dataset.sending;
          form.removeAttribute('aria-busy');
          if(button)button.disabled=false;
        }
      });
    });
  }

  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bindMailForms(document),{once:true});
    else bindMailForms(document);
  }

  return {buildPayload,submitToInbox,bindMailForms};
});
