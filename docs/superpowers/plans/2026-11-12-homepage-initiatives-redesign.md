# Homepage Initiatives Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the president and online-library promos from the homepage and replace the current project grid with a modern light editorial mosaic.

**Architecture:** Keep the existing static HTML/CSS build and project routes. Update only homepage markup and styles, reuse local project assets, and lock the behavior with Node tests before rebuilding `dist`.

**Tech Stack:** Static HTML, CSS, Node.js `node:test`, existing build scripts, Playwright visual checks.

**Spec:** `docs/superpowers/specs/2026-11-12-homepage-initiatives-redesign.md`

## Global Constraints

- Hero map and all non-requested homepage sections remain unchanged.
- Leadership and media pages remain published; only their homepage promos are removed.
- The initiatives section uses the existing federal-modern palette and local project assets.
- No new runtime dependencies.
- Mobile must work at 320px without horizontal overflow or clipped copy.

## Review Focus

- Removing `#media` must not leave homepage navigation pointing to a missing anchor; navigation must use `/media/`.
- Every initiative tile must be one accessible link with a meaningful label.
- Missing dedicated artwork for “Новые горизонты” must render as an intentional designed card, not a broken image or blank placeholder.
- Long Russian project titles must remain readable at 320px without overflow.
- Existing project detail routes and `/projects/` catalogue access must remain valid.

---

### Task 1: Remove homepage-only promos and repair navigation

**Files:**
- Modify: `index.html`
- Test: `tests/homepage-hero.test.cjs`

**Interfaces:**
- Consumes: existing homepage section IDs and shared build shell.
- Produces: homepage without `.media` and `.official`; canonical `/media/` navigation links.

- [ ] **Step 1: Write the failing test**

Add assertions that homepage HTML contains neither `section.media` nor `section.official`, contains no “Слово президента ФЕНКА” or “Онлайн-библиотека”, and all header media links use `/media/` rather than `/#media`.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL on the new removal and route assertions.

- [ ] **Step 3: Remove the two sections and update media links**

Delete the homepage `<section class="section media" id="media">…</section>` and `<section class="section official">…</section>` blocks from `index.html`; update desktop and mobile media navigation to `/media/`.

- [ ] **Step 4: Run the focused test and verify success**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: PASS.

### Task 2: Build the editorial initiatives mosaic

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Test: `tests/homepage-hero.test.cjs`

**Interfaces:**
- Consumes: `/assets/projects/kod-naslediya.jpg`, `/assets/projects/kulturnyj-otdel.webp`, `/assets/projects/festival-evrejskoj-muzyki.webp` and existing project routes.
- Produces: `.initiative-grid` containing four fully clickable `.initiative-card` links and responsive modifier classes.

- [ ] **Step 1: Write the failing structural and styling tests**

Assert four `.initiative-card` anchors, one `.initiative-card--lead`, local artwork references for three supplied covers, a deliberate `.initiative-art--horizons` treatment, full-card links, responsive two-column and one-column breakpoints, visible `:focus-visible`, and hover transforms restricted to hover-capable devices.

- [ ] **Step 2: Run the focused test and verify failure**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: FAIL because the editorial mosaic does not exist.

- [ ] **Step 3: Replace the old project-card markup**

Create four anchor cards for “Код наследия”, “Культурный отдел ФЕНКА”, “Новые горизонты”, and “Фестиваль еврейской музыки в Казани”. Keep the section heading and `/projects/` catalogue link, use semantic headings, categories, summaries, and an arrow affordance inside each link.

- [ ] **Step 4: Add the federal-modern editorial styling**

Use an ice-gray section background, a 12-column asymmetric desktop grid, image-cover backgrounds, navy readability gradients, restrained red metadata, and a CSS-generated network composition for “Новые горизонты”. At 900px use two columns; at 640px use one column with fixed minimum card heights and no horizontal overflow.

- [ ] **Step 5: Run focused tests and verify success**

Run: `node --test tests/homepage-hero.test.cjs`

Expected: PASS.

### Task 3: Build, verify, and publish

**Files:**
- Modify: `dist/index.html` (generated)
- Modify: `dist/style.css` (generated)

**Interfaces:**
- Consumes: updated source homepage and CSS.
- Produces: verified static distribution and deployed GitHub Pages build.

- [ ] **Step 1: Rebuild the static distribution**

Run: `node scripts/build-site.cjs`

Expected: exit code 0 and updated `dist/index.html` / `dist/style.css`.

- [ ] **Step 2: Run the complete regression suite**

Run: `node --test tests/*.test.cjs`

Expected: all tests pass.

- [ ] **Step 3: Perform desktop and mobile visual checks**

Capture the initiatives section at 1440×900, 390×844, and 320×844. Verify image hierarchy, readable titles, keyboard focus, no horizontal overflow, and that the removed sections are absent.

- [ ] **Step 4: Commit source, tests, generated distribution, spec, and plan**

Commit message: `feat: redesign homepage initiatives`

- [ ] **Step 5: Push `main`, publish `dist` to `gh-pages`, and verify the live domain**

Expected: GitHub Pages deployment succeeds and `https://www.fenka-rus.ru/` displays the new initiatives mosaic without the two removed homepage sections.
