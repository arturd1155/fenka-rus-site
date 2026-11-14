(()=>{
  const page=document.querySelector('.youth-landing');
  if(!page)return;

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>page.classList.add('is-ready'));

  const revealItems=[...page.querySelectorAll('.youth-reveal')];
  if(reduced||!('IntersectionObserver' in window)){
    revealItems.forEach(item=>item.classList.add('is-visible'));
  }else{
    page.classList.add('has-reveal');
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },{threshold:.12,rootMargin:'0px 0px -6%'});
    revealItems.forEach(item=>observer.observe(item));
  }

  const dialog=page.querySelector('#youthApplication');
  const form=page.querySelector('#youthApplicationForm');
  const interest=form?.elements.namedItem('interest');
  const status=page.querySelector('#youthApplicationStatus');
  let returnFocus=null;

  const openApplication=(trigger)=>{
    if(!dialog||!form)return;
    returnFocus=trigger;
    const requestedInterest=trigger.dataset.projectInterest||trigger.dataset.applicationInterest||'';
    if(requestedInterest&&interest){
      const option=[...interest.options].find(item=>item.value===requestedInterest||item.text===requestedInterest);
      if(option)interest.value=option.value;
    }
    if(typeof dialog.showModal==='function')dialog.showModal();
    else dialog.setAttribute('open','');
    requestAnimationFrame(()=>form.elements.namedItem('fullName')?.focus());
  };

  const closeApplication=()=>{
    if(!dialog)return;
    if(typeof dialog.close==='function')dialog.close();
    else dialog.removeAttribute('open');
    returnFocus?.focus();
  };

  page.querySelectorAll('[data-application-open],[data-project-interest]').forEach(trigger=>{
    trigger.addEventListener('click',()=>openApplication(trigger));
  });
  page.querySelector('[data-application-close]')?.addEventListener('click',closeApplication);
  dialog?.addEventListener('click',event=>{
    if(event.target===dialog)closeApplication();
  });

  form?.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const subject='Для Мирры Флейс — заявка в Молодёжный департамент ФЕНКА';
    const lines=[
      'Здравствуйте, Мирра Михайловна!',
      '',
      'Хочу оставить заявку на участие в Молодёжном департаменте ФЕНКА.',
      '',
      `ФИО: ${data.get('fullName')}`,
      `Город или регион: ${data.get('city')}`,
      `Контакт для связи: ${data.get('contact')}`,
      `Интерес: ${data.get('interest')}`,
      `Комментарий: ${data.get('message')||'—'}`
    ];
    if(status)status.textContent='Открываем почтовое приложение. Проверьте заявку и нажмите «Отправить» в письме.';
    window.location.href=`mailto:info@fenkar.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
})();
