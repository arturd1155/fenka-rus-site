# Project CTA and Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace incorrect project buttons with the approved direct links, removals, support actions, and embedded application forms that send to `info@fenkar.ru` without opening a mail client.

**Architecture:** Keep project content in the existing `site/project-briefs.cjs` and `site/flagship-projects.cjs` data sources, extending action tuples with optional form intent metadata. The project builder renders links, forms, and script references into `dist`; shared `mail-forms.js` performs FormSubmit delivery while a small project-only controller handles intent preselection and focus.

**Tech Stack:** CommonJS, Node.js built-in test runner, static HTML/CSS/JavaScript, FormSubmit AJAX endpoint.

**Spec:** `docs/superpowers/specs/2026-11-15-project-cta-and-forms-design.md`

## Global Constraints

- Preserve existing project text, covers, and flagship layout except for the explicitly approved actions and new forms.
- Send every project application to activated recipient `info@fenkar.ru` with subject `Заявка с сайта ФЕНКА — <название проекта>`.
- Never use `mailto:` for the newly configured project application actions.
- External destinations open with `target="_blank" rel="noopener noreferrer"` and a visible external-link cue.
- A project with form actions renders one form only; multiple actions preselect an editable request type.
- A support-only project exposes exactly one visible `Поддержать проект` link to `/support/`.
- Build generated pages from source; do not hand-edit `dist/projects/**`.
- Preserve unrelated changes already present in the dirty worktree.

## Review Focus

- An unchecked privacy checkbox must prevent submission and must never produce a false success message — pinned in Task 1.
- A checkbox that is checked must be represented in the FormSubmit payload as `Подтверждено` — pinned in Task 1.
- A project with two form CTAs must preselect the clicked intent while still allowing the user to change it — pinned in Task 3.
- An external link must not lose its `noopener noreferrer` protection or external cue — pinned in Task 2.
- A failed or repeated network request must leave a clear status and prevent duplicate submission while pending — pinned in Task 1.

---

### Task 1: Extend the shared background sender for consent fields

**Files:**
- Modify: `mail-forms.js`
- Modify: `tests/mail-forms.test.cjs`

**Interfaces:**
- Consumes: existing `bindMailForms(doc, submitter)` and `submitToInbox(options, request)`.
- Produces: checkbox serialization in `bindMailForms`: checked named checkboxes become `[mail label, "Подтверждено"]`; unchecked required checkboxes remain blocked by `reportValidity()`.

- [ ] **Step 1: Write failing sender tests**

Add tests that bind a synthetic form and assert:

- a checked required consent checkbox is sent as `['Согласие на обработку данных', 'Подтверждено']`;
- an invalid form does not call the submitter;
- a second submit while `data-sending="true"` does not create another request;
- a rejected request restores the button and shows the existing failure copy with `info@fenkar.ru`.

- [ ] **Step 2: Run the focused tests and verify the new checkbox test fails**

Run: `node --test tests/mail-forms.test.cjs`

Expected: FAIL because `bindMailForms` currently excludes every checkbox from `fields`.

- [ ] **Step 3: Implement checkbox serialization in `bindMailForms(doc, submitter)`**

Keep the current recipient guard, loading state, duplicate-send guard, reset, and error copy. Include named checkboxes only when checked, using `element.dataset.mailValue || 'Подтверждено'`; continue excluding submit buttons.

- [ ] **Step 4: Run the focused tests**

Run: `node --test tests/mail-forms.test.cjs`

Expected: all sender tests PASS.

- [ ] **Step 5: Commit only the sender change**

```bash
git add mail-forms.js tests/mail-forms.test.cjs
git commit -m "feat: include consent in project form delivery"
```

### Task 2: Encode the approved project action map and render forms

**Files:**
- Modify: `site/project-briefs.cjs`
- Modify: `site/flagship-projects.cjs`
- Modify: `scripts/build-projects-hook.cjs`
- Create: `tests/project-actions.test.cjs`
- Modify: `tests/site-sections.test.cjs`

**Interfaces:**
- Consumes: existing action tuple `[label, description, href]`.
- Produces: optional fourth tuple item `{interest?: string, external?: boolean}`; `href: '#project-application'` denotes a form CTA and `interest` is the exact request type.
- Produces: `renderAction(action)` with protected external-link attributes and `data-project-interest` for form CTAs.
- Produces: `renderProjectForm(project)` returning one form or an empty string when no form CTA exists.

- [ ] **Step 1: Write the failing action-map tests**

Create `tests/project-actions.test.cjs` with a once-per-file build setup (`execFileSync(process.execPath, ['scripts/build-site.cjs'])`) and assertions for the complete approved map:

- Kinoclub `/events/` plus `Стать участником` form.
- Shalom without `Познакомиться с игрой`, with `Получить игру` form.
- Synagogues `/media/heritage/#sinagogi` plus `Предложить историю` form.
- Onko-stop without grant CTA, with program form.
- Care, festival, memory, youth forum, cultural department, and New Horizons form actions exactly as specified.
- Fishki YouTube and festival VK links with `target`, `rel`, and external cue.
- Litsa Rossii XXI both Yandex Disk actions and no `Узнать о проекте`.
- Every support-only slug has no upper action grid and exactly one `/support/` CTA.
- The selected application pages contain no `mailto:` CTA.

- [ ] **Step 2: Update stale expectations in the existing project tests**

Replace assertions that require removed labels (`Познакомиться с игрой`, `Записать ребёнка`, `Присоединиться к занятиям`, etc.) with stable content assertions and the new approved action labels. Keep cover, catalogue, and flagship-layout assertions unchanged.

- [ ] **Step 3: Run the project tests and verify they fail for the old action map**

Run: `node --test tests/project-actions.test.cjs tests/site-sections.test.cjs`

Expected: the new action-map tests FAIL on old `mailto:` links, removed-label expectations, and missing forms. Record any pre-existing unrelated regional portrait failure separately.

- [ ] **Step 4: Update the two project data files**

Apply the exact button map from the spec. Use `#project-application` plus exact Russian `interest` values for application actions; use the supplied YouTube, VK, and Yandex Disk URLs unchanged. Set upper `actions: []` for support-only flagship projects so the existing lower support section is the sole CTA.

- [ ] **Step 5: Add renderer helpers and form markup**

In `scripts/build-projects-hook.cjs`:

- escape labels, URLs, and data attributes;
- render external links with `target="_blank" rel="noopener noreferrer"` and `↗` cue;
- render one `<section class="project-application" id="project-application">` only when form CTAs exist;
- render required `fullName`, `location`, `contact`, optional `comment`, required privacy checkbox, hidden project field, and `aria-live` status;
- render a required editable `interest` `<select>` only for multiple intents, otherwise a hidden `interest` input;
- set `data-mail-recipient="info@fenkar.ru"` and exact project-specific subject;
- show `info@fenkar.ru` below the form as the non-JavaScript and delivery-error fallback, without using a `mailto:` form action;
- include `/mail-forms.js` and `/shared/project-forms.js` only on generated project pages.

- [ ] **Step 6: Run the action-map tests**

Run: `node --test tests/project-actions.test.cjs`

Expected: all action-map, form-markup, support-count, and external-link tests PASS.

- [ ] **Step 7: Commit the data and renderer change**

```bash
git add site/project-briefs.cjs site/flagship-projects.cjs scripts/build-projects-hook.cjs tests/project-actions.test.cjs tests/site-sections.test.cjs
git commit -m "feat: configure project actions and application forms"
```

### Task 3: Add intent preselection, focus handling, and responsive form styling

**Files:**
- Create: `shared/project-forms.js`
- Modify: `shared/heritage-project.css`
- Modify: `scripts/build-projects-hook.cjs`
- Create: `tests/project-forms.test.cjs`
- Modify: `tests/project-actions.test.cjs`

**Interfaces:**
- Consumes: anchors with `data-project-interest` and form control `[name="interest"]` inside `#project-application`.
- Produces: `bindProjectForms(doc)`; clicking an intent CTA sets the matching select value and focuses the form heading after navigation.
- Produces: project form CSS classes under `.project-application*`, with two columns above 820px and one column at 820px and below.

- [ ] **Step 1: Write failing controller and asset tests**

Add tests asserting:

- `bindProjectForms(doc)` selects the clicked interest but leaves the control editable;
- an unknown interest does not overwrite the current value;
- the form heading receives programmatic focus without scrolling twice;
- the build copies `shared/project-forms.js` to `dist/shared/project-forms.js` and generated form pages load it;
- the CSS contains the required desktop grid, mobile single-column rule, visible `:focus-visible`, status, disabled-button, and error/success state selectors.

- [ ] **Step 2: Run the focused tests and verify missing-controller failures**

Run: `node --test tests/project-forms.test.cjs tests/project-actions.test.cjs`

Expected: FAIL because the controller and form styles do not yet exist.

- [ ] **Step 3: Implement `bindProjectForms(doc)` in a UMD-style browser/CommonJS module**

Follow the export pattern in `mail-forms.js`. Bind only once per CTA, set the select when the option exists, and focus `#project-application-title` in a zero-delay callback after the anchor updates the hash.

- [ ] **Step 4: Copy and load the controller from the project builder**

Have `scripts/build-projects-hook.cjs` copy the source controller into `dist/shared/` alongside project styles and include a cache-busted script reference after `mail-forms.js` on project pages.

- [ ] **Step 5: Add responsive, accessible form styles**

Use the existing navy, red, cream, and gold project tokens. Short fields use two columns on wide screens; interest, comment, consent, status, fallback email, and submit action span both columns. At mobile width, all controls stack without horizontal overflow.

- [ ] **Step 6: Run the focused tests**

Run: `node --test tests/project-forms.test.cjs tests/project-actions.test.cjs tests/mail-forms.test.cjs`

Expected: all focused tests PASS.

- [ ] **Step 7: Commit the controller and styles**

```bash
git add shared/project-forms.js shared/heritage-project.css scripts/build-projects-hook.cjs tests/project-forms.test.cjs tests/project-actions.test.cjs
git commit -m "feat: add accessible project application interactions"
```

### Task 4: Build, verify, and visually inspect the complete project flow

**Files:**
- Generated: `dist/projects/**/index.html`
- Generated: `dist/shared/heritage-project.css`
- Generated: `dist/shared/project-forms.js`
- Generated: `dist/mail-forms.js`
- Verify: all files changed by Tasks 1–3.

**Interfaces:**
- Consumes: source data, renderer, sender, controller, and styles from prior tasks.
- Produces: a rebuilt static site ready for publication review.

- [ ] **Step 1: Rebuild from source**

Run: `node scripts/build-site.cjs`

Expected: exit code 0 and all affected project pages regenerated.

- [ ] **Step 2: Run the focused project and mail suites**

Run: `node --test tests/project-actions.test.cjs tests/project-forms.test.cjs tests/mail-forms.test.cjs`

Expected: all tests PASS.

- [ ] **Step 3: Run the full repository tests**

Run: `node --test tests/*.test.cjs`

Expected: all relevant tests PASS; if the known unrelated regional portrait test still fails, record its exact test name and confirm it is unchanged from baseline.

- [ ] **Step 4: Inspect representative desktop and mobile pages**

Check at least Kinoclub (single intent), Care or New Horizons (multiple intents), Fishki (external link), Litsa Rossii XXI (two direct links), and one support-only project. Verify no overflow, one form per page, preselection, keyboard focus, and one support CTA where required.

- [ ] **Step 5: Perform one real activated-inbox delivery check**

Submit a clearly labelled test request from one project page and verify the UI success state. Ask the owner to confirm that the message arrived at `info@fenkar.ru`; do not submit personal data.

- [ ] **Step 6: Review the final diff without staging unrelated worktree changes**

Run: `git status --short` and `git diff --check`

Expected: no whitespace errors; only task-owned source/tests plus generated project assets are candidates for publication.

- [ ] **Step 7: Commit the verified generated output if the repository tracks `dist`**

Stage only generated files changed by this feature, then commit:

```bash
git commit -m "build: publish project application flows"
```

Do not push or deploy until the user explicitly authorizes publication of this CTA/form batch.
