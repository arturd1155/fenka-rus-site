# Homepage Region Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero map with the supplied image and add accurately positioned, accessible regional markers without changing the `/regions/` page.

**Architecture:** The homepage owns a dedicated image asset and a marker overlay generated from homepage-only region coordinate data. Percentage coordinates keep markers aligned with the image; every marker is an accessible link to `/regions/` with a visible tooltip.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node test runner and existing build scripts.

**Spec:** `docs/superpowers/specs/2026-11-11-homepage-region-map-design.md`

## Global Constraints

- Change only the homepage hero implementation and its copied assets.
- Do not modify `regions-interactive.html` or the built `/regions/` page.
- Use `карта.PNG` as the new homepage visual.
- All markers link to `/regions/` and expose the region name.
- Preserve keyboard, touch and reduced-motion usability.

## Review Focus

- Marker coordinates must remain aligned when the hero image scales.
- Labels must not be clipped at the image edges.
- Mobile hit targets must be large enough without obscuring the visual.
- The old six-dot decorative overlay must be absent.
- The `/regions/` output must remain byte-for-byte unchanged by the source edits except for normal build regeneration outside this feature.

---

### Task 1: Homepage map contract

**Files:**
- Modify: `tests/homepage.test.cjs`
- Test: `tests/homepage.test.cjs`

**Interfaces:**
- Consumes: built `dist/index.html`, `dist/style.css`, `dist/app.js`, and the `/regions/` source/output.
- Produces: regression tests for the new asset, marker layer, links, accessibility labels, responsive styling, and unchanged regional page source.

- [ ] **Step 1: Write failing tests for the new homepage asset and marker overlay**
- [ ] **Step 2: Run the focused tests and verify they fail because the old visual is still present**
- [ ] **Step 3: Commit the test contract with the implementation in Task 2**

### Task 2: Responsive regional marker layer

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`
- Modify: `scripts/build-site.cjs`
- Create: `homepage-regions-map.png`
- Modify: `dist/index.html`
- Modify: `dist/style.css`
- Modify: `dist/app.js`
- Create: `dist/homepage-regions-map.png`

**Interfaces:**
- Consumes: homepage region records shaped as `{name, x, y}` with percentage coordinates.
- Produces: `.hero-region-markers` containing accessible links `.hero-region-marker` pointing to `/regions/`.

- [ ] **Step 1: Copy the supplied image to the dedicated homepage asset path**
- [ ] **Step 2: Replace the old hero visual markup with the image and marker-layer container**
- [ ] **Step 3: Add the homepage-only coordinate data and marker renderer in `app.js`**
- [ ] **Step 4: Add responsive marker, tooltip, focus and mobile styles**
- [ ] **Step 5: Update the build copy list for the new asset**
- [ ] **Step 6: Build and run the focused tests until they pass**

### Task 3: Verification and publication

**Files:**
- Verify: `dist/index.html`
- Verify unchanged: `dist/regions/index.html`

**Interfaces:**
- Consumes: completed homepage build.
- Produces: published homepage with a verified marker overlay and unchanged regional section.

- [ ] **Step 1: Run the complete test suite**
- [ ] **Step 2: Visually inspect desktop and mobile homepage views**
- [ ] **Step 3: Commit only the intended source, asset, test and build files**
- [ ] **Step 4: Deploy `dist` to `gh-pages` and wait for GitHub Pages success**
- [ ] **Step 5: Verify the live homepage asset, markers and `/regions/` page**

