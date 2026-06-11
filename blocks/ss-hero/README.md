# SS Hero Block

## Overview

Split-panel hero block for the Summit Safety homepage. Renders a left panel with eyebrow text, H1 heading (with gold "SUMMIT" highlight), subheading, and two CTA buttons; a right panel with decorative rings, a badge, a hero product image, and an animated stat strip showing key metrics. Stat numbers animate from zero on scroll entry via `observeCounter`.

## Integration

### Block Configuration

Reads 10 DA.live-authored table rows (no `readBlockConfig`):

| Row | Columns | Content |
|-----|---------|---------|
| 1 | 1 | Eyebrow text |
| 2 | 1 | H1 heading (word "SUMMIT" auto-wrapped in `<em>`) |
| 3 | 1 | Subheading paragraph |
| 4 | 1 | Primary CTA `<a>` link |
| 5 | 1 | Secondary CTA `<a>` link |
| 6 | 1 | Badge label |
| 7 | 1 | `<picture>` element (DAM image) |
| 8–10 | 2 | Stat value + stat label |

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Entry Animations
- Left-panel elements (eyebrow, h1, sub, ctas) receive `ss-anim-fade-up` with staggered delays via `requestAnimationFrame`.
- Hero image zone receives `ss-anim-scale-in`.
- Stat numbers animate from 0 to their authored value when they enter the viewport (IntersectionObserver, threshold 0.5).

### Error Handling
- Missing rows are handled gracefully via optional chaining; elements render with empty text rather than throwing.
- If no `<picture>` is present in row 7, the image zone renders empty.
