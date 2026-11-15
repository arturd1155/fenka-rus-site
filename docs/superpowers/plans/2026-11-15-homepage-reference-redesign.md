# Homepage Reference Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every homepage section after the existing hero to closely match the approved reference composition while preserving all FENKA content, assets, links, and hero behavior.

**Architecture:** Keep the existing static HTML/CSS/vanilla-JS stack and treat the closing `</section>` of `#homeHero` as a hard boundary. Replace only post-hero markup and its scoped styles, reuse local project/event images, and regenerate `dist/` through the existing build script. A dedicated Node test snapshots the hero fragment and verifies section order, local assets, responsive rules, accessibility, and built output.

**Tech Stack:** HTML5, CSS Grid/Flexbox, vanilla JavaScript, Node.js built-in test runner, existing `scripts/build-site.cjs` pipeline.

**Spec:** `docs/superpowers/specs/2026-11-15-homepage-reference-redesign-design.md`

## Global Constraints

- Do not modify `.story-hero`, its descendants, hero assets, `hero-controller.js`, hero logic in `app.js`, or existing hero CSS rules.
- Preserve the current four homepage projects, current events, current news items, their copy, images, and destinations.
- Use only existing Prata and Manrope fonts and the current FENKA blue/red/paper palette.
- Add no framework, dependency, remote image, or heavy animation.
- Support 1440, 1024, 768, 390, and 320 px without page-level horizontal scrolling.
- Respect `prefers-reduced-motion`, visible focus states, 44 px pointer targets, semantic headings, and image alt text.
- Use `object-fit: contain` for covers with embedded text.

## Review Focus

- The hero fragment must remain byte-for-byte identical in source and built HTML; Task 1 pins both.
- A 320 px viewport must not create page-level horizontal overflow; Task 4 verifies computed scroll width.
- Cover artwork containing text must remain uncropped; Tasks 2 and 3 assert `object-fit: contain` on those components.
- Keyboard users must see focus on every card/action link; Task 4 asserts scoped `:focus-visible` rules.
- Reduced-motion users must receive no reveal, parallax, or hover-transform animation; Task 4 asserts the media override.

---

### Task 1: Lock the hero boundary and define the new editorial skeleton

**Files:**
- Create: `tests/homepage-reference-redesign.test.cjs`
- Create: `tests/fixtures/homepage-hero.html`
- Modify: `index.html:50-155`
- Modify: `dist/index.html`

**Interfaces:**
- Consumes: current `#homeHero` HTML fragment from `index.html`.
- Produces: stable post-hero section hooks `.home-system`, `.home-directions`, `.home-projects`, `.home-feed`, `.home-join`, `.home-newsletter` used by later CSS tasks.

- [ ] **Step 1: Save the exact current `<section class="story-hero" …>` fragment in `tests/fixtures/homepage-hero.html` and write the failing structural test**

The test `keeps the approved hero untouched while installing the reference section order` must assert that the extracted source hero equals the fixture, built hero equals the fixture, and post-hero hooks occur in the exact order listed in Interfaces.

- [ ] **Step 2: Run the structural test and verify it fails only for the missing new hooks**

Run: `node --test --test-name-pattern="approved hero untouched" tests/homepage-reference-redesign.test.cjs`

Expected: FAIL because `.home-system` and following hooks are absent; hero equality already passes.

- [ ] **Step 3: Replace only markup after `#homeHero` with semantic section wrappers matching the approved order**

Keep all existing user-facing copy, links, four project entries, two event entries, and four news entries. Add semantic labels and real `<img>` elements for local project/event assets. Do not edit any byte inside the fixture-matched hero fragment.

- [ ] **Step 4: Run the structural test and build**

Run: `node scripts/build-site.cjs && node --test --test-name-pattern="approved hero untouched" tests/homepage-reference-redesign.test.cjs`

Expected: PASS.

- [ ] **Step 5: Commit the guarded structural change**

```bash
git add index.html dist/index.html tests/homepage-reference-redesign.test.cjs tests/fixtures/homepage-hero.html
git commit -m "Restructure homepage below protected hero"
```

### Task 2: Build the FENKA system ribbon and directions panorama

**Files:**
- Modify: `style.css`
- Modify: `index.html`
- Modify: `dist/style.css`
- Modify: `dist/index.html`
- Test: `tests/homepage-reference-redesign.test.cjs`

**Interfaces:**
- Consumes: `.home-system` and `.home-directions` markup from Task 1; local covers under `site-assets/projects/` and `dist/assets/projects/`.
- Produces: `.fenka-ribbon`, `.fenka-ribbon__core`, `.fenka-ribbon__segment`, `.direction-panorama`, and `.direction-tile` visual components.

- [ ] **Step 1: Add failing tests for the reference composition**

Assert four ribbon segments with labels `Люди`, `Регионы`, `Культура`, `Развитие`; six direction links; local image paths; desktop two-column system layout; desktop six-tile panorama; mobile `overflow-x:auto` plus `scroll-snap-type:x mandatory`; and `object-fit:contain` on artwork containing text.

- [ ] **Step 2: Run the component tests**

Run: `node --test --test-name-pattern="FENKA system ribbon|directions panorama" tests/homepage-reference-redesign.test.cjs`

Expected: FAIL because the new component selectors/rules are missing.

- [ ] **Step 3: Implement the light system section and dark direction panorama**

Use CSS Grid for the copy/ribbon split, layered pseudo-elements for the continuous ribbon, clipped desktop direction tiles, and a non-clipped scroll-snap mobile list. Use existing local project cover files as visual material and gradient overlays for text contrast.

- [ ] **Step 4: Build and rerun the component tests**

Run: `node scripts/build-site.cjs && node --test --test-name-pattern="FENKA system ribbon|directions panorama" tests/homepage-reference-redesign.test.cjs`

Expected: PASS.

- [ ] **Step 5: Commit the two upper post-hero sections**

```bash
git add index.html style.css dist/index.html dist/style.css tests/homepage-reference-redesign.test.cjs
git commit -m "Build homepage system and direction panorama"
```

### Task 3: Build the project mosaic and combined events/news feed

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `dist/index.html`
- Modify: `dist/style.css`
- Test: `tests/homepage-reference-redesign.test.cjs`

**Interfaces:**
- Consumes: `.home-projects` and `.home-feed` skeletons from Task 1; the four existing project records, two event records, and four news records.
- Produces: `.project-mosaic`, `.project-mosaic__lead`, `.project-mosaic__rail`, `.home-feed__events`, and `.home-feed__news` components.

- [ ] **Step 1: Add failing tests for content preservation and layout hooks**

Assert exactly four project links with existing destinations, `Код наследия` as the lead, three supporting cards, exactly two event rows, exactly four news entries, and no replacement of current titles/dates. Assert `aspect-ratio:16/9` and `object-fit:contain` for project images.

- [ ] **Step 2: Run the mosaic/feed tests**

Run: `node --test --test-name-pattern="project mosaic|combined homepage feed" tests/homepage-reference-redesign.test.cjs`

Expected: FAIL because the new hooks and layout rules are missing.

- [ ] **Step 3: Implement the reference-like one-plus-three mosaic and two-column feed**

The lead project occupies the left column; the three preserved supporting projects form the right rail. Events and news share one light section with equal desktop columns and stack events-first on mobile. Keep each card/action fully clickable and prevent decorative overlays from intercepting pointer events.

- [ ] **Step 4: Build and rerun the mosaic/feed tests**

Run: `node scripts/build-site.cjs && node --test --test-name-pattern="project mosaic|combined homepage feed" tests/homepage-reference-redesign.test.cjs`

Expected: PASS.

- [ ] **Step 5: Commit the content mosaics**

```bash
git add index.html style.css dist/index.html dist/style.css tests/homepage-reference-redesign.test.cjs
git commit -m "Build homepage project and content mosaics"
```

### Task 4: Finish participation, newsletter, footer, responsive behavior, and visual QA

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js` only if IntersectionObserver reveal behavior is needed
- Modify: `dist/index.html`
- Modify: `dist/style.css`
- Modify: `dist/app.js` only if source changes
- Test: `tests/homepage-reference-redesign.test.cjs`

**Interfaces:**
- Consumes: all components produced by Tasks 1–3.
- Produces: complete homepage implementation and responsive behavior.

- [ ] **Step 1: Add failing completion and resilience tests**

Assert four participation actions with the support action accented; labelled newsletter fields; working internal footer destinations; scoped `:focus-visible`; 44 px minimum action targets; `@media(max-width:720px)` stacking rules; `@media(max-width:420px)` narrow-screen rules; and a `prefers-reduced-motion` override covering all new transforms/transitions.

- [ ] **Step 2: Run completion tests**

Run: `node --test --test-name-pattern="participation band|homepage accessibility|homepage responsive" tests/homepage-reference-redesign.test.cjs`

Expected: FAIL on the new completion rules.

- [ ] **Step 3: Implement the participation band, newsletter/footer integration, focus states, and responsive rules**

Keep reveal behavior CSS-only unless observation is required. If JavaScript is added, isolate it below the existing hero functions and gate it behind `prefers-reduced-motion: no-preference`.

- [ ] **Step 4: Run all automated checks**

Run: `node scripts/build-site.cjs && node --test tests/homepage-reference-redesign.test.cjs && git diff --check`

Expected: all tests PASS and `git diff --check` reports no issues.

- [ ] **Step 5: Run viewport QA**

Render `dist/index.html` at 1440×1100, 1024×900, 768×1024, 390×844, and 320×720. At each size verify the hero snapshot remains unchanged, all text is readable, no important cover text is cropped, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` (except internal direction-strip scrolling).

- [ ] **Step 6: Verify reduced motion and keyboard navigation**

Emulate reduced motion and tab through every post-hero action. Expected: no transform animation; every interactive element displays a visible focus ring; focus order follows visual order.

- [ ] **Step 7: Commit the completed responsive homepage**

```bash
git add index.html style.css app.js dist/index.html dist/style.css dist/app.js tests/homepage-reference-redesign.test.cjs
git commit -m "Complete responsive reference homepage"
```
