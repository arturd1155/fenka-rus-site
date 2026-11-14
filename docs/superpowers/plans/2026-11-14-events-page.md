# FENKA Events Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Events page with a responsive, editorial FENKA film-program archive containing the five normalized supplied events.

**Architecture:** Keep the monolithic site generator untouched except for registering one dedicated post-build hook. Render events from a focused CommonJS content module, then replace only `/events/` main content and add an events-only stylesheet.

**Tech Stack:** Node.js CommonJS build scripts, static semantic HTML, CSS Grid/Flexbox, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-14-events-page-design.md`

## Global Constraints

- Change only the Events section and its build/test assets.
- Publish exactly five unique event cards; “Шенкман. Последний полёт” appears once.
- Do not invent missing event times or publish poster artwork in this pass.
- Poster placeholders use a stable 4:5 aspect ratio and remain easy to replace with images.
- Support 320px mobile screens, keyboard focus and reduced-motion preferences.

## Review Focus

- Duplicate source paragraphs must not create duplicate event cards.
- The two-part October event must preserve both dates and periods.
- Missing start time for the October event must remain absent rather than guessed.
- Long titles and addresses must wrap without horizontal overflow at 320px.
- Native disclosure controls must remain keyboard operable without JavaScript.

---

### Task 1: Events content and rendering

**Files:**
- Create: `site/events-content.cjs`
- Create: `tests/events-page.test.cjs`

**Interfaces:**
- Produces: `buildEventsMain(): string` and `events: Event[]` for the build hook.

- [ ] Write a failing build-output test for the five normalized events, unique Shenkman card, two October dates, supplied metadata and absent invented time.
- [ ] Run `node --test tests/events-page.test.cjs` and confirm failure.
- [ ] Implement the static event data and semantic HTML renderer.
- [ ] Run `node --test tests/events-page.test.cjs` and confirm the content assertions pass once the hook exists.

### Task 2: Isolated build hook and responsive styling

**Files:**
- Create: `scripts/build-events-page.cjs`
- Create: `shared/events.css`
- Modify: `scripts/build-site.cjs`
- Test: `tests/events-page.test.cjs`

**Interfaces:**
- Consumes: `buildEventsMain()` from Task 1.
- Produces: `dist/events/index.html` and `dist/shared/events.css`.

- [ ] Extend the failing test to require events-only body class, stylesheet, semantic times, disclosure controls, 4:5 poster slots and mobile/reduced-motion CSS.
- [ ] Register the hook immediately before the shared content-polish hook.
- [ ] Replace only the Events page `<main>` and copy the dedicated stylesheet during `beforeExit`.
- [ ] Implement the federal-modern editorial card layout, visible focus states and responsive single-column behavior.
- [ ] Run `node --test tests/events-page.test.cjs tests/site-sections.test.cjs` and confirm PASS.

### Task 3: Visual and regression verification

**Files:**
- Modify only if needed: `shared/events.css`, `site/events-content.cjs`

**Interfaces:**
- Consumes: built static Events page from Task 2.
- Produces: visually verified desktop and mobile output.

- [ ] Build with `node scripts/build-site.cjs`.
- [ ] Capture desktop and 390px mobile screenshots and inspect hierarchy, overflow, poster ratio and disclosure layout.
- [ ] Fix only Events-specific visual issues found.
- [ ] Run the focused tests and the full `node --test tests/*.test.cjs` suite.
- [ ] Stage only the Events feature files, commit, publish main and deploy the `dist` tree.
