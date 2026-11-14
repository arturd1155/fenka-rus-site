# Youth Department Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Наполнить страницу Молодёжного департамента ФЕНКА проверенным содержанием, командой, пятью проектами и рабочей заявкой на участие.

**Architecture:** Существующий статический маршрут `/youth/` остаётся изолированным. Разметка хранится в `site/youth-page.html`, стили и поведение — в `shared/youth.css` и `shared/youth.js`, локальные фотографии копируются сборщиком в `dist/assets/youth/`; заявка формирует подготовленное письмо без стороннего сервиса.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js build scripts and test runner.

**Spec:** `docs/superpowers/specs/2026-11-14-youth-department-content-design.md`

## Global Constraints

- Изменять только страницу МолДепа и её ресурсы.
- Не публиковать внутренний бюджет и неподтверждённые показатели.
- Не использовать сторонний обработчик персональных данных без согласования.
- Поддержать ширину 320px, клавиатуру и `prefers-reduced-motion`.

## Review Focus

- Выбор проекта должен автоматически попадать в заявку.
- Пустые обязательные поля не должны открывать почтовое приложение.
- Длинные названия проектов не должны ломать мобильную сетку.
- Фотографии команды должны иметь размеры, alt-тексты и ленивую загрузку.
- Повторный запуск сборщика не должен дублировать подключения CSS/JS.

---

### Task 1: Public content contract

**Files:**
- Modify: `tests/youth-page.test.cjs`
- Modify: `site/youth-page.html`

- [ ] Добавить падающие проверки команды, пяти проектов и формы участия.
- [ ] Запустить тест и подтвердить RED.
- [ ] Добавить семантическую разметку и подтверждённые тексты.
- [ ] Запустить тест и подтвердить GREEN.

### Task 2: Team assets and isolated build

**Files:**
- Create: `site-assets/youth/evgeniya-polyanina.jpg`
- Create: `site-assets/youth/mirra-fleys.jpg`
- Modify: `scripts/build-youth-page.cjs`
- Publish: `dist/assets/youth/*`

- [ ] Добавить проверки локальных ресурсов и идемпотентной сборки.
- [ ] Запустить тест и подтвердить RED.
- [ ] Скопировать фотографии и обновить сборщик.
- [ ] Запустить сборку дважды и подтвердить отсутствие дублей.

### Task 3: Responsive visual system and application flow

**Files:**
- Modify: `shared/youth.css`
- Modify: `shared/youth.js`

- [ ] Добавить проверки мобильного контракта, формы и выбора проекта.
- [ ] Запустить тест и подтвердить RED.
- [ ] Реализовать сетки, карточки, диалог формы, валидацию и подготовку письма.
- [ ] Проверить клавиатуру, reduced motion и экраны 320px/390px/desktop.

### Task 4: Verification and publication

**Files:**
- Verify: `dist/youth/index.html`
- Verify: `dist/shared/youth.css`
- Verify: `dist/shared/youth.js`
- Verify: `dist/assets/youth/*`

- [ ] Запустить youth-тесты и полный набор тестов.
- [ ] Визуально проверить desktop и mobile.
- [ ] Проверить diff и опубликовать только youth-файлы и их источники.
