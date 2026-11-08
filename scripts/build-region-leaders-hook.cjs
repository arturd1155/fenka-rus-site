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
  'Ярославская область':'yaroslavl-zakharov.png'
};

function replaceRequired(source,needle,replacement){
  if(!source.includes(needle))throw new Error(`Regions portrait hook could not find: ${needle.slice(0,80)}`);
  return source.replace(needle,replacement);
}

process.nextTick(()=>{
  const sourceDir=path.join(root,'region-leaders');
  const outputDir=path.join(root,'dist','region-leaders');
  fs.mkdirSync(outputDir,{recursive:true});
  for(const file of Object.values(portraits))fs.copyFileSync(path.join(sourceDir,file),path.join(outputDir,file));

  const page=path.join(root,'dist','regions','index.html');
  let html=fs.readFileSync(page,'utf8');
  const css=`<style>
  .region-leader-photo{display:block;object-fit:cover;object-position:center 22%;background:#edf4f8;border:1px solid rgba(18,63,112,.14)}
  .region-leader-photo--small{width:58px;height:68px;border-radius:10px}
  .region-leader-photo--large{width:132px;height:156px;border-radius:12px}
  @media(max-width:600px){.leadership-preview{grid-template-columns:1fr;align-items:start}.region-leader-photo--large{width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;object-position:center;border-radius:12px}.leadership-preview h3{font-size:20px}}
  </style>`;
  html=replaceRequired(html,'</head>',css+'</head>');
  html=replaceRequired(html,'<section class="leadership-preview"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div>','<section class="leadership-preview"><div id="detailLeaderPhoto"><div class="photo-placeholder photo-placeholder--large" aria-hidden="true"><span class="photo-placeholder__mark">Ф</span></div></div>');
  html=replaceRequired(html,'<small>Фотография будет добавлена после согласования</small>','<small id="detailPhotoNote">Фотография будет добавлена после согласования</small>');
  html=replaceRequired(html,'function regionCard(r){return ',`const regionalPortraits=${JSON.stringify(portraits)};districts.forEach(d=>d.regions.forEach(r=>{if(regionalPortraits[r.name])r.localPortrait='/region-leaders/'+regionalPortraits[r.name]}));function portrait(r,size){return r.localPortrait?'<img class="region-leader-photo region-leader-photo--'+size+'" src="'+r.localPortrait+'" alt="'+(r.leader||'Руководитель '+r.name).replace(/"/g,'&quot;')+'" loading="lazy">':'<div class="photo-placeholder photo-placeholder--'+size+'"><span class="photo-placeholder__mark">Ф</span></div>'}function regionCard(r){return `);
  const smallPlaceholder='<div class="photo-placeholder photo-placeholder--small"><span class="photo-placeholder__mark">Ф</span></div><div><span>';
  html=replaceRequired(html,smallPlaceholder,"'+portrait(r,'small')+'<div><span>");
  html=replaceRequired(html,smallPlaceholder,"${portrait(r,'small')}<div><span>");
  const photoNote='<span class="region-card__photo-note">Место для фотографии</span>';
  html=replaceRequired(html,photoNote,"<span class=\"region-card__photo-note\">'+(r.localPortrait?'Фотография руководителя':'Место для фотографии')+'</span>");
  html=replaceRequired(html,photoNote,"<span class=\"region-card__photo-note\">${r.localPortrait?'Фотография руководителя':'Место для фотографии'}</span>");
  html=replaceRequired(html,"document.querySelector('#detailRole').textContent=region.role||'Руководитель регионального отделения';const fields=",`document.querySelector('#detailRole').textContent=region.role||'Руководитель регионального отделения';document.querySelector('#detailLeaderPhoto').innerHTML=portrait(region,'large');const fields=`);
  html=replaceRequired(html,"document.querySelector('#detailLeaderPhoto').innerHTML=portrait(region,'large');const fields=",`document.querySelector('#detailLeaderPhoto').innerHTML=portrait(region,'large');document.querySelector('#detailPhotoNote').textContent=region.localPortrait?'Фотография руководителя':'Фотография будет добавлена после согласования';const fields=`);
  fs.writeFileSync(page,html);
});
