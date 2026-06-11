# SS Categories Block

## Overview

A 6-column category grid for the Summit Safety homepage. Each category card links to a category page and shows an emoji icon, name, and product count. Cards reveal on scroll via the shared `observeReveal` utility with staggered entrance delays.

## Integration

### Block Configuration

Reads N DA.live-authored table rows, 4 columns each:

| Column | Content |
|--------|---------|
| 1 | Emoji icon |
| 2 | Category name |
| 3 | Product count / description |
| 4 | `<a>` link to category page |

The block also injects a hardcoded "Shop by Category" section header with a "View All Products →" link to `/categories`.

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Scroll Reveal
- Section header and individual cards receive `.ss-reveal` and animate in via `IntersectionObserver` when they enter the viewport (threshold 0.12, rootMargin -40px bottom).
- Cards inside `.ss-stagger` receive incremental `transition-delay` (80 ms per item).

### Hover Effects
- Cards lift (`translateY(-5px)`) and show a gold bottom bar and shimmer sweep.
- Icons scale up 15% on card hover.

### Responsive Layout
- Default: 6 columns.
- ≤1200px: 3 columns.
- ≤600px: 2 columns.

### Error Handling
- Missing cells handled via optional chaining.
- If column 4 has no `<a>`, falls back to `textContent` of the cell, then `#`.
