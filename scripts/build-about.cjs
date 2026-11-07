const fs=require('fs');
const path=require('path');
const renderAboutContent=require('../site/about-content.cjs');

function buildAbout({root,dist,W,header,footer}){
  fs.copyFileSync(path.join(root,'shared','about.css'),path.join(dist,'shared','about.css'));
  const hero='<section class="section-hero section-hero--about"><div class="section-shell"><nav class="breadcrumbs"><a href="/">Главная</a><span>—</span><span>О ФЕНКА</span></nav><p class="section-hero__kicker">Федеральная еврейская национально-культурная автономия</p><h1>О ФЕНКА</h1><p>Люди. Культура. Развитие.</p></div></section>';
  const document='<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>О ФЕНКА — ФЕНКА</title><meta name="description" content="Миссия, цели, задачи и основные направления деятельности Федеральной еврейской национально-культурной автономии"><link rel="stylesheet" href="/shared/site-shell.css"><link rel="stylesheet" href="/shared/about.css"></head><body>'+header('about')+'<main id="main">'+hero+renderAboutContent()+'</main>'+footer()+'<script src="/shared/site-shell.js"></script></body></html>';
  W(path.join(dist,'about','index.html'),document);
}

module.exports={buildAbout};
