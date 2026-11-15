const test=require('node:test');
const assert=require('node:assert/strict');
const {buildMailto}=require('../mail-forms.js');

test('buildMailto sends every supplied field to the requested FENKA mailbox',()=>{
  const href=buildMailto({
    recipient:'info@fenkar.ru',
    subject:'Подписка на новости ФЕНКА',
    fields:[['Имя','Анна'],['Электронная почта','anna@example.ru']]
  });
  const [address,query]=href.split('?');
  const params=new URLSearchParams(query);
  assert.equal(address,'mailto:info@fenkar.ru');
  assert.equal(params.get('subject'),'Подписка на новости ФЕНКА');
  assert.equal(params.get('body'),'Имя: Анна\nЭлектронная почта: anna@example.ru');
});

test('buildMailto rejects a non-FENKA recipient',()=>{
  assert.throws(()=>buildMailto({recipient:'other@example.com',subject:'Тест',fields:[]}),/info@fenkar\.ru/);
});
