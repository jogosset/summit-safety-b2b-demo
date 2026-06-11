# SS Testimonials Block

## Overview

A 3-column testimonial grid on a navy background for the Summit Safety homepage. Each card shows a 5-star rating, a blockquote, and an author section with an avatar (initials in a gradient circle), name, and company. Cards reveal on scroll with staggered animation.

## Integration

### Block Configuration

Reads N DA.live-authored table rows, 4 columns each:

| Column | Content |
|--------|---------|
| 1 | Author initials (2 characters, shown in avatar) |
| 2 | Author full name |
| 3 | Company / title |
| 4 | Quote text |

The block injects a hardcoded "What Our Customers Say" heading.

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Scroll Reveal
- Header and cards receive `.ss-reveal` and `.ss-stagger` for staggered entrance animation via `observeReveal`.

### Responsive Layout
- Default: 3 columns.
- ≤900px: 1 column.

### Error Handling
- Missing cells handled via optional chaining; elements render with empty text rather than throwing.
