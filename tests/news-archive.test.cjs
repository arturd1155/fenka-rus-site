const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

test('old FENKA sitemap inventory contains 5,493 unique news from 2018 through 2026',()=>{
  const {readNewsSitemaps}=require('../scripts/news-source.cjs');
  const files=[1,2,3,4,5,6].map(n=>n===1?'news-sitemap-jina.txt':`news-sitemap${n}-jina.txt`);
  const news=readNewsSitemaps(files);
  assert.equal(news.length,5493);
  assert.equal(new Set(news.map(item=>item.url)).size,5493);
  assert.deepEqual([...new Set(news.map(item=>item.year))].sort(),[2018,2019,2020,2021,2022,2023,2024,2025,2026]);
  assert.ok(news.every(item=>item.slug&&item.date&&item.internalUrl===`/news/${item.slug}/`));
});

test('legacy page parser keeps article copy and removes old-site chrome',()=>{
  const {parseLegacyNews}=require('../scripts/import-news.cjs');
  const source=`Title: Тестовая новость - ОО ФЕНКА

Markdown Content:
[логотип](https://fenka.online/)\n# Тестовая новость\n\nПервый абзац новости.\n\n![Фото](https://fenka.online/wp-content/uploads/2024/01/photo.jpg)\n\nВторой абзац.\n\nФото: ФЕНКА\n\nПоделиться\n\n[Новости](https://fenka.online/news/)`;
  const item=parseLegacyNews(source,{slug:'test',date:'2024-01-02T10:00:00+00:00',url:'https://fenka.online/news/test/'});
  assert.equal(item.title,'Тестовая новость');
  assert.match(item.body,/Первый абзац новости/);
  assert.match(item.body,/Второй абзац/);
  assert.doesNotMatch(item.body,/Поделиться|логотип/);
  assert.equal(item.image,'https://fenka.online/wp-content/uploads/2024/01/photo.jpg');
});

test('legacy HTML parser reads title, image and article without sharing controls',()=>{
  const {parseLegacyHtml}=require('../scripts/import-news.cjs');
  const html=`<html><head><meta property="og:title" content="Культурная встреча - ОО ФЕНКА"><meta property="og:description" content="Краткое описание"><meta property="og:image" content="https://fenka.online/wp-content/uploads/photo.jpg"></head><body><div class="content"><h1>Культурная встреча</h1><p>Основной текст.</p><p>Второй абзац.</p><div class="heateor_sss_sharing_container">Поделиться</div></div></body></html>`;
  const item=parseLegacyHtml(html,{slug:'meeting',date:'2024-02-03T10:00:00+00:00',url:'https://fenka.online/news/meeting/'});
  assert.equal(item.title,'Культурная встреча');
  assert.equal(item.image,'https://fenka.online/wp-content/uploads/photo.jpg');
  assert.match(item.body,/Основной текст/);
  assert.doesNotMatch(item.body,/Поделиться/);
});

test('news build produces a readable internal catalogue and detail pages',()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
  const catalogue=fs.readFileSync('dist/news/index.html','utf8');
  const css=fs.readFileSync('dist/shared/news.css','utf8');
  assert.match(catalogue,/class="news-featured"/);
  assert.match(catalogue,/id="news-search"/);
  assert.match(catalogue,/id="news-year"/);
  assert.match(catalogue,/Показать ещё/);
  assert.doesNotMatch(catalogue,/Раздел наполняется/);
  assert.match(css,/@media\s*\(max-width:\s*640px\)/);
  assert.match(css,/object-fit:\s*cover/);
});

