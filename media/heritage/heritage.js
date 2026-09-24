function normalizeQuery(value){return String(value||'').trim().toLocaleLowerCase('ru')}
function matchesQuery(item,query){if(!query)return true;return normalizeQuery([item.title,item.description,item.location].filter(Boolean).join(' ')).includes(query)}
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node}
function assetPath(relative){return '/media/heritage/'+String(relative||'').replace(/^\/+/, '')}

function mediaCard(item,label){
  const button=element('button','heritage-card');button.type='button';button.dataset.videoId=String(item.id);button.setAttribute('aria-label','Смотреть: '+item.title);
  const imageWrap=element('span','heritage-card__image');const fallback=element('span','heritage-card__fallback','ФЕНКА');fallback.dataset.imageFallback='';fallback.setAttribute('aria-hidden','true');imageWrap.append(fallback);
  if(item.thumbnail){const image=document.createElement('img');image.src=assetPath(item.thumbnail);image.alt='Обложка: '+item.title;image.loading='lazy';image.decoding='async';imageWrap.append(image)}
  const body=element('span','heritage-card__body');body.append(element('small','',label),element('strong','',item.title));button.append(imageWrap,body);return button
}
function photoCard(item){
  const button=element('button','heritage-card heritage-photo-card');button.type='button';button.dataset.photoId=String(item.id);button.setAttribute('aria-label','Открыть фотографию: '+item.title);
  const imageWrap=element('span','heritage-card__image');const fallback=element('span','heritage-card__fallback','ФЕНКА');fallback.dataset.imageFallback='';fallback.setAttribute('aria-hidden','true');imageWrap.append(fallback);
  if(item.photo){const image=document.createElement('img');image.src=assetPath(item.photo);image.alt=item.title;image.loading='lazy';image.decoding='async';imageWrap.append(image)}
  const body=element('span','heritage-card__body');body.append(element('small','',item.location||'Архитектура'),element('strong','',item.title));button.append(imageWrap,body);return button
}
function renderList(container,items,createCard,emptyText){container.replaceChildren();if(!items.length){container.append(element('p','heritage-empty',emptyText));return}for(const item of items)container.append(createCard(item))}
function getVideos(){return typeof videos==='undefined'?[]:videos}
function getSynagogues(){return typeof sinagogi==='undefined'?[]:sinagogi}
function renderCollections(root,state){
  const query=state.query;const allVideos=getVideos();
  const people=allVideos.filter(item=>item.category==='evrei'&&matchesQuery(item,query));
  const stories=allVideos.filter(item=>item.category==='istorii'&&Number(item.season)===state.season&&matchesQuery(item,query));
  const synagogues=getSynagogues().filter(item=>matchesQuery(item,query));
  renderList(root.querySelector('#evreiGrid'),people,item=>mediaCard(item,'Личности'),'В этой коллекции пока нет материалов.');
  renderList(root.querySelector('#istoriiGrid'),stories,item=>mediaCard(item,'Наследие · сезон '+item.season),'В этом сезоне пока нет материалов.');
  renderList(root.querySelector('#sinagogiGrid'),synagogues,photoCard,'Фотографии скоро появятся.');
  const noResults=root.querySelector('.heritage-no-results');noResults.hidden=!query||people.length+stories.length+synagogues.length>0;
}
function showDialog(root,dialog,state,trigger){state.lastTrigger=trigger;root.querySelector('[data-dialog-backdrop]').hidden=false;dialog.hidden=false;document.body.style.overflow='hidden';dialog.querySelector('[data-dialog-close]').focus()}
function hideDialog(root,dialog,state){if(!dialog||dialog.hidden)return;dialog.hidden=true;root.querySelector('[data-dialog-backdrop]').hidden=true;document.body.style.overflow='';state.lastTrigger?.focus();state.lastTrigger=null}
function openVideoModal(item,root,state,trigger){
  const dialog=root.querySelector('[data-video-dialog]'),player=dialog.querySelector('[data-video-player]');player.replaceChildren();
  if(item.vkEmbed){const frame=document.createElement('iframe');frame.src=item.vkEmbed;frame.title=item.title;frame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;player.append(frame)}
  else if(item.file){const video=document.createElement('video');video.controls=true;video.src=item.file;player.append(video)}
  else player.append(element('p','heritage-player-error','Видео временно недоступно.'));
  dialog.querySelector('[data-video-title]').textContent=item.title;dialog.querySelector('[data-video-description]').textContent=item.description||'';showDialog(root,dialog,state,trigger)
}
function closeVideoModal(root,state){const dialog=root.querySelector('[data-video-dialog]');dialog.querySelector('[data-video-player]').replaceChildren();hideDialog(root,dialog,state)}
function openPhotoModal(item,root,state,trigger){
  const dialog=root.querySelector('[data-photo-dialog]'),image=dialog.querySelector('[data-photo-image]');image.src=assetPath(item.photo);image.alt=item.title;dialog.querySelector('[data-photo-title]').textContent=item.title;dialog.querySelector('[data-photo-location]').textContent=item.location||'';dialog.querySelector('[data-photo-description]').textContent=item.description||'';showDialog(root,dialog,state,trigger)
}
function closePhotoModal(root,state){hideDialog(root,root.querySelector('[data-photo-dialog]'),state)}
function closeActiveHeritageDialog(root,state){closeVideoModal(root,state);closePhotoModal(root,state)}
function handleHeritageClick(event,root,state){
  const videoTrigger=event.target.closest('[data-video-id]');if(videoTrigger){const item=getVideos().find(record=>String(record.id)===videoTrigger.dataset.videoId);if(item)openVideoModal(item,root,state,videoTrigger);return}
  const photoTrigger=event.target.closest('[data-photo-id]');if(photoTrigger){const item=getSynagogues().find(record=>String(record.id)===photoTrigger.dataset.photoId);if(item)openPhotoModal(item,root,state,photoTrigger);return}
  if(event.target.closest('[data-dialog-close]')||event.target.matches('[data-dialog-backdrop]'))closeActiveHeritageDialog(root,state);
  const season=event.target.closest('[data-season]');if(season){root.querySelectorAll('[data-season]').forEach(button=>button.classList.remove('is-active'));season.classList.add('is-active');state.season=Number(season.dataset.season);renderCollections(root,state)}
}
function handleImageError(event){if(event.target.tagName!=='IMG')return;event.target.hidden=true;event.target.parentElement?.querySelector('[data-image-fallback]')?.removeAttribute('aria-hidden')}
function initHeritageLibrary(root=document){
  const page=root.querySelector('.heritage-page');if(!page)return;const state={query:'',season:1,lastTrigger:null};const search=page.querySelector('[data-heritage-search]');search.addEventListener('input',()=>{state.query=normalizeQuery(search.value);renderCollections(page,state)});page.addEventListener('click',event=>handleHeritageClick(event,page,state));page.addEventListener('error',event=>handleImageError(event),true);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeActiveHeritageDialog(page,state)});renderCollections(page,state)
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>initHeritageLibrary());else initHeritageLibrary();
