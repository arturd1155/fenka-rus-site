const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');

function copyMailForms(){
  fs.copyFileSync(path.join(root,'mail-forms.js'),path.join(root,'dist','mail-forms.js'));
}

process.once('beforeExit',copyMailForms);
module.exports=copyMailForms;
