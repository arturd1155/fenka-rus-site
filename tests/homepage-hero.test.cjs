const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');

test('hero exposes the agreed narrative and one primary action',()=>{
  assert.match(html,/id="homeHero"/);
  assert.match(html,/id="heroMap"/);
  assert.match(html,/id="heroCollage"/);
  assert.match(html,/id="heroStatement"/);
  assert.match(html,/ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство\./);
  assert.equal((html.match(/class="[^"]*hero-primary[^"]*"/g)||[]).length,1);
  assert.match(html,/href="#aboutFenka"[^>]*>\s*Узнать о ФЕНКА/);
});

test('hero has a usable no-script and screen-reader structure',()=>{
  assert.match(html,/id="heroMap"[^>]*aria-hidden="true"/);
  assert.match(html,/<noscript>[\s\S]*ФЕНКА объединяет/);
  assert.match(html,/id="aboutFenka"/);
});
