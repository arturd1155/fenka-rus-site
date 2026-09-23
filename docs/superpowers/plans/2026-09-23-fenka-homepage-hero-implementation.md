# FENKA Homepage Interactive Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing generic homepage opening with an accessible full-screen interactive story that transforms from a dark digital map of Russia into a light official FENKA introduction and then reveals a concise manifesto and history timeline.

**Architecture:** Keep the existing static HTML/CSS/JavaScript stack and isolate the new experience into semantic Hero markup, a dedicated animation state machine, and CSS scene states. Use the existing clean Russia map asset and CSS masks/overlays; do not add an animation framework. The existing regions page remains untouched and the homepage continues to build as static files under `dist/`.

**Tech Stack:** HTML5, CSS custom properties and transitions, vanilla JavaScript, Node.js built-in test runner/assertions, Sites static hosting.

**Spec:** `docs/superpowers/specs/2026-09-23-fenka-homepage-hero-design.md`

## Global Constraints

- The central message is exactly: `ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство.`
- The final Hero contains one primary action only: `Узнать о ФЕНКА`.
- The opening moves from dark technological styling to a light official FENKA presentation.
- No persistent information cards or floating panels may obscure the map.
- The automatic opening runs once per page load and never traps scrolling.
- `prefers-reduced-motion: reduce` must produce a readable static final state.
- The first implementation uses branded temporary visual fields until approved documentary photographs are supplied.
- Do not change `regions-interactive.html` or the published regions-page behavior.

## File Structure

- Modify `index.html` — semantic header, Hero scene layers, manifesto, and timeline markup.
- Modify `style.css` — Hero visual system, dark/light scene states, responsive layout, reduced-motion state.
- Modify `app.js` — finite scene controller, intro timing, scroll progress, cleanup, mobile/reduced-motion behavior.
- Create `tests/homepage-hero.test.cjs` — static contract tests for copy, accessibility, and asset structure.
- Create `tests/hero-controller.test.cjs` — unit tests for pure scene-state calculations.
- Create `hero-controller.js` — pure, DOM-independent Hero state functions consumed by `app.js` and tests.
- Copy `fenka-logo-official.png` and `fenka-regions-visual-clean.png` into `dist/` during the final packaging task.

## Review Focus

- A visitor scrolls during the automatic intro: scrolling must take control immediately without waiting for timers.
- A visitor uses reduced motion: the final light Hero and all content must render immediately without animation.
- The browser is narrow or touch-only: the map, title, and CTA must remain readable with no horizontal overflow.
- JavaScript fails or is disabled: the final message and CTA must remain visible in the HTML/CSS fallback.
- The visitor reloads or returns via back navigation: the intro may restart, but no stale timers or duplicate listeners may accumulate.

---

### Task 1: Lock the Hero content and accessibility contract

**Files:**
- Create: `tests/homepage-hero.test.cjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `fenka-logo-official.png` and `fenka-regions-visual-clean.png` assets.
- Produces: elements `#homeHero`, `#heroMap`, `#heroCollage`, `#heroStatement`, `#heroCta`, and `#aboutFenka` for later CSS and JavaScript tasks.

- [ ] **Step 1: Write the failing static contract test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('index.html', 'utf8');

test('hero exposes the agreed narrative and one primary action', () => {
  assert.match(html, /id="homeHero"/);
  assert.match(html, /id="heroMap"/);
  assert.match(html, /id="heroCollage"/);
  assert.match(html, /id="heroStatement"/);
  assert.match(html, /ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство\./);
  assert.equal((html.match(/class="[^\"]*hero-primary[^\"]*"/g) || []).length, 1);
  assert.match(html, /href="#aboutFenka"[^>]*>\s*Узнать о ФЕНКА/);
});

test('hero has a usable no-script and screen-reader structure', () => {
  assert.match(html, /aria-hidden="true"[^>]*id="heroMap"|id="heroMap"[^>]*aria-hidden="true"/);
  assert.match(html, /<noscript>[\s\S]*ФЕНКА объединяет/);
  assert.match(html, /id="aboutFenka"/);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because `#homeHero` and the approved message do not exist.

- [ ] **Step 3: Replace only the existing Hero and immediate intro markup**

Create semantic layers inside `<section id="homeHero" class="story-hero" data-scene="network">`:

```html
<div class="hero-stage" aria-hidden="true">
  <div class="hero-map" id="heroMap">
    <img src="fenka-regions-visual-clean.png" alt="">
    <div class="hero-connections"></div>
  </div>
  <div class="hero-collage" id="heroCollage">
    <div class="culture-frame culture-frame--one"></div>
    <div class="culture-frame culture-frame--two"></div>
    <div class="culture-frame culture-frame--three"></div>
  </div>
</div>
<div class="shell hero-statement" id="heroStatement">
  <p class="eyebrow">Федеральная еврейская национально-культурная автономия</p>
  <h1>ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство.</h1>
  <a class="button button-red hero-primary" id="heroCta" href="#aboutFenka">Узнать о ФЕНКА</a>
</div>
<noscript><p>ФЕНКА объединяет регионы, людей и проекты в единое культурное пространство.</p></noscript>
```

Replace the old generic intro with `<section id="aboutFenka">` containing three manifesto statements and a five-item timeline shell. Keep all later homepage sections unchanged for now.

- [ ] **Step 4: Run the static contract test and verify GREEN**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: PASS.

- [ ] **Step 5: Commit the content structure**

```bash
git add index.html tests/homepage-hero.test.cjs
git commit -m "feat: add homepage hero narrative structure"
```

---

### Task 2: Build a testable Hero scene-state controller

**Files:**
- Create: `hero-controller.js`
- Create: `tests/hero-controller.test.cjs`

**Interfaces:**
- Produces: `getHeroScene(progress, reducedMotion)` returning `'network' | 'culture' | 'official'`.
- Produces: `clampProgress(value)` returning a number from `0` through `1`.
- Consumed by: `app.js` in Task 4.

- [ ] **Step 1: Write failing state tests**

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { clampProgress, getHeroScene } = require('../hero-controller.js');

test('progress is clamped for overscroll and invalid values', () => {
  assert.equal(clampProgress(-1), 0);
  assert.equal(clampProgress(2), 1);
  assert.equal(clampProgress(Number.NaN), 0);
});

test('normal motion moves through all three scenes', () => {
  assert.equal(getHeroScene(0.1, false), 'network');
  assert.equal(getHeroScene(0.5, false), 'culture');
  assert.equal(getHeroScene(0.9, false), 'official');
});

test('reduced motion always returns the readable official scene', () => {
  assert.equal(getHeroScene(0, true), 'official');
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/hero-controller.test.cjs`

Expected: FAIL with `Cannot find module '../hero-controller.js'`.

- [ ] **Step 3: Implement the pure controller**

```js
function clampProgress(value) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function getHeroScene(progress, reducedMotion = false) {
  if (reducedMotion) return 'official';
  const value = clampProgress(progress);
  if (value < 0.34) return 'network';
  if (value < 0.72) return 'culture';
  return 'official';
}

if (typeof module !== 'undefined') module.exports = { clampProgress, getHeroScene };
```

Expose the same functions in browsers with `window.FenkaHero = { clampProgress, getHeroScene };`.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `node --test tests/hero-controller.test.cjs`

Expected: 3 PASS.

- [ ] **Step 5: Commit the controller**

```bash
git add hero-controller.js tests/hero-controller.test.cjs
git commit -m "feat: add deterministic hero scene controller"
```

---

### Task 3: Implement the dark-to-light visual system

**Files:**
- Modify: `style.css`
- Modify: `tests/homepage-hero.test.cjs`

**Interfaces:**
- Consumes: `[data-scene="network|culture|official"]` from the Hero controller.
- Produces: visual scene transitions without changing layout geometry.

- [ ] **Step 1: Extend the contract test with required CSS states**

```js
const css = fs.readFileSync('style.css', 'utf8');
test('styles define all scenes and accessibility fallbacks', () => {
  assert.match(css, /data-scene="network"/);
  assert.match(css, /data-scene="culture"/);
  assert.match(css, /data-scene="official"/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because the scene selectors are absent.

- [ ] **Step 3: Add the Hero CSS system**

Implement:

- `.story-hero { min-height: 300vh; }` with a sticky `.hero-stage` and `.hero-statement` viewport.
- `network`: deep navy background, visible map, sequential point glow, hidden statement.
- `culture`: map opacity reduction, three branded image fields entering at different scales, no white cards.
- `official`: ice-white background, map as a subtle watermark, collage hidden, statement and CTA visible.
- Use only `transform`, `opacity`, and background-color transitions for animation performance.
- Add `:focus-visible` for the CTA and keep contrast at WCAG AA.
- Under 720px, reduce collage frames from three to two and disable pointer parallax.
- Under reduced motion, remove sticky scroll choreography and show the official state immediately.

- [ ] **Step 4: Run contract tests and verify GREEN**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: PASS.

- [ ] **Step 5: Commit the visual system**

```bash
git add style.css tests/homepage-hero.test.cjs
git commit -m "feat: style interactive dark-to-light hero scenes"
```

---

### Task 4: Connect intro timing, scroll control, and cleanup

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `tests/homepage-hero.test.cjs`

**Interfaces:**
- Consumes: `window.FenkaHero.getHeroScene(progress, reducedMotion)`.
- Produces: one `data-scene` value on `#homeHero`; CSS owns all rendering.

- [ ] **Step 1: Add a failing script integration contract**

```js
const js = fs.readFileSync('app.js', 'utf8');
test('homepage initializes one interruptible hero controller', () => {
  assert.match(html, /<script src="hero-controller\.js"><\/script>[\s\S]*<script src="app\.js"><\/script>/);
  assert.match(js, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/);
  assert.match(js, /addEventListener\('scroll'/);
  assert.match(js, /cancelAnimationFrame/);
  assert.match(js, /data-scene|dataset\.scene/);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because the controller script and scroll integration are absent.

- [ ] **Step 3: Implement the DOM controller in `app.js`**

Use one controller with this shape:

```js
function initHomepageHero() {
  const hero = document.querySelector('#homeHero');
  if (!hero || !window.FenkaHero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0;
  let introStart = performance.now();
  let userTookControl = false;

  function render(now) {
    const rect = hero.getBoundingClientRect();
    const scrollProgress = -rect.top / Math.max(1, rect.height - innerHeight);
    const introProgress = Math.min(1, (now - introStart) / 3600);
    const progress = userTookControl ? scrollProgress : Math.max(scrollProgress, introProgress * 0.34);
    hero.dataset.scene = window.FenkaHero.getHeroScene(progress, reduced);
    hero.style.setProperty('--hero-progress', window.FenkaHero.clampProgress(progress));
    frame = 0;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  addEventListener('scroll', () => { userTookControl = true; schedule(); }, { passive: true });
  addEventListener('pagehide', () => { if (frame) cancelAnimationFrame(frame); }, { once: true });
  schedule();
}
```

Call `initHomepageHero()` once after DOM parsing. Do not create intervals.

- [ ] **Step 4: Run unit and integration tests**

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 5: Run syntax verification**

Run: `node --check hero-controller.js && node --check app.js`

Expected: exit code 0 and no output.

- [ ] **Step 6: Commit the interaction**

```bash
git add index.html app.js hero-controller.js tests/homepage-hero.test.cjs
git commit -m "feat: connect hero intro and scroll choreography"
```

---

### Task 5: Complete the manifesto and history transition

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `tests/homepage-hero.test.cjs`

**Interfaces:**
- Consumes: `#aboutFenka` target from Task 1.
- Produces: a readable next step after the Hero without defining the rest of the homepage.

- [ ] **Step 1: Add failing content assertions**

```js
test('about section combines manifesto and history', () => {
  assert.match(html, /class="fenka-manifesto"/);
  assert.equal((html.match(/class="manifesto-point"/g) || []).length, 3);
  assert.match(html, /class="fenka-timeline"/);
  assert.ok((html.match(/<time/g) || []).length >= 3);
});
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because manifesto/timeline classes are absent or incomplete.

- [ ] **Step 3: Implement approved placeholder copy**

Use three manifesto points: `Объединяем регионы`, `Сохраняем культуру и историческую память`, `Создаём пространство для людей и проектов`. Mark dates not yet verified with `data-content-status="needs-verification"` and do not invent publication-ready facts.

- [ ] **Step 4: Style as one editorial continuation**

Use a light background, large serif chapter numbers, a single horizontal timeline on desktop, and a vertical timeline on mobile. Avoid cards, shadows, and repeated CTA buttons.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `node --test tests/*.test.cjs`

Expected: all tests PASS.

- [ ] **Step 6: Commit the first narrative chapter**

```bash
git add index.html style.css tests/homepage-hero.test.cjs
git commit -m "feat: add FENKA manifesto and history chapter"
```

---

### Task 6: Package, verify, and publish the first-stage prototype

**Files:**
- Modify: `dist/index.html`
- Create: `dist/style.css`
- Create: `dist/app.js`
- Create: `dist/hero-controller.js`
- Verify: `dist/fenka-logo-official.png`
- Verify: `dist/fenka-regions-visual-clean.png`

**Interfaces:**
- Consumes: all source files from Tasks 1–5.
- Produces: a self-contained Sites static deployment.

- [ ] **Step 1: Add a failing distribution test**

Add to `tests/homepage-hero.test.cjs`:

```js
test('distribution contains every homepage dependency', () => {
  for (const file of ['index.html', 'style.css', 'app.js', 'hero-controller.js', 'fenka-logo-official.png', 'fenka-regions-visual-clean.png']) {
    assert.equal(fs.existsSync(`dist/${file}`), true, `missing dist/${file}`);
  }
});
```

- [ ] **Step 2: Run and verify RED**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL until all dependencies are copied.

- [ ] **Step 3: Copy the exact tested source into `dist/`**

Run:

```powershell
Copy-Item index.html,style.css,app.js,hero-controller.js,fenka-logo-official.png,fenka-regions-visual-clean.png -Destination dist -Force
```

- [ ] **Step 4: Run the full verification suite**

Run:

```powershell
node --test tests/*.test.cjs
node --check hero-controller.js
node --check app.js
git diff --check
```

Expected: all tests PASS, syntax checks exit 0, and `git diff --check` has no output.

- [ ] **Step 5: Perform visual QA**

Check desktop at 1440×900, tablet at 1024×768, and mobile at 390×844. Verify the five Review Focus cases, keyboard focus, no horizontal overflow, immediate scroll takeover, and reduced-motion final state.

- [ ] **Step 6: Commit the deployable build**

```bash
git add dist tests
git commit -m "build: package interactive FENKA homepage hero"
```

- [ ] **Step 7: Publish as a new saved Sites version**

Push the exact commit, archive `.openai` and `dist`, save a version using the pushed full commit SHA, deploy it, and confirm the deployment status is `succeeded` before sharing the URL.
