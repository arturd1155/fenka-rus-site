const fs=require('fs');
const path=require('path');

const root=path.resolve(__dirname,'..');
const portraits={
  'Владимирская область':'vladimir-savelyeva.png',
  'Воронежская область':'voronezh-konishchev.png',
  'Костромская область':'kostroma-ganin.png',
  'Курская область':'kursk-diner.png',
  'Московская область':'moscow-oblast-ivanova.png',
  'город Москва':'moscow-yakushev.png',
  'Орловская область':'oryol-kamenskaya.png',
  'Рязанская область':'ryazan-reznikov.png',
  'Смоленская область':'smolensk-levant.png',
  'Ярославская область':'yaroslavl-zakharov.png',
  'Ульяновская область':'igor-dabakarov.jpg',
  'Ивановская область':'elena-yusfin.png',
  'Удмуртская Республика':'mark-goldin.png',
  'Свердловская область':'mikhail-oshtrakh.png',
  'Новосибирская область':'novosibirsk-gorbunov.jpg',
  'Омская область':'omsk-birlyant.jpg',
  'Республика Крым':'crimea-gendin.jpg',
  'город Пятигорск':'pyatigorsk-shalumova.jpg',
  'Республика Дагестан':'dagestan-pinkhasov.jpg',
  'город Кисловодск':'kislovodsk-lanovaya.jpg',
  'Краснодарский край':'krasnodar-armer.jpg',
  'Ростовская область':'rostov-potapov.jpg',
  'Республика Северная Осетия-Алания':'north-ossetia-nazarova.jpg',
  'Оренбургская область':'orenburg-suntsova.jpg',
  'Саратовская область':'saratov-streltsin.jpg',
  'Волгоградская область':'volgograd-motornaya.jpg',
  'город Дзержинск':'dzerzhinsk-nefedova.jpg',
  'Республика Марий Эл':'mari-el-basin.jpg',
  'Нижегородская область':'nizhny-novgorod-turaeva.jpg',
  'Пензенская область':'penza-zheltova.jpg',
  'Республика Мордовия':'mordovia-drobin.jpg',
  'Самарская область':'samara-kogan.jpg',
  'Республика Татарстан':'tatarstan-pliskin.jpg',
  'Астрахань':'astrakhan-kalinina.jpg',
  'город Санкт-Петербург':'st-petersburg-lvova.jpg',
  'Республика Коми':'komi-korotaev.jpg',
  'Республика Карелия':'karelia-tsvibel.jpg',
  'Вологодская область':'vologda-viktorov.jpg',
  'Тюменская область':'tyumen-varkin.jpg'
};

const corrections={
  'Брянская область':{leader:'Михаил Семенович Тительман; Черняк Ирина Иосифовна',role:'Руководство'},
  'Краснодарский край':{leader:'Армер Владимир Александрович',role:'Руководитель'},
  'Республика Дагестан':{leader:'Пинхасов Игорь Юшваевич',role:'Руководитель'},
  'город Кисловодск':{leader:'Лановая Виктория Михайловна',role:'Руководитель'},
  'Республика Северная Осетия-Алания':{leader:'Татьяна Семеновна Назарова',role:'Руководитель'},
  'Саратовская область':{leader:'Стрельцин Яков Саввич',role:'Председатель'},
  'город Дзержинск':{leader:'Нефедова Вера Александровна',role:'Руководитель'},
  'Пермский край':{leader:'Закарян Елена Викторовна',role:'Руководитель'},
  'Республика Татарстан':{leader:'Плискин Аркадий Дмитриевич',role:'Руководитель'},
  'Тюменская область':{leader:'Варкин Игорь Евгеньевич',role:'Руководитель'},
  'Воронежская область':{leader:'Виктор Дмитриевич Конищев',role:'Председатель автономии'},
  'Ярославская область':{leader:'Захаров Вячеслав Владимирович',role:'Председатель Совета'},
  'Севастополь':{leader:'Олег Владимирович Янковский',role:'Руководитель'},
  'Республика Мордовия':{leader:'Александр Иванович Дробин',role:'Президент'},
  'Республика Хакасия':{leader:'Григорий Давидович Пехотник',role:'Председатель'},
  'Иркутская область':{leader:'Игорь Эдуардович Пикерский',role:'Президент',phone:'Тел.: (3952) 20-91-22, 20-91-23'},
  'Еврейская автономная область':{leader:'Наум Беньаминович Ливант',role:'Руководитель'},
  'Приморский край':{leader:'',role:''}
};

function replaceRequired(source,needle,replacement){
  if(!source.includes(needle))throw new Error(`Regions portrait hook could not find: ${needle.slice(0,80)}`);
  return source.replace(needle,replacement);
}

process.nextTick(()=>{
  const sourceDir=path.join(root,'region-leaders');
  const outputDir=path.join(root,'dist','region-leaders');
  fs.mkdirSync(outputDir,{recursive:true});
  for(const file of Object.values(portraits)){
    const regionalSource=path.join(sourceDir,file);
    const councilSource=path.join(root,'leadership-photos',file);
    fs.copyFileSync(fs.existsSync(regionalSource)?regionalSource:councilSource,path.join(outputDir,file));
  }

  const page=path.join(root,'dist','regions','index.html');
  let html=fs.readFileSync(page,'utf8');
  const dataStart=html.indexOf('[',html.indexOf('const districts='));
  const dataEnd=html.indexOf('];',dataStart)+1;
  if(dataStart<0||dataEnd<1)throw new Error('Regions portrait hook could not locate district data');
  const districts=JSON.parse(html.slice(dataStart,dataEnd));
  for(const district of districts){
    district.regions=district.regions.filter(region=>region.name!=='Калининградская область'&&!region.name.startsWith('BANDIT4D'));
    for(const region of district.regions)if(corrections[region.name])Object.assign(region,corrections[region.name]);
  }
  html=html.slice(0,dataStart)+JSON.stringify(districts)+html.slice(dataEnd);
  html=replaceRequired(html,'<strong>54</strong><span>региональных','<strong>52</strong><span>региональных');
  const css=`<style>
  .region-leader-photo{display:block;object-fit:cover;object-position:center 22%;background:#edf4f8;border:1px solid rgba(18,63,112,.14)}
  .region-leader-photo--small{width:58px;height:68px;border-radius:10px}
  .region-leader-photo--large{width:132px;height:156px;border-radius:12px}
  @media(max-width:600px){.leadership-preview{grid-template-columns:1fr;align-items:start}.region-leader-photo--large{width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;object-position:center;border-radius:12px}.leadership-preview h3{font-size:20px}}
  </style>`;
  html=replaceRequired(html,'</head>',css+'</head>');
  html=replaceRequired(html,'<section class="leadership-preview"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div>','<section class="leadership-preview"><div id="detailLeaderPhoto"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div></div>');
  html=replaceRequired(html,'<small>Фотография будет добавлена после согласования</small>','');
  html=replaceRequired(html,'function regionCard(r){return ',`const regionalPortraits=${JSON.stringify(portraits)};districts.forEach(d=>d.regions.forEach(r=>{if(regionalPortraits[r.name])r.localPortrait='/region-leaders/'+regionalPortraits[r.name]}));function portrait(r,size){return r.localPortrait?'<img class="region-leader-photo region-leader-photo--'+size+'" src="'+r.localPortrait+'" alt="'+(r.leader||'Руководитель '+r.name).replace(/"/g,'&quot;')+'" loading="lazy">':'<div class="photo-placeholder photo-placeholder--'+size+'"><span class="photo-placeholder__mark">Ф</span></div>'}function regionCard(r){return `);
  const smallPlaceholder='<div class="photo-placeholder photo-placeholder--small"><span class="photo-placeholder__mark">Ф</span></div><div><span>';
  html=replaceRequired(html,smallPlaceholder,"'+portrait(r,'small')+'<div><span>");
  html=replaceRequired(html,smallPlaceholder,"${portrait(r,'small')}<div><span>");
  const photoNote='<span class="region-card__photo-note">Место для фотографии</span>';
  html=replaceRequired(html,photoNote,'');
  html=replaceRequired(html,photoNote,'');
  html=replaceRequired(html,"document.querySelector('#detailRole').textContent=region.role||'Руководитель регионального отделения';const fields=",`document.querySelector('#detailRole').textContent=region.role||'Руководитель регионального отделения';document.querySelector('#detailLeaderPhoto').innerHTML=portrait(region,'large');const fields=`);
  fs.writeFileSync(page,html);
});
