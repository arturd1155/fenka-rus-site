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
  'Тюменская область':'tyumen-varkin.jpg',
  'Приморский край':'primorye-klebanov.jpg',
  'Еврейская автономная область':'eao-livant.jpg',
  'Томская область':'tomsk-zelvensky.jpg',
  'Пермский край':'perm-zakaryan.jpg',
  'город Донецк':'donetsk-karnaukh.jpg',
  'Севастополь':'sevastopol-yankovsky.jpg',
  'Липецкая область':'lipetsk-aseev.jpg',
  'Республика Хакасия':'khakassia-pekhotnik.png',
  'Иркутская область':'irkutsk-pikersky.png'
};
const peoplePortraitFiles=['bryansk-titelman.jpg','bryansk-chernyak.jpg'];

const corrections={
  'Брянская область':{
    leader:'Михаил Семенович Тительман',role:'Председатель Совета',
    leaders:[
      {name:'Михаил Семенович Тительман',role:'Председатель Совета',image:'/region-leaders/bryansk-titelman.jpg'},
      {name:'Черняк Ирина Иосифовна',role:'',image:'/region-leaders/bryansk-chernyak.jpg'}
    ]
  },
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
  'Ивановская область':{leader:'Юсфин Елена Леонидовна',role:'Председатель'},
  'Калужская область':{leader:'Денисов Борис Михайлович',role:'Председатель'},
  'Липецкая область':{leader:'Асеев Олег Владимирович',role:'Председатель'},
  'Тверская область':{leader:'Ротенфельд Александр Евсеевич',role:'Председатель'},
  'Архангельская область':{leader:'Лобанова Дарья Михайловна',role:'Председатель'},
  'Приморский край':{leader:'Клебанов Григорий Вениаминович',role:'Председатель'}
};

const newBranches=[
  {
    name:'город Донецк',
    organization:'Общественная организация местная национально-культурная автономия евреев города Донецка',
    registration:'26.02.2026',
    leader:'Карнаух Дмитрий Викторович',
    role:'Председатель',phone:'',email:'',image:'',description:'',source:''
  },
  {
    name:'город Мариуполь',
    organization:'Общественная организация местная национально-культурная автономия евреев города Мариуполя',
    registration:'27.02.2026',
    leader:'Головин Юрий Всеволодович',
    role:'Председатель',phone:'',email:'',image:'',description:'',source:''
  }
];

function replaceRequired(source,needle,replacement){
  if(!source.includes(needle))throw new Error(`Regions portrait hook could not find: ${needle.slice(0,80)}`);
  return source.replace(needle,replacement);
}

process.nextTick(()=>{
  const sourceDir=path.join(root,'region-leaders');
  const outputDir=path.join(root,'dist','region-leaders');
  fs.mkdirSync(outputDir,{recursive:true});
  for(const file of [...Object.values(portraits),...peoplePortraitFiles]){
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
    if(district.name==='Южный федеральный округ')for(const branch of newBranches){
      if(!district.regions.some(region=>region.name===branch.name))district.regions.push(branch);
    }
  }
  html=html.slice(0,dataStart)+JSON.stringify(districts)+html.slice(dataEnd);
  const css=`<style>
  .region-leader-photo{display:block;object-fit:cover;object-position:center 22%;background:#edf4f8;border:1px solid rgba(18,63,112,.14)}
  .region-leader-photo--small{width:58px;height:68px;border-radius:10px}
  .region-leader-photo--large{width:132px;height:156px;border-radius:12px}
  .region-card__leaders{display:grid;gap:8px;margin:14px 0 4px;padding-top:14px;border-top:1px solid var(--line)}
  .region-card__leader{display:grid;grid-template-columns:44px minmax(0,1fr);gap:10px;align-items:center;padding:8px;border-radius:10px;background:#f4f8fb}
  .region-card__leader-index{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--blue);color:#fff!important;font-size:11px!important;font-weight:800}
  .region-card__leader strong{margin:0;font-size:13px;line-height:1.25}.region-card__leader div>span{display:block;margin-top:3px;font-size:11px;color:#697f92}
  .leadership-preview.is-multiple{grid-template-columns:1fr}.leadership-preview__people{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .region-person-photo{display:block;object-fit:cover;object-position:center 18%;border:1px solid rgba(18,63,112,.12);background:#fff}.region-person-photo--small{width:44px;height:52px;border-radius:8px}.region-person-photo--large{width:100%;aspect-ratio:4/5;border-radius:10px}
  .leadership-person{min-width:0;padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff}.leadership-person__body{padding:12px 4px 4px}.leadership-person span{display:block;margin-bottom:7px;color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.08em}.leadership-person strong{display:block;color:var(--blue);font:20px/1.18 Georgia,serif}.leadership-person small{display:block;margin-top:8px;color:#61778a}
  @media(max-width:600px){.leadership-preview{grid-template-columns:1fr;align-items:start}.leadership-preview__people{grid-template-columns:1fr}.region-person-photo--large{aspect-ratio:4/5;object-position:center 18%}.region-leader-photo--large{width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;object-position:center;border-radius:12px}.leadership-preview h3{font-size:20px}}
  </style>`;
  html=replaceRequired(html,'</head>',css+'</head>');
  html=replaceRequired(html,'<section class="leadership-preview"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div>','<section class="leadership-preview"><div id="detailLeaderPhoto"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div></div>');
  html=replaceRequired(html,'<section class="leadership-preview"><div id="detailLeaderPhoto">','<section class="leadership-preview" id="detailLeadershipPreview"><div id="detailLeaderPhoto">');
  html=replaceRequired(html,'<small>Фотография будет добавлена после согласования</small>','');
  html=replaceRequired(html,'<div><div class="leadership-label">РУКОВОДСТВО</div><h3 id="detailLeader"></h3><p id="detailRole"></p></div>','<div><div class="leadership-label">РУКОВОДСТВО</div><div id="detailLeader" class="leadership-preview__people"></div></div>');
  html=replaceRequired(html,'function regionCard(r){return ',`const regionalPortraits=${JSON.stringify(portraits)};districts.forEach(d=>d.regions.forEach(r=>{if(regionalPortraits[r.name])r.localPortrait='/region-leaders/'+regionalPortraits[r.name]}));function portrait(r,size){return r.localPortrait?'<img class="region-leader-photo region-leader-photo--'+size+'" src="'+r.localPortrait+'" alt="'+(r.leader||'Руководитель '+r.name).replace(/"/g,'&quot;')+'" loading="lazy">':'<div class="photo-placeholder photo-placeholder--'+size+'"><span class="photo-placeholder__mark">Ф</span></div>'}function leadersFor(r){return Array.isArray(r.leaders)&&r.leaders.length?r.leaders:[{name:r.leader||'Данные руководителя уточняются',role:r.role||''}]}function personPortrait(p,size,index){return p.image?'<img class="region-person-photo region-person-photo--'+size+'" src="'+p.image+'" alt="'+p.name.replace(/"/g,'&quot;')+'" loading="lazy">':'<span class="region-card__leader-index">'+(index+1)+'</span>'}function regionSearchText(r){return [r.name,r.organization,...leadersFor(r).map(p=>p.name)].join(' ')}function leadershipCompact(r){if(!r.leaders)return '<div class="region-card__person">'+portrait(r,'small')+'<div><span>'+leadersFor(r)[0].name+'</span></div></div>';return '<div class="region-card__leaders" aria-label="Руководство">'+leadersFor(r).map((p,i)=>'<div class="region-card__leader">'+personPortrait(p,'small',i)+'<div><strong>'+p.name+'</strong>'+(p.role?'<span>'+p.role+'</span>':'')+'</div></div>').join('')+'</div>'}function leadershipDetail(r){return leadersFor(r).map((p,i)=>'<article class="leadership-person">'+(p.image?personPortrait(p,'large',i):'')+'<div class="leadership-person__body"><span>'+(leadersFor(r).length>1?'РУКОВОДИТЕЛЬ '+(i+1):'РУКОВОДИТЕЛЬ')+'</span><strong>'+p.name+'</strong>'+(p.role?'<small>'+p.role+'</small>':'')+'</div></article>').join('')}function regionCard(r){return `);
  const smallPlaceholder='<div class="photo-placeholder photo-placeholder--small"><span class="photo-placeholder__mark">Ф</span></div><div><span>';
  html=replaceRequired(html,smallPlaceholder,"'+portrait(r,'small')+'<div><span>");
  html=replaceRequired(html,smallPlaceholder,"${portrait(r,'small')}<div><span>");
  const photoNote='<span class="region-card__photo-note">Место для фотографии</span>';
  html=replaceRequired(html,photoNote,'');
  html=replaceRequired(html,photoNote,'');
  html=replaceRequired(html,"<div class=\"region-card__person\">'+portrait(r,'small')+'<div><span>'+(r.leader||'Данные руководителя уточняются')+'</span></div></div>","'+leadershipCompact(r)+'");
  html=replaceRequired(html,'<div class="region-card__person">${portrait(r,\'small\')}<div><span>${r.leader?r.leader:\'Данные руководителя уточняются\'}</span></div></div>','${leadershipCompact(r)}');
  html=html.replaceAll("(r.name+' '+r.organization+' '+r.leader).toLowerCase()","regionSearchText(r).toLowerCase()");
  html=replaceRequired(html,"document.querySelector('#detailLeader').textContent=region.leader||'Данные уточняются';document.querySelector('#detailRole').textContent=region.role||'Руководитель регионального отделения';const fields=",`const people=leadersFor(region);document.querySelector('#detailLeader').innerHTML=leadershipDetail(region);document.querySelector('#detailLeadershipPreview').classList.toggle('is-multiple',people.length>1);document.querySelector('#detailLeaderPhoto').hidden=people.length>1;document.querySelector('#detailLeaderPhoto').innerHTML=people.length>1?'':portrait(region,'large');const fields=`);
  fs.writeFileSync(page,html);
});
