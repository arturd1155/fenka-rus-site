const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const dist=path.join(root,'dist');
const reports=[
  ['2022','https://disk.yandex.ru/i/ZABS_y82JjFctw'],
  ['2021','https://disk.yandex.ru/i/bbUazqvc18eTxg'],
  ['2020','https://disk.yandex.ru/i/FmTywswvMQrgxQ']
];

function buildDocumentsReports(){
  const documentsPath=path.join(dist,'documents','index.html');
  let documents=fs.readFileSync(documentsPath,'utf8');
  const reportCards=reports.map(([year,href])=>'<a class="report-card" href="'+href+'" target="_blank" rel="noopener noreferrer"><span>'+year+'</span><h2>Финансовый отчёт ОО «ФЕНКА» за '+year+' год</h2><p>Официальный финансовый отчёт организации.</p><b>Открыть отчёт →</b></a>').join('');
  const reportSection='<section class="document-group document-group--reports" id="financial-reports"><h2>Финансовая отчётность</h2><div class="reports-grid">'+reportCards+'</div></section>';
  documents=documents.replace(/(<div class="section-shell document-groups">[\s\S]*?)(<\/div><\/section><\/main>)/,'$1'+reportSection+'$2');
  fs.writeFileSync(documentsPath,documents);

  const reportsPath=path.join(dist,'reports','index.html');
  fs.writeFileSync(reportsPath,'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=/documents/#financial-reports"><link rel="canonical" href="https://www.fenka-rus.ru/documents/#financial-reports"><title>Документы — ФЕНКА</title></head><body><p>Финансовая отчётность перенесена в раздел <a href="/documents/#financial-reports">«Документы»</a>.</p></body></html>');
}

process.once('beforeExit',buildDocumentsReports);
module.exports=buildDocumentsReports;
