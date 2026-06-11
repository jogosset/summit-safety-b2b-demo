# SS Value Props Block

## Overview

A two-column block presenting Summit Safety's value proposition on the left (eyebrow, heading, body text, bullet list) and animated stat cards on the right (2×2 grid). Stats count up from zero when scrolled into view. Both columns slide in from opposite sides via scroll-reveal.

## Integration

### Block Configuration

Reads DA.live-authored table rows in two sections separated by a `---` row:

**Prose section (before `---`):**

| Row | Content |
|-----|---------|
| 1 | Eyebrow text |
| 2 | H2 heading |
| 3 | Body paragraph |
| 4+ | Bullet list items |

**Stat section (after `---`):**

| Column 1 | Column 2 |
|----------|----------|
| Stat value (e.g. `500+`) | Stat label |

The numeric prefix of each stat value is extracted via regex and animated by `observeCounter`.

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Scroll Reveal
- Left column: slides in from left (`.ss-reveal-left`).
- Right stat grid: slides in from right (`.ss-reveal-right`) with staggered card delays.

### Counter Animation
- Stat numbers with a numeric prefix animate from 0 to target over 1200ms with easeOutCubic easing.
- Suffix characters (e.g. `+`, `%`, `hr`) are preserved after the animated number.

### Error Handling
- If no `---` separator row is found, all rows are treated as prose and no stat grid is rendered.
- Missing cells handled via optional chaining.
