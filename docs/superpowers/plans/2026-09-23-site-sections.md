# FENKA Site Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать и опубликовать единый многостраничный каркас сайта ФЕНКА со всеми 12 рабочими разделами, общей навигацией и подготовленными областями для последующего наполнения.

**Architecture:** Одна CommonJS-конфигурация описывает маршруты, подписи, группы меню и внешние социальные ссылки. Серверный генератор формирует общую шапку, подвал и внутренние страницы, а существующие главная и страница регионов подключают те же общие ресурсы. Сборка `dist/` остаётся статической и совместимой с текущим Sites-хостингом.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js CommonJS, `node:test`, статический Sites-хостинг.

**Spec:** `docs/superpowers/specs/2026-09-23-site-sections-design.md`

## Global Constraints

- Сохранить палитру «Федеральный модерн»: белый фон, глубокий синий, красный акцент.
- Сохранить существующую интерактивную карту только по маршруту `/regions/`.
- Не добавлять CMS, фреймворки и новые npm-зависимости.
- Все внутренние ссылки должны быть абсолютными от корня сайта.
- Все страницы должны работать при ширине от 320 пикселей.
- Внешние социальные ссылки открываются в новой вкладке с `rel="noopener noreferrer"`.
- Существующие несвязанные файлы аудита и выгрузок не изменять и не добавлять в коммиты.

## Review Focus

- Переход по любому пункту меню с вложенного адреса открывает правильный корневой маршрут, а не относительный соседний путь; проверяется в Task 2.
- Клавиатурный пользователь может раскрыть и закрыть меню «О ФЕНКА» и мобильную навигацию, включая Escape; проверяется в Task 3.
- Длинные русские названия не создают горизонтальную прокрутку на 320 пикселях; проверяется в Task 3.
- Текущий раздел получает только один `aria-current="page"`, включая дочерние страницы группы «О ФЕНКА»; проверяется в Task 2.
- Внешние ссылки не получают внутреннюю обработку навигации и безопасно открываются в новой вкладке; проверяется в Task 2.

---

### Task 1: Единая конфигурация структуры сайта

**Files:**
- Create: `site/site-structure.cjs`
- Create: `tests/site-structure.test.cjs`

**Interfaces:**
- Produces: `sections: Section[]`, `primaryNavigation: NavigationItem[]`, `socialLinks: ExternalLink[]`, `findSection(pathname): Section | undefined`.
- `Section` fields: `path`, `slug`, `title`, `eyebrow`, `summary`, `contentType`, `group`.
- `NavigationItem` fields: `label`, `path`, optional `children`.
- `ExternalLink` fields: `label`, `href`.

- [ ] **Step 1: Write the failing configuration test**

```js
const test=require('node:test');
const assert=require('node:assert/strict');
const {sections,primaryNavigation,socialLinks,findSection}=require('../site/site-structure.cjs');

test('defines every approved route in the approved order',()=>{
  assert.deepEqual(sections.map(item=>item.path),[
    '/regions/','/leadership/','/documents/','/reports/','/about/',
    '/projects/','/events/','/media/','/news/','/support/',
    '/contacts/','/privacy/'
  ]);
});

test('groups organization pages under About and keeps social links external',()=>{
  const about=primaryNavigation.find(item=>item.path==='/about/');
  assert.deepEqual(about.children.map(item=>item.path),[
    '/about/','/leadership/','/documents/','/reports/'
  ]);
  assert.deepEqual(socialLinks.map(item=>item.label),['ВКонтакте','Telegram','MAX']);
  assert.equal(findSection('/news/').title,'Новости');
});
```

- [ ] **Step 2: Run the test and verify the missing-module failure**

Run: `node --test tests/site-structure.test.cjs`

Expected: FAIL because `site/site-structure.cjs` does not exist.

- [ ] **Step 3: Implement the approved configuration**

Create all 12 `Section` objects with the exact paths and Russian labels from the spec. Define the «О ФЕНКА» child group, the seven visible top-level destinations, the support action, and the three supplied social URLs. Implement:

```js
function findSection(pathname){
  return sections.find(section=>section.path===pathname);
}

module.exports={sections,primaryNavigation,socialLinks,findSection};
```

- [ ] **Step 4: Run the focused and full test suites**

Run: `node --test tests/site-structure.test.cjs`

Expected: PASS.

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the configuration**

```bash
git add site/site-structure.cjs tests/site-structure.test.cjs
git commit -m "feat: define unified site structure"
```

### Task 2: Общий генератор шапки и подвала

**Files:**
- Create: `site/site-chrome.cjs`
- Create: `tests/site-chrome.test.cjs`
- Uses: `site/site-structure.cjs`

**Interfaces:**
- Consumes: `primaryNavigation`, `sections`, `socialLinks` from Task 1.
- Produces: `renderHeader(activePath): string`, `renderFooter(): string`.

- [ ] **Step 1: Write failing rendering tests**

```js
const test=require('node:test');
const assert=require('node:assert/strict');
const {renderHeader,renderFooter}=require('../site/site-chrome.cjs');

test('renders absolute routes and exactly one active page',()=>{
  const html=renderHeader('/documents/');
  for(const path of ['/about/','/regions/','/projects/','/events/','/media/','/news/','/contacts/','/support/']){
    assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`));
  }
  assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  assert.match(html,/href="\/documents\/"[^>]*aria-current="page"/);
  assert.match(html,/aria-expanded="false"/);
  assert.match(html,/aria-controls="siteNavigation"/);
});

test('footer contains all routes and secure external links',()=>{
  const html=renderFooter();
  for(const path of ['/regions/','/leadership/','/documents/','/reports/','/about/','/projects/','/events/','/media/','/news/','/support/','/contacts/','/privacy/']){
    assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`));
  }
  assert.equal((html.match(/target="_blank"/g)||[]).length,3);
  assert.equal((html.match(/rel="noopener noreferrer"/g)||[]).length,3);
});
```

- [ ] **Step 2: Run the tests and verify they fail because the renderer is absent**

Run: `node --test tests/site-chrome.test.cjs`

Expected: FAIL with missing module.

- [ ] **Step 3: Implement semantic shared chrome**

Implement `renderHeader(activePath)` with logo, desktop navigation, «О ФЕНКА» submenu, contacts link, support button and mobile toggle. Implement `renderFooter()` with all internal routes and the exact social links. Escape all labels before interpolation with:

```js
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[char]);
}
```

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/site-chrome.test.cjs`

Expected: PASS.

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the shared chrome renderer**

```bash
git add site/site-chrome.cjs tests/site-chrome.test.cjs
git commit -m "feat: render shared site navigation"
```

### Task 3: Общие стили и интерактивность навигации

**Files:**
- Create: `shared/site-shell.css`
- Create: `shared/site-shell.js`
- Create: `tests/site-shell.test.cjs`

**Interfaces:**
- Consumes DOM hooks: `[data-menu-toggle]`, `#siteNavigation`, `[data-about-toggle]`, `[data-about-menu]`.
- Produces responsive desktop dropdown and mobile menu behavior.

- [ ] **Step 1: Write failing static behavior tests**

```js
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('shared navigation supports mobile, dropdown, Escape and 320px layouts',()=>{
  const css=fs.readFileSync('shared/site-shell.css','utf8');
  const js=fs.readFileSync('shared/site-shell.js','utf8');
  assert.match(css,/@media\s*\(max-width:\s*1020px\)/);
  assert.match(css,/@media\s*\(max-width:\s*480px\)/);
  assert.match(css,/overflow-wrap:\s*anywhere/);
  assert.match(js,/event\.key\s*===\s*'Escape'/);
  assert.match(js,/classList\.toggle\('is-open'/);
  assert.match(js,/setAttribute\('aria-expanded'/);
});
```

- [ ] **Step 2: Run the test and verify missing-file failure**

Run: `node --test tests/site-shell.test.cjs`

Expected: FAIL because shared assets do not exist.

- [ ] **Step 3: Implement the shared design system**

Create CSS variables for navy, blue, red, paper, line, shadow, spacing and focus ring. Style the shared header, submenu, mobile drawer, breadcrumbs, section hero, content scaffolds and footer without changing the visual identity of the current homepage or region map.

Implement JS that:

```js
const setOpen=(button,panel,open)=>{
  button.setAttribute('aria-expanded',String(open));
  panel.classList.toggle('is-open',open);
};
```

Use this helper for both menus. Close menus on internal link activation, outside click and Escape. Return focus to the triggering button after Escape.

- [ ] **Step 4: Run focused and full tests**

Run: `node --test tests/site-shell.test.cjs`

Expected: PASS.

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit shared assets**

```bash
git add shared/site-shell.css shared/site-shell.js tests/site-shell.test.cjs
git commit -m "feat: add responsive shared site shell"
```

### Task 4: Генерация внутренних страниц

**Files:**
- Create: `site/section-page.cjs`
- Create: `scripts/build-site.cjs`
- Create: `tests/site-pages.test.cjs`
- Create through build: `dist/about/index.html`
- Create through build: `dist/leadership/index.html`
- Create through build: `dist/documents/index.html`
- Create through build: `dist/reports/index.html`
- Create through build: `dist/projects/index.html`
- Create through build: `dist/events/index.html`
- Create through build: `dist/media/index.html`
- Create through build: `dist/news/index.html`
- Create through build: `dist/support/index.html`
- Create through build: `dist/contacts/index.html`
- Create through build: `dist/privacy/index.html`

**Interfaces:**
- Consumes: `Section`, `renderHeader(activePath)`, `renderFooter()`.
- Produces: `renderSectionPage(section): string`; build command `node scripts/build-site.cjs`.

- [ ] **Step 1: Write failing page-generation tests**

```js
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');

test('build creates every non-region section page with complete chrome',()=>{
  execFileSync(process.execPath,['scripts/build-site.cjs']);
  const slugs=['about','leadership','documents','reports','projects','events','media','news','support','contacts','privacy'];
  for(const slug of slugs){
    const html=fs.readFileSync(`dist/${slug}/index.html`,'utf8');
    assert.match(html,/<header class="global-header"/);
    assert.match(html,/<main id="main"/);
    assert.match(html,/<footer class="global-footer"/);
    assert.match(html,/Раздел наполняется/);
    assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  }
});
```

- [ ] **Step 2: Run the test and verify missing build-script failure**

Run: `node --test tests/site-pages.test.cjs`

Expected: FAIL because `scripts/build-site.cjs` does not exist.

- [ ] **Step 3: Implement the semantic page renderer**

`renderSectionPage(section)` must output doctype, Russian language, unique title and description, shared CSS/JS links, skip link, breadcrumbs, hero, type-specific content scaffold and footer. Each content type receives meaningful empty-state labels:

```js
const contentLabels={
  leadership:'Карточки руководителей и органов управления',
  documents:'Официальные документы по категориям и датам',
  reports:'Публичная отчётность по периодам',
  projects:'Федеральные и региональные проекты',
  events:'Ближайшие и прошедшие события',
  media:'Видео, публикации и тематические коллекции',
  news:'Новости организации и региональных отделений'
};
```

For `about`, `support`, `contacts`, and `privacy`, render section-specific cards described in the spec instead of a generic list.

- [ ] **Step 4: Implement the build script**

The build script creates each target directory recursively, writes UTF-8 HTML, copies `shared/site-shell.css` and `shared/site-shell.js` to `dist/shared/`, and never deletes unrelated files from `dist/`.

- [ ] **Step 5: Run the focused and full test suites**

Run: `node --test tests/site-pages.test.cjs`

Expected: PASS.

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 6: Commit generated sections and build source**

```bash
git add site/section-page.cjs scripts/build-site.cjs shared dist/about dist/leadership dist/documents dist/reports dist/projects dist/events dist/media dist/news dist/support dist/contacts dist/privacy tests/site-pages.test.cjs
git commit -m "feat: generate all site section pages"
```

### Task 5: Подключение общей навигации к главной и регионам

**Files:**
- Modify: `index.html`
- Modify: `regions-interactive.html`
- Modify: `style.css`
- Modify: `app.js`
- Modify: `scripts/build-site.cjs`
- Modify: `tests/homepage-hero.test.cjs`
- Modify through build: `dist/index.html`
- Modify through build: `dist/regions/index.html`

**Interfaces:**
- Consumes: `renderHeader`, `renderFooter`, `shared/site-shell.css`, `shared/site-shell.js`.
- Produces: one consistent navigation system on `/` and `/regions/`.

- [ ] **Step 1: Replace the old navigation expectations with failing route tests**

Add assertions that both built pages contain `/about/`, `/regions/`, `/projects/`, `/events/`, `/media/`, `/news/`, `/contacts/`, and `/support/`; contain the «О ФЕНКА» submenu; load `/shared/site-shell.css` and `/shared/site-shell.js`; and contain no old `href="/#..."` navigation links.

```js
test('homepage and regions use the shared permanent navigation',()=>{
  for(const file of ['dist/index.html','dist/regions/index.html']){
    const html=fs.readFileSync(file,'utf8');
    for(const path of ['/about/','/regions/','/projects/','/events/','/media/','/news/','/contacts/','/support/']){
      assert.match(html,new RegExp(`href="${path.replaceAll('/','\\/')}"`));
    }
    assert.doesNotMatch(html,/href="\/#(?:aboutFenka|projects|events|media|news|join)"/);
  }
});
```

- [ ] **Step 2: Run the focused test and verify old-anchor failure**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because the existing pages still contain root hash routes and separate headers.

- [ ] **Step 3: Integrate shared chrome without altering page-specific features**

Replace only the header/footer markup and corresponding menu behavior. Preserve homepage hero controls, all homepage sections, region districts, search, modal cards, map zoom and region data. Avoid global class names that collide with `.header`, `.nav`, `.footer`, or map controls by using the `global-` prefix.

- [ ] **Step 4: Extend the build script for root and regions output**

Generate shared chrome into the two existing source documents or use explicit `<!-- GLOBAL_HEADER -->` and `<!-- GLOBAL_FOOTER -->` markers. Ensure `node scripts/build-site.cjs` always produces the complete `dist/` tree from source files.

- [ ] **Step 5: Run syntax and complete regression checks**

Run: `node scripts/build-site.cjs`

Expected: exit code 0.

Run: `node --check app.js && node --check hero-controller.js && node --check shared/site-shell.js`

Expected: all syntax checks exit 0.

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS, including existing hero and region navigation tests.

- [ ] **Step 6: Commit unified navigation integration**

```bash
git add index.html regions-interactive.html style.css app.js scripts/build-site.cjs dist tests/homepage-hero.test.cjs
git commit -m "feat: connect all pages through shared navigation"
```

### Task 6: Final validation and publication

**Files:**
- Verify: `.openai/hosting.json`
- Verify: complete `dist/` tree
- Create locally: deployment archive excluded from Git

**Interfaces:**
- Consumes: deterministic build command from Task 4 and pushed Git commit.
- Produces: a saved and deployed Sites version at the existing public URL.

- [ ] **Step 1: Run a clean production build and complete tests**

Run:

```bash
node scripts/build-site.cjs
node --test tests/*.test.cjs
node --check app.js
node --check hero-controller.js
node --check shared/site-shell.js
git diff --check
```

Expected: build and syntax checks exit 0, all tests PASS, no whitespace errors.

- [ ] **Step 2: Verify all route artifacts**

Run:

```bash
node -e "const fs=require('fs');for(const slug of ['regions','leadership','documents','reports','about','projects','events','media','news','support','contacts','privacy']){if(!fs.existsSync('dist/'+slug+'/index.html'))throw new Error('Missing '+slug)}"
```

Expected: exit code 0 with no missing route.

- [ ] **Step 3: Commit generated output if the build changed it**

```bash
git add dist
git diff --cached --quiet || git commit -m "build: refresh unified site output"
```

- [ ] **Step 4: Push the exact HEAD to the existing Sites repository**

Create a short-lived Sites write credential, push `HEAD` to its returned `main` branch, and record the full SHA from `git rev-parse HEAD`. Never print or persist the token.

- [ ] **Step 5: Package, save and deploy the exact pushed version**

Create a gzip tar archive containing `.openai/hosting.json` and `dist/`. Save a Sites version using the exact pushed SHA and archive, then deploy that saved version to the existing project `appgprj_6ab27c6ecb308191bdc83d4edebcad5d`.

- [ ] **Step 6: Verify the production deployment**

Confirm deployment status is `succeeded`. Open `/`, `/regions/`, `/about/`, `/documents/`, `/news/`, `/contacts/`, and `/privacy/`; verify desktop navigation, the mobile menu at a narrow viewport, active states, external social links, and absence of 404 responses.

- [ ] **Step 7: Report the exact public links and verification evidence**

Provide the public root URL, direct links to representative sections, total passing test count, and any content areas intentionally awaiting supplied materials.
