# Content Pages Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Очистить служебные страницы ФЕНКА от внутренних подписей и привести их отступы к единой аккуратной системе.

**Architecture:** Отдельный post-build‑модуль обрабатывает только семь целевых маршрутов, добавляет им классы страниц и локальный CSS. Разметка `/about/` очищается в собственном шаблоне, чтобы изменения сохранялись после любой сборки.

**Tech Stack:** Node.js, статический HTML, CSS, `node:test`.

**Spec:** `docs/superpowers/specs/2026-11-14-content-cleanup-design.md`

## Global Constraints

- Не изменять тексты документов, отчётов, контактов и политики.
- Не затрагивать главную, регионы, проекты, новости, медиатеку и «МолДеп».
- Сохранять существующую федеральную сине-бело-красную дизайн-систему.
- Все изменения должны воспроизводиться командой `node scripts/build-site.cjs`.

## Review Focus

- Повторная сборка не должна возвращать удалённые подписи.
- Удаление счётчиков не должно удалять карточки или их заголовки.
- Локальный CSS должен подключаться только к целевым страницам.
- Мобильные отступы не должны создавать горизонтальное переполнение.
- Юридическая нумерация внутри текста политики должна сохраниться.

---

### Task 1: Clean content pages and normalize spacing

**Files:**
- Create: `tests/content-polish.test.cjs`
- Create: `scripts/build-content-polish.cjs`
- Create: `shared/content-polish.css`
- Modify: `scripts/build-site.cjs`
- Modify: `site/about-content.cjs`
- Modify: `shared/about.css`
- Generate: `dist/shared/content-polish.css`
- Generate: `dist/{about,reports,privacy,events,support,documents,contacts}/index.html`

**Interfaces:**
- Consumes: HTML страниц, созданный `scripts/build-site.cjs` и `scripts/build-about-hook.cjs`.
- Produces: `buildContentPolish()` как синхронный post-build‑шаг, локальные классы `page-*` и CSS для целевых маршрутов.

- [ ] **Step 1: Write the failing integration test**

Проверить итоговые HTML после сборки: запрещённые подписи отсутствуют, счётчики в двух блоках `/about/` удалены, юридическая нумерация сохранена, все целевые страницы подключают локальные стили и классы.

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test tests/content-polish.test.cjs`
Expected: FAIL на старых служебных подписях и отсутствующем `content-polish.css`.

- [ ] **Step 3: Implement the isolated build cleanup and CSS**

Добавить post-build‑модуль, подключить его после существующих хуков, очистить отдельный шаблон `/about/` и применить адаптивную шкалу отступов только к целевым страницам.

- [ ] **Step 4: Run focused and full verification**

Run: `node scripts/build-site.cjs` затем `node --test tests/content-polish.test.cjs tests/site-sections.test.cjs`.
Expected: все проверки PASS.

- [ ] **Step 5: Perform desktop and mobile visual QA**

Проверить `/about/`, `/documents/`, `/reports/`, `/privacy/`, `/contacts/` на 1440px и 500px; запрещённых подписей нет, отступы ровные, горизонтального переполнения нет.

- [ ] **Step 6: Commit**

Commit message: `fix: polish institutional content pages`.
