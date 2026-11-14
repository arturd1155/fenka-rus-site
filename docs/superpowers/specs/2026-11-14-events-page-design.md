# Events Page Design

## Intent

Turn the `/events/` placeholder into a polished FENKA film-program archive that makes dates, places, screening times and film context easy to scan for a broad audience.

## Goals

- Publish the five unique supplied film entries, removing the duplicated Shenkman item.
- Normalize copy, punctuation, names, dates, times and addresses without inventing missing facts.
- Present the 2026 program and the 2025 archive in a modern editorial layout consistent with the existing federal-modern navy, white and red palette.
- Reserve a stable 4:5 poster area for each event so approved artwork can be inserted later without redesigning cards.
- Keep long film descriptions readable in native expandable sections and make the page work from 320px upward.

## Non-goals

- Do not change other sections, the global navigation, or the homepage event teaser.
- Do not publish the supplied poster files yet; this pass uses branded placeholders.
- Do not add registration forms or fabricate missing start times.

## Approach

Use a dedicated post-build hook, a focused data/render module and an events-only stylesheet. This follows the existing About and Youth page pattern while isolating the change from the large general site generator. The alternative of editing the monolithic generator was rejected because it would unnecessarily risk unrelated pages; a client-side data application was rejected because the content is static and should remain available without JavaScript.

## Content structure

- Event-specific hero introducing the FENKA film program.
- 2026 program: “Образ еврея в советском кино”, “Шенкман. Последний полёт”, “Каруза”.
- 2025 archive: “Бимбат. Жизнь над землёй”, “Из ада в ад”.
- Each card contains a 4:5 poster placeholder, genre label, semantic date/time, location, concise introduction and expandable full description.
- The two-part “Образ еврея в советском кино” event shows both dates and both historical periods in one card.

