function renderMediaLanding(){
  return `<section class="media-landing"><div class="section-shell">
    <p class="media-landing__eyebrow">Культурный архив</p>
    <div class="media-landing__intro"><div><h2>Медиатека ФЕНКА</h2><p>Видео, фотографии и образовательные материалы о еврейской истории, культуре и людях.</p></div><span>01 / цифровое наследие</span></div>
    <a class="media-feature" href="/media/heritage/">
      <span class="media-feature__image"><img src="/media/heritage/thumbnails/nasledie-cover.jpg" alt="Наследие ФЕНКА"></span>
      <span class="media-feature__copy"><small>Онлайн-медиабиблиотека</small><strong>Наследие ФЕНКА</strong><span>История. Культура. Традиции. Биографии выдающихся людей, документальные циклы и архитектурное наследие общин.</span><b>Открыть медиабиблиотеку →</b></span>
    </a>
    <div class="media-directions" aria-label="Будущие направления медиатеки"><article><span>02</span><h3>Фотографии</h3><p>Архив событий и региональных инициатив.</p></article><article><span>03</span><h3>Подкасты</h3><p>Разговоры об истории, культуре и современности.</p></article><article><span>04</span><h3>Архив мероприятий</h3><p>Записи встреч, конференций и образовательных программ.</p></article></div>
  </div></section>`;
}

function renderHeritageBody(){
  return `<main id="main" class="heritage-page">
    <div class="heritage-shell"><nav class="heritage-breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>→</span><a href="/media/">Медиатека</a><span>→</span><span>Наследие ФЕНКА</span></nav></div>
    <section class="heritage-hero" aria-labelledby="heritage-title"><div class="heritage-shell heritage-hero__grid"><div><p class="heritage-kicker">Онлайн-медиабиблиотека</p><h1 id="heritage-title">История.<br><em>Культура.</em><br>Традиции.</h1><p>Образовательная медиатека об истории, традициях, культуре, выдающихся евреях и наследии общин.</p><div class="heritage-actions"><a href="#evrei">Смотреть материалы</a><a href="/media/">Вернуться в медиатеку</a></div></div><div class="heritage-hero__mosaic" aria-hidden="true"><img src="/media/heritage/thumbnails/evrei-cover.jpg" alt=""><img src="/media/heritage/thumbnails/nasledie-cover.jpg" alt=""><img src="/media/heritage/thumbnails/sinagogi-cover.jpg" alt=""></div></div></section>
    <nav class="heritage-collections heritage-shell" aria-label="Коллекции библиотеки"><a href="#evrei">Евреи, изменившие мир</a><a href="#istorii">Наследие</a><a href="#sinagogi">Синагоги мира</a><a href="#heritage-about">О проекте</a></nav>
    <section class="heritage-search heritage-shell" aria-labelledby="heritage-search-title"><div><p class="heritage-kicker">Поиск по архиву</p><h2 id="heritage-search-title">Найти материал</h2></div><label><span class="sr-only">Поиск по медиабиблиотеке</span><input data-heritage-search type="search" placeholder="Введите имя или название…"></label><p class="heritage-no-results" hidden>Материалы не найдены</p></section>
    <section class="heritage-row heritage-shell" id="evrei"><header><div><p class="heritage-kicker">Личности</p><h2>Евреи, изменившие мир</h2></div><p>Биографии людей, оставивших заметный след в истории и культуре.</p></header><div class="heritage-track" id="evreiGrid"></div></section>
    <section class="heritage-row heritage-shell" id="istorii"><header><div><p class="heritage-kicker">Документальный цикл</p><h2>Наследие. Великие истории человечества</h2></div><div class="heritage-seasons"><button type="button" class="is-active" data-season="1">Сезон 1 · Моисей</button></div></header><div class="heritage-track" id="istoriiGrid"></div></section>
    <section class="heritage-row heritage-shell" id="sinagogi"><header><div><p class="heritage-kicker">Архитектура</p><h2>Синагоги мира</h2></div><p>История еврейских общин, рассказанная через знаковые здания.</p></header><div class="heritage-track heritage-track--photos" id="sinagogiGrid"></div></section>
    <section class="heritage-about heritage-shell" id="heritage-about"><p class="heritage-kicker">О проекте</p><h2>Сохраняем память.<br>Передаём дальше.</h2><p>«Наследие ФЕНКА» — образовательная медиабиблиотека, созданная для сохранения и передачи еврейского культурного наследия.</p></section>
    <div class="heritage-dialog" data-video-dialog role="dialog" aria-modal="true" aria-labelledby="videoModalTitle" hidden><button type="button" data-dialog-close aria-label="Закрыть окно">×</button><div class="heritage-dialog__player" data-video-player></div><div><h2 id="videoModalTitle" data-video-title></h2><p data-video-description></p></div></div>
    <div class="heritage-dialog" data-photo-dialog role="dialog" aria-modal="true" aria-labelledby="photoModalTitle" hidden><button type="button" data-dialog-close aria-label="Закрыть окно">×</button><img data-photo-image alt=""><div><h2 id="photoModalTitle" data-photo-title></h2><p data-photo-location></p><p data-photo-description></p></div></div>
    <div class="heritage-dialog-backdrop" data-dialog-backdrop hidden></div>
  </main>`;
}

function pageDocument({title,header,body,footer,heritage=false}){
  return '<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — ФЕНКА</title><link rel="stylesheet" href="/shared/site-shell.css">'+(heritage?'<link rel="stylesheet" href="/media/heritage/heritage.css">':'')+'</head><body>'+header+body+footer+'<script src="/shared/site-shell.js"></script>'+(heritage?'<script defer src="/media/heritage/data/videos.js"></script><script defer src="/media/heritage/data/sinagogi.js"></script><script defer src="/media/heritage/heritage.js"></script>':'')+'</body></html>';
}

module.exports={renderMediaLanding,renderHeritageBody,pageDocument};
