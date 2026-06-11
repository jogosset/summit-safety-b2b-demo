# SS Product Cards Block

## Overview

A 4-column bestseller product grid for the Summit Safety homepage. Each card shows a colored image zone (with optional product photo via `createOptimizedPicture`), a badge, category label, product name, SKU description, price, and an "ADD →" button with a success-state animation.

## Integration

### Block Configuration

Reads N DA.live-authored table rows, 6 columns each:

| Column | Content |
|--------|---------|
| 1 | `<picture>` element (DAM product image, optional) |
| 2 | Category label |
| 3 | Product name |
| 4 | SKU / description line |
| 5 | Price string (e.g. `$12.99 / box`) |
| 6 | Badge text (rows starting with `BESTSELLER` get a gold badge) |

The block injects a hardcoded "Bestsellers" header and "See Full Catalog →" link.

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Add Button
- Clicking "ADD →" changes button text to "✓ ADDED" and adds `.ss-added` (green background) for 1400ms, then resets.
- This is a UI-only interaction; actual cart integration is handled separately by Commerce dropins.

### Scroll Reveal
- Header and cards reveal on scroll via `observeReveal` with staggered delays.

### Image Backgrounds
- Cards cycle through 4 gradient backgrounds (`ss-img-bg-1` through `ss-img-bg-4`) when no product image is present.

### Responsive Layout
- Default: 4 columns.
- ≤1200px: 2 columns.
- ≤600px: 1 column.

### Error Handling
- If no `<picture>` is present in column 1, the image zone renders with only the gradient background.
- Missing cells handled via optional chaining.
