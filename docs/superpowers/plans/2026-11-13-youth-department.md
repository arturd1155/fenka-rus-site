# Youth Department Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать адаптивную имиджевую страницу Молодёжного департамента ФЕНКА по утверждённому референсу.

**Architecture:** Сборщик продолжает генерировать `/youth/`, но получает отдельную разметку и подключает изолированные `youth.css` и `youth.js`. Hero использует локальный оптимизированный JPEG; остальной сайт использует прежние общие стили и скрипты без изменений.

**Tech Stack:** Статические HTML/CSS/JavaScript, Node.js-сборка, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-13-youth-department-design.md`

## Global Constraints

- Менять только `/youth/` и связанные с ним новые ресурсы.
- Не публиковать цифры и неподтверждённые показатели.
- Сохранить федеральную палитру ФЕНКА и общую шапку/подвал.
- Поддержать экран шириной от 320px и `prefers-reduced-motion`.

## Review Focus

- Мобильный экран 320–390px: без обрезанного текста и горизонтальной прокрутки.
- Hero-фотография: лица остаются различимы на мобильном и десктопном кадрировании.
- Навигационные панели: реальные якоря, клавиатурный фокус и touch-target не меньше 44px.
- Сборка: новые CSS/JS/изображение попадают в `dist`.
- Изоляция: остальные страницы не получают youth-стили.

---

### Task 1: Контракт страницы и сборки

**Files:**
- Modify: `tests/site-sections.test.cjs`
- Modify: `scripts/build-site.cjs`

**Interfaces:**
- Produces: HTML `/youth/` с `.youth-landing`, пятью якорными панелями и четырьмя направлениями.

- [ ] Добавить тест разметки, локальных ресурсов, отсутствия нумерации и мобильного контракта.
- [ ] Запустить тест и подтвердить RED.
- [ ] Обновить генератор страницы и подключение ресурсов.
- [ ] Запустить тест и подтвердить GREEN.

### Task 2: Фирменный визуальный слой

**Files:**
- Create: `shared/youth.css`
- Create: `shared/youth.js`
- Create: `site-assets/youth/youth-hero.jpg`
- Modify: `scripts/build-site.cjs`

**Interfaces:**
- Consumes: классы и якоря Task 1.
- Produces: адаптивный hero, наклонные панели, reveal-анимацию с reduced-motion fallback.

- [ ] Добавить проверки наличия адаптивных правил и reduced-motion.
- [ ] Запустить тест и подтвердить RED.
- [ ] Реализовать стили, анимацию и локальный фон.
- [ ] Собрать сайт и подтвердить GREEN.

### Task 3: Визуальная и регрессионная проверка

**Files:**
- Verify: `dist/youth/index.html`
- Verify: `dist/shared/youth.css`
- Verify: `dist/shared/youth.js`
- Verify: `dist/assets/youth/youth-hero.jpg`

- [ ] Проверить десктопный и мобильный viewport.
- [ ] Запустить полный набор тестов и сборку.
- [ ] Проверить diff: в публикацию входят только youth-страница и её ресурсы.

