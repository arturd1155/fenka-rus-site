const test=require('node:test');
const assert=require('node:assert/strict');
const {clampProgress,getHeroScene}=require('../hero-controller.js');

test('progress is clamped for overscroll and invalid values',()=>{
  assert.equal(clampProgress(-1),0);
  assert.equal(clampProgress(2),1);
  assert.equal(clampProgress(Number.NaN),0);
});

test('normal motion moves directly from the map to the official message',()=>{
  assert.equal(getHeroScene(.1,false),'network');
  assert.equal(getHeroScene(.41,false),'network');
  assert.equal(getHeroScene(.42,false),'official');
  assert.equal(getHeroScene(.5,false),'official');
  assert.equal(getHeroScene(.9,false),'official');
});

test('reduced motion always returns the readable official scene',()=>{
  assert.equal(getHeroScene(0,true),'official');
});
