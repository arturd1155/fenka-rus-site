const test=require('node:test');
const assert=require('node:assert/strict');

test('parses the latest archive feed with image, URL and publication date',()=>{
  const {parseArchiveFeed}=require('../scripts/sync-latest-news.cjs');
  const source=`Title: Архив Новости - ОО ФЕНКА

Markdown Content:
[![Image 1](https://fenka.online/wp-content/uploads/2026/11/10-4--300x225.jpg)](https://fenka.online/news/sinagogi-mira/)

13 Ноября 2026

[![Image 2](https://fenka.online/wp-content/uploads/2026/11/8-8--300x225.jpg)](https://fenka.online/news/otkrytyj-vizit/)

13 Ноября 2026`;
  assert.deepEqual(parseArchiveFeed(source),[
    {
      url:'https://fenka.online/news/sinagogi-mira/',
      slug:'sinagogi-mira',
      date:'2026-11-13T12:00:00+00:00',
      year:2026,
      internalUrl:'/news/sinagogi-mira/',
      image:'https://fenka.online/wp-content/uploads/2026/11/10-4-.jpg'
    },
    {
      url:'https://fenka.online/news/otkrytyj-vizit/',
      slug:'otkrytyj-vizit',
      date:'2026-11-13T11:59:59+00:00',
      year:2026,
      internalUrl:'/news/otkrytyj-vizit/',
      image:'https://fenka.online/wp-content/uploads/2026/11/8-8-.jpg'
    }
  ]);
});

test('parses a news link without a card image and rejects unsafe slugs',()=>{
  const {parseArchiveFeed}=require('../scripts/sync-latest-news.cjs');
  const withoutImage=`[Новая публикация](https://fenka.online/news/novaya-publikatsiya/)\n\n14 Ноября 2026`;
  assert.deepEqual(parseArchiveFeed(withoutImage),[{
    url:'https://fenka.online/news/novaya-publikatsiya/',
    slug:'novaya-publikatsiya',
    date:'2026-11-14T12:00:00+00:00',
    year:2026,
    internalUrl:'/news/novaya-publikatsiya/'
  }]);
  assert.throws(()=>parseArchiveFeed('[x](https://fenka.online/news/..\\escape/)\n\n14 Ноября 2026'),/unsafe news slug/i);
});

test('assigns every legacy image a deterministic local WebP path and proxy URL',()=>{
  const {localPathFor,proxyUrlFor,wordpressCdnUrlFor}=require('../scripts/localize-news-images.cjs');
  const source='https://fenka.online/wp-content/uploads/2026/11/10-4-.jpg';
  const local=localPathFor(source);
  assert.match(local,/^\/news-images\/2026\/[a-f0-9]{20}\.webp$/);
  assert.equal(localPathFor(source),local);
  const proxy=new URL(proxyUrlFor(source));
  assert.equal(proxy.hostname,'images.weserv.nl');
  assert.equal(proxy.searchParams.get('url'),source);
  assert.equal(proxy.searchParams.get('output'),'webp');
  assert.equal(proxy.searchParams.get('w'),'1200');
  const cdn=new URL(wordpressCdnUrlFor(source));
  assert.equal(cdn.hostname,'i0.wp.com');
  assert.equal(cdn.pathname,'/fenka.online/wp-content/uploads/2026/11/10-4-.jpg');
  assert.equal(cdn.searchParams.get('w'),'1200');
  const thumbnail=wordpressCdnUrlFor('https://fenka.online/wp-content/uploads/2026/11/10-4--300x225.jpg',{preserveSize:true});
  assert.match(new URL(thumbnail).pathname,/-300x225\.jpg$/);
});

test('renders the four newest homepage news cards with real images and detail links',()=>{
  const {renderHomepageNews}=require('../site/homepage-news.cjs');
  const items=Array.from({length:5},(_,index)=>({
    title:`Новость ${index+1}`,
    date:`2026-11-${String(13-index).padStart(2,'0')}T12:00:00+00:00`,
    internalUrl:`/news/news-${index+1}/`,
    image:`/news-images/2026/image-${index+1}.webp`
  }));
  const html=renderHomepageNews(items);
  assert.equal((html.match(/class="home-news-entry(?: |")/g)||[]).length,4);
  assert.equal((html.match(/<img class="home-news-entry__image"/g)||[]).length,4);
  assert.match(html,/href="\/news\/news-1\/"/);
  assert.match(html,/src="\/news-images\/2026\/image-1\.webp"/);
  assert.doesNotMatch(html,/Новость 5/);
  assert.match(html,/loading="lazy"/);
});

test('uses a local branded fallback when a legacy source image is gone',()=>{
  const {localizeItemImages}=require('../scripts/localize-news-images.cjs');
  const remote='https://fenka.online/wp-content/uploads/2022/01/missing.jpg';
  assert.deepEqual(localizeItemImages({image:remote,images:[remote]},{}),{
    image:'/news-images/fallback.svg',
    images:['/news-images/fallback.svg']
  });
});

test('repeat migration validates manifest files and retries prior failures',()=>{
  const {collectImageSources}=require('../scripts/localize-news-images.cjs');
  const manifest={'https://fenka.online/wp-content/uploads/2024/01/a.jpg':'/news-images/2024/a.webp'};
  const failures=[{source:'https://fenka.online/wp-content/uploads/2022/01/missing.jpg',error:'404'}];
  const sources=collectImageSources([],manifest,failures);
  assert.deepEqual(sources.map(item=>item.canonical),Object.keys(manifest).concat(failures[0].source));
});
