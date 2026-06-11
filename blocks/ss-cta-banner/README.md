# SS CTA Banner Block

## Overview

A full-width gold call-to-action banner for the Summit Safety homepage. Displays a heading and body text on the left, with a primary (navy) and secondary (outline) CTA button on the right. Both sides slide in from opposite sides when scrolled into view. Decorative circle overlays add visual depth.

## Integration

### Block Configuration

Reads 4 DA.live-authored table rows, 1 column each:

| Row | Content |
|-----|---------|
| 1 | Heading text |
| 2 | Body / supporting text |
| 3 | Primary CTA `<a>` link |
| 4 | Secondary CTA `<a>` link |

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Scroll Reveal
- Left side (heading + body) slides in from left (`.ss-reveal-left`).
- Right side (buttons) slides in from right (`.ss-reveal-right`).

### Responsive Layout
- Default: flex row, space-between.
- ≤900px: column layout, centered text and buttons.
- ≤600px: buttons expand to full width.

### Error Handling
- If no `<a>` is found in rows 3 or 4, the corresponding button is simply not rendered.
- Missing row text handled via optional chaining.
