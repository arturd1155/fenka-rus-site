const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('heritage source data and thumbnails are present locally',()=>{
  for(const file of ['site/heritage/data/videos.js','site/heritage/data/sinagogi.js']){
    assert.equal(fs.existsSync(file),true,`${file} must exist`);
  }
  const videos=fs.readFileSync('site/heritage/data/videos.js','utf8');
  const synagogues=fs.readFileSync('site/heritage/data/sinagogi.js','utf8');
  assert.match(videos,/const videos\s*=\s*\[/);
  assert.match(videos,/vkEmbed/);
  assert.match(synagogues,/const sinagogi\s*=\s*\[/);
  assert.equal(fs.existsSync('site/heritage/thumbnails/evrei-cover.jpg'),true);
  assert.equal(fs.existsSync('site/heritage/thumbnails/nasledie-cover.jpg'),true);
  assert.equal(fs.existsSync('site/heritage/thumbnails/sinagogi-cover.jpg'),true);
});
