const fs=require('fs');
const html=fs.readFileSync('regions-interactive.html','utf8');
const zones=[...html.matchAll(/class="district-zone"/g)];
if(zones.length!==8) throw new Error(`Ожидалось 8 интерактивных округов, найдено ${zones.length}`);
if(!html.includes('function selectDistrict(')) throw new Error('Нет единого обработчика выбора округа');
if(!html.includes('data-district-zone="7"')) throw new Error('Нет всех восьми округов');
if(!html.includes('aria-live="polite" id="districtHint"')) throw new Error('Нет доступной подписи выбранного округа');
console.log('interactive map contract: OK');

if(!html.includes('.map-card,.district-hint{display:none}')) throw new Error('Постоянные плашки поверх карты не скрыты');
