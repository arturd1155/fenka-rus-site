const test=require('node:test');
const assert=require('node:assert/strict');
const {submitToInbox,bindMailForms}=require('../mail-forms.js');
const fs=require('node:fs');

function makeBoundForm({valid=true,checked=true}={}){
  const status={textContent:'',dataset:{}};
  const button={type:'submit',name:'',disabled:false};
  const elements=[
    {name:'fullName',type:'text',value:'Анна',dataset:{mailLabel:'ФИО'}},
    {name:'consent',type:'checkbox',value:'yes',checked,dataset:{mailLabel:'Согласие на обработку данных'}},
    button
  ];
  const form={
    elements,
    dataset:{mailRecipient:'info@fenkar.ru',mailSubject:'Тестовая заявка'},
    attributes:{},
    reportValidity:()=>valid,
    reset(){},
    setAttribute(name,value){this.attributes[name]=value;},
    removeAttribute(name){delete this.attributes[name];},
    querySelector(selector){
      if(selector==='[data-mail-status]')return status;
      if(selector==='[type="submit"]')return button;
      return null;
    },
    addEventListener(type,handler){if(type==='submit')this.submitHandler=handler;}
  };
  const doc={querySelectorAll:selector=>selector==='[data-mail-form]'?[form]:[]};
  return {doc,form,status,button};
}

async function withFakeFormData(run){
  const NativeFormData=global.FormData;
  global.FormData=class{
    constructor(form){this.form=form;}
    get(name){return this.form.elements.find(element=>element.name===name)?.value??null;}
  };
  try{return await run();}finally{global.FormData=NativeFormData;}
}

test('submitToInbox posts the form to the FENKA inbox without opening mailto',async()=>{
  let request;
  const fakeFetch=async(url,options)=>{
    request={url,options};
    return {ok:true,json:async()=>({success:true,message:'The form was submitted successfully.'})};
  };

  const result=await submitToInbox({
    recipient:'info@fenkar.ru',
    subject:'Подписка на новости ФЕНКА',
    fields:[['Имя','Анна'],['Электронная почта','anna@example.ru']]
  },fakeFetch);

  assert.equal(request.url,'https://formsubmit.co/ajax/info@fenkar.ru');
  assert.equal(request.options.method,'POST');
  assert.deepEqual(request.options.headers,{
    'Content-Type':'application/json',
    Accept:'application/json'
  });
  assert.deepEqual(JSON.parse(request.options.body),{
    _subject:'Подписка на новости ФЕНКА',
    _template:'table',
    _captcha:'false',
    _honey:'',
    'Имя':'Анна',
    'Электронная почта':'anna@example.ru'
  });
  assert.equal(result.success,true);
  assert.doesNotMatch(request.url,/^mailto:/);
});

test('submitToInbox rejects a non-FENKA recipient before sending',async()=>{
  let calls=0;
  await assert.rejects(
    submitToInbox({recipient:'other@example.com',subject:'Тест',fields:[]},async()=>{calls+=1;}),
    /info@fenkar\.ru/
  );
  assert.equal(calls,0);
});

test('submitToInbox reports a rejected delivery',async()=>{
  await assert.rejects(
    submitToInbox(
      {recipient:'info@fenkar.ru',subject:'Тест',fields:[['Имя','Анна']]},
      async()=>({ok:false,json:async()=>({success:false})})
    ),
    /Не удалось отправить/
  );
});

test('published forms load the cache-busted background sender',()=>{
  assert.match(fs.readFileSync('dist/index.html','utf8'),/src="mail-forms\.js\?v=20261115-direct1"/);
  const youth=fs.readFileSync('dist/youth/index.html','utf8');
  assert.match(youth,/src="\/mail-forms\.js\?v=20261115-direct1"/);
  assert.match(youth,/src="\/shared\/youth\.js\?v=20261115-direct1"/);
});

test('bindMailForms sends checked consent as a confirmed field',async()=>{
  await withFakeFormData(async()=>{
    const {doc,form}=makeBoundForm();
    let sent;
    bindMailForms(doc,async options=>{sent=options;return {success:true};});

    await form.submitHandler({preventDefault(){}});

    assert.deepEqual(sent.fields,[
      ['ФИО','Анна'],
      ['Согласие на обработку данных','Подтверждено']
    ]);
  });
});

test('bindMailForms does not submit an invalid form',async()=>{
  await withFakeFormData(async()=>{
    const {doc,form}=makeBoundForm({valid:false,checked:false});
    let calls=0;
    bindMailForms(doc,async()=>{calls+=1;});

    await form.submitHandler({preventDefault(){}});

    assert.equal(calls,0);
  });
});

test('bindMailForms blocks a duplicate submission while the first is pending',async()=>{
  await withFakeFormData(async()=>{
    const {doc,form}=makeBoundForm();
    let calls=0;
    let release;
    const pending=new Promise(resolve=>{release=resolve;});
    bindMailForms(doc,async()=>{calls+=1;await pending;return {success:true};});

    const first=form.submitHandler({preventDefault(){}});
    await form.submitHandler({preventDefault(){}});
    assert.equal(calls,1);
    assert.equal(doc.querySelectorAll('[data-mail-form]')[0].querySelector('[data-mail-status]').dataset.state,'pending');

    release();
    await first;
  });
});

test('bindMailForms restores controls and shows inbox fallback after rejection',async()=>{
  await withFakeFormData(async()=>{
    const {doc,form,status,button}=makeBoundForm();
    bindMailForms(doc,async()=>{throw new Error('offline');});

    await form.submitHandler({preventDefault(){}});

    assert.equal(button.disabled,false);
    assert.equal(form.attributes['aria-busy'],undefined);
    assert.match(status.textContent,/info@fenkar\.ru/);
    assert.equal(status.dataset.state,'error');
  });
});

test('bindMailForms marks a delivered request as successful',async()=>{
  await withFakeFormData(async()=>{
    const {doc,form,status}=makeBoundForm();
    bindMailForms(doc,async()=>({success:true}));

    await form.submitHandler({preventDefault(){}});

    assert.equal(status.dataset.state,'success');
    assert.match(status.textContent,/Спасибо/);
  });
});
