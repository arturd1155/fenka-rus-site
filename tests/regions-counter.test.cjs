const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('regions publish four animated counters with final fallback values',()=>{
  const html=fs.readFileSync('regions-interactive.html','utf8');
  const counters=[...html.matchAll(/<strong data-count-to="(\d+)"(?: data-count-suffix="([^"]*)")?>([^<]+)<\/strong>/g)];
  assert.deepEqual(counters.map(match=>[match[1],match[2]||'',match[3]]),[
    ['54','','54'],
    ['8','','8'],
    ['1000','+','1000+'],
    ['1','','1']
  ]);
  assert.match(html,/src="\/regions-counter\.js"/);
});

test('region counter reaches its target and respects reduced motion',()=>{
  assert.equal(fs.existsSync('regions-counter.js'),true,'regions-counter.js must exist');
  const {animateCounter,initRegionCounters}=require('../regions-counter.js');
  const frames=[];
  const element={dataset:{countTo:'54',countSuffix:''},textContent:'54'};
  animateCounter(element,{performance:{now:()=>0},requestAnimationFrame:callback=>frames.push(callback)},1000);
  assert.equal(element.textContent,'0');
  frames.shift()(500);
  assert.equal(element.textContent,'47');
  frames.shift()(1000);
  assert.equal(element.textContent,'54');

  let observerCreated=false;
  const reducedElement={dataset:{countTo:'8',countSuffix:''},textContent:'8'};
  initRegionCounters({querySelectorAll:()=>[reducedElement]}, {
    matchMedia:()=>({matches:true}),
    IntersectionObserver:function(){observerCreated=true;}
  });
  assert.equal(reducedElement.textContent,'8');
  assert.equal(observerCreated,false);
});
