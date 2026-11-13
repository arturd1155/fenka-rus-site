# Directions Federal Panorama Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the homepage “Направления работы” presentation with the approved dark “Федеральная панорама” while preserving all six links and all adjacent homepage sections.

**Architecture:** Keep the existing semantic section and link destinations, add section-specific modifier classes in `index.html`, and append an isolated CSS component in `style.css`. Rebuild `dist` with the existing build script; no JavaScript, image, navigation, or data changes are required.

**Tech Stack:** Static HTML, CSS, Node.js test runner, existing site build script.

**Spec:** `docs/superpowers/specs/2026-11-13-directions-federal-panorama-design.md`

## Global Constraints

- Change only the homepage “Направления работы” block and its compiled `dist` output.
- Preserve all six direction names, descriptions, link destinations, and their order.
- Use a 3 × 2 desktop grid, 2-column tablet grid, and 1-column phone grid.
- Use deep blue, red, white, and light-gray from the existing FENKA design system.
- Add no continuous or expensive animation; hover/focus movement must respect `prefers-reduced-motion`.
- Do not modify the hero/map, “Что такое ФЕНКА”, “Инициативы ФЕНКА”, or any other page.

## Review Focus

- At 320px, every direction description remains visible and no horizontal overflow appears.
- Keyboard focus is clearly visible on every direction link.
- Touch devices do not rely on hover to reveal essential text or navigation.
- Reduced-motion mode removes movement while keeping color feedback.
- Build output contains the same six URLs and no placeholder links.

---

### Task 1: Homepage directions federal panorama

**Files:**
- Modify: `index.html:80-90`
- Modify: `style.css` in a new isolated “Federal panorama directions” block
- Modify: `tests/homepage-hero.test.cjs`
- Generated: `dist/index.html`
- Generated: `dist/style.css`

**Interfaces:**
- Consumes: the existing `.directions`, `.section-heading`, and `.direction-list` homepage structure and the site’s CSS variables.
- Produces: `.directions--federal`, `.directions-heading`, and `.direction-grid` presentation hooks with unchanged link URLs.

- [ ] **Step 1: Write the failing regression test**

Add a test named `homepage directions use the approved federal panorama without changing destinations` to `tests/homepage-hero.test.cjs`. Assert that:

- the homepage section has `directions directions--federal`;
- the heading contains `Сохраняем наследие` and `Создаём будущее`;
- exactly six `direction-card` links exist;
- URLs remain `/projects/`, `/projects/`, `/regions/`, `/youth/`, `/support/`, `/about/` in that order;
- CSS includes a 3-column `.direction-grid`, 2-column tablet fallback, 1-column phone fallback, `:focus-visible`, and a reduced-motion rule;
- `dist/index.html` is not asserted until the build step.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test --test-name-pattern="homepage directions use the approved federal panorama" tests/homepage-hero.test.cjs`

Expected: FAIL because `.directions--federal` and `.direction-grid` are not present.

- [ ] **Step 3: Implement the approved markup in `index.html`**

Keep the six existing anchors and destinations. Add the section modifier, the approved title “Сохраняем наследие. Создаём будущее.”, a dedicated heading class, card classes, and presentational arrow spans hidden from assistive technology. Do not change any adjacent section markup.

- [ ] **Step 4: Implement the isolated component styles in `style.css`**

Create the deep-blue section, restrained atmospheric background, 3 × 2 link grid, red numbering, white/light-gray typography, fine separators, hover/focus treatment, tablet and phone layouts, and reduced-motion fallback. Essential content must remain visible without hover.

- [ ] **Step 5: Run the focused test and confirm GREEN**

Run: `node --test --test-name-pattern="homepage directions use the approved federal panorama" tests/homepage-hero.test.cjs`

Expected: PASS.

- [ ] **Step 6: Build the distribution**

Run: `node scripts/build-site.cjs`

Expected: exit code 0; only the homepage and shared style output reflect the source change.

- [ ] **Step 7: Run the complete test suite**

Run: `node --test tests/*.test.cjs`

Expected: all tests pass.

- [ ] **Step 8: Verify in a real browser**

Check `dist/index.html` at 1440 × 900, 768 × 900, 390 × 844, and 320 × 844. Confirm no horizontal overflow, all descriptions are visible, all six cards are keyboard reachable, links point to the original routes, and reduced-motion mode disables movement.

- [ ] **Step 9: Verify the allowlist and commit**

Confirm product changes are limited to `index.html`, `style.css`, `dist/index.html`, `dist/style.css`, and the focused test. Commit with:

```bash
git add index.html style.css dist/index.html dist/style.css tests/homepage-hero.test.cjs docs/superpowers/specs/2026-11-13-directions-federal-panorama-design.md docs/superpowers/plans/2026-11-13-directions-federal-panorama.md
git commit -m "feat: modernize homepage directions"
```

