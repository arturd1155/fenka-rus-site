const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

let bindProjectForms;
try{({bindProjectForms}=require('../shared/project-forms.js'));}catch{}

function makeDocument({interest='Подать заявку',options=['Узнать о программе','Подать заявку']}={}){
  const select={
    value:'Узнать о программе',
    disabled:false,
    options:options.map(value=>({value}))
  };
  const heading={focusCalls:[],focus(options){this.focusCalls.push(options);}};
  const link={
    dataset:{projectInterest:interest},
    handlers:[],
    addEventListener(type,handler){if(type==='click')this.handlers.push(handler);}
  };
  const doc={
    querySelectorAll:selector=>selector==='[data-project-interest]'?[link]:[],
    querySelector:selector=>selector==='#project-application [name="interest"]'?select:null,
    getElementById:id=>id==='project-application-title'?heading:null
  };
  return {doc,link,select,heading};
}

const waitForFocus=()=>new Promise(resolve=>setTimeout(resolve,5));

test('bindProjectForms preselects the clicked intent without disabling the select',async()=>{
  assert.equal(typeof bindProjectForms,'function');
  const {doc,link,select}=makeDocument();
  bindProjectForms(doc);

  link.handlers[0]();
  await waitForFocus();

  assert.equal(select.value,'Подать заявку');
  assert.equal(select.disabled,false);
});

test('bindProjectForms does not replace the current value for an unknown intent',async()=>{
  assert.equal(typeof bindProjectForms,'function');
  const {doc,link,select}=makeDocument({interest:'Неизвестная тема'});
  bindProjectForms(doc);

  link.handlers[0]();
  await waitForFocus();

  assert.equal(select.value,'Узнать о программе');
});

test('bindProjectForms focuses the form heading once without another scroll',async()=>{
  assert.equal(typeof bindProjectForms,'function');
  const {doc,link,heading}=makeDocument();
  bindProjectForms(doc);
  bindProjectForms(doc);

  assert.equal(link.handlers.length,1);
  link.handlers[0]();
  await waitForFocus();

  assert.deepEqual(heading.focusCalls,[{preventScroll:true}]);
});

test('project build publishes the controller and responsive form styles',()=>{
  execFileSync(process.execPath,['-e',"require('./scripts/build-projects-hook.cjs')"]);
  assert.equal(fs.existsSync('dist/shared/project-forms.js'),true);
  const page=fs.readFileSync('dist/projects/zabota-o-svoih/index.html','utf8');
  assert.match(page,/src="\/shared\/project-forms\.js\?v=20261115-projects1"/);

  const css=fs.readFileSync('dist/shared/heritage-project.css','utf8');
  assert.match(css,/\.project-application__form\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/@media\(max-width:820px\)[\s\S]*?\.project-application__form\{grid-template-columns:1fr\}/);
  assert.match(css,/\.project-application[^\n]*:focus-visible/);
  assert.match(css,/\[data-mail-status\]\[data-state="success"\]/);
  assert.match(css,/\[data-mail-status\]\[data-state="error"\]/);
  assert.match(css,/\.project-application__actions button:disabled/);
  assert.match(css,/\.heritage-action-grid\{[^}]*grid-template-columns:repeat\(auto-fit,/);
});
