const test=require('node:test');
const assert=require('node:assert/strict');
const {submitToInbox}=require('../mail-forms.js');
const fs=require('node:fs');

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
