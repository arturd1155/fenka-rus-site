# Homepage Full-Bleed Network Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the homepage map into a full-bleed hero background with a restrained animated federal network while preserving clickable regional markers.

**Architecture:** Keep the existing bitmap and marker data. Add a decorative SVG network layer inside the same percentage coordinate system, then use CSS to make the visual cover the sticky viewport and animate lines, pulses and nodes. The regions page remains untouched.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SVG, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-11-homepage-map-fullbleed-network-design.md`

## Global Constraints

- Only the homepage hero map changes; `/regions/` remains unchanged.
- Existing markers remain keyboard accessible and link to `/regions/`.
- Motion is disabled under `prefers-reduced-motion: reduce`.
- Mobile renders fewer network paths and keeps the focal handshake visible.

## Review Focus

- Wide and tall viewports must have no visible outer gutter around the image.
- SVG coordinates must share the marker layer's percentage coordinate system.
- Decorative paths must not intercept pointer or keyboard events.
- The text overlay must remain readable over bright image areas.
- Reduced-motion mode must remove all pulsing and traveling effects.

---

### Task 1: Full-Bleed Hero Contract

**Files:**
- Modify: `tests/homepage-hero.test.cjs`
- Modify: `style.css`

**Interfaces:**
- Produces: `.hero-map__visual` full viewport cover rules and responsive object positioning.

- [ ] Add failing assertions for viewport-sized visual, `object-fit: cover`, edge-to-edge inset and mobile object positioning.
- [ ] Run `node --test tests/homepage-hero.test.cjs` and verify failure.
- [ ] Implement the minimal full-bleed CSS and readability overlay.
- [ ] Run the focused tests and verify success.

### Task 2: Animated Federal Network

**Files:**
- Modify: `tests/homepage-hero.test.cjs`
- Modify: `index.html`
- Modify: `app.js`
- Modify: `style.css`

**Interfaces:**
- Produces: `#heroNetwork`, `.hero-network__line`, `.hero-network__pulse`, and the existing marker layer above them.

- [ ] Add failing assertions for an inert SVG layer, generated paths, line-draw/pulse animation, mobile path reduction and reduced-motion fallback.
- [ ] Run the focused test and verify failure.
- [ ] Add the SVG layer, render a restrained set of network connections from existing percentage coordinates, and implement CSS animations.
- [ ] Run focused tests and verify success.

### Task 3: Build and Publish

**Files:**
- Generated: `dist/index.html`
- Generated: `dist/app.js`
- Generated: `dist/style.css`

**Interfaces:**
- Consumes: homepage source files from Tasks 1–2.

- [ ] Run `node scripts/build-site.cjs`.
- [ ] Run `node --test tests/*.test.cjs` and require zero failures.
- [ ] Verify `git diff -- regions-interactive.html dist/regions/index.html` is empty.
- [ ] Commit only the intended homepage, test, plan, spec and generated files.
- [ ] Publish the `dist` subtree to `gh-pages` and verify the live HTML contains `heroNetwork` while `/regions/` still uses `fenka-regions-visual-clean.png`.
