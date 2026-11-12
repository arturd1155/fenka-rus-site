# Mobile Homepage Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inaccurate mobile raster map with a full-bleed portrait background and an accurate vector Russia layer.

**Architecture:** Keep the desktop hero unchanged. Add a mobile-only background asset and a vector geography layer, then align existing markers/network to that layer with CSS and mobile coordinate data. Copy both assets during the existing static build.

**Tech Stack:** HTML, CSS, vanilla JavaScript, SVG, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-12-mobile-homepage-map-design.md`

## Global Constraints

- Only the homepage mobile hero changes.
- `/regions/` remains unchanged.
- No continuous expensive mobile animation.
- New asset URLs are cache-busted.

## Review Focus

- 320–720 px portrait viewports must not show empty hero bands.
- The vector map must preserve its aspect ratio and complete outline.
- Mobile marker coordinates must share the map overlay coordinate system.
- Desktop rendering must keep the approved wide artwork.
- The static build must include both new assets.

---

### Task 1: Mobile map contract

**Files:**
- Modify: `tests/homepage-hero.test.cjs`

- [ ] Add failing tests for a mobile background picture, vector map layer, full-bleed mobile sizing, cache-busting, and build output.
- [ ] Run the focused test and confirm the new assertions fail for missing behavior.

### Task 2: Responsive hero implementation

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `app.js`
- Modify: `scripts/build-site.cjs`
- Create: `homepage-regions-mobile.png`
- Create: `homepage-russia-regions.svg`

- [ ] Add the mobile source and vector map overlay.
- [ ] Add mobile-only full-bleed layout and aligned marker/network coordinates.
- [ ] Copy new assets in the production build.
- [ ] Run focused tests and confirm success.

### Task 3: Build, visual verification and publish

**Files:**
- Generated: `dist/*`

- [ ] Build the site.
- [ ] Run the full test suite with zero failures.
- [ ] Verify 390×844 and 320×844 screenshots have no empty hero bands or horizontal overflow.
- [ ] Confirm `/regions/` is unchanged.
- [ ] Publish the `dist` tree and verify the live mobile page.
