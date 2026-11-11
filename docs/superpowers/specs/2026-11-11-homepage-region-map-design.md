# Homepage Region Map Design

## Intent

Replace only the decorative Russia map in the homepage hero with the supplied `карта.PNG`, then add correctly positioned clickable regional markers. Preserve the separate `/regions/` page exactly as it is.

## Requirements

- Use the supplied image as the homepage hero map without cropping important content.
- Remove the existing six decorative dots and connecting lines.
- Overlay data-driven markers using percentage coordinates so positions remain aligned across responsive sizes.
- Show a region name on hover, keyboard focus, and touch interaction.
- Every marker links to `/regions/`.
- Keep markers usable and visually clear on mobile screens.
- Do not modify `regions-interactive.html`, the `/regions/` build output, or regional map behaviour.

## Approach

Use an HTML marker layer positioned over the new raster image. Generate accessible anchor elements from homepage-only data in `app.js`; position them with percentage-based `left` and `top` values. This is preferable to baking dots into the image because labels, keyboard access, links, and responsive hit areas remain available.

## Non goals

- No redesign of the `/regions/` page.
- No changes to regional cards, filters, district navigation, or regional data.
- No deep-linking changes on the `/regions/` page.

