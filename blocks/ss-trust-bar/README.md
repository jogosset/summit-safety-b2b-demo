# SS Trust Bar Block

## Overview

A horizontal bar displaying up to 4 trust signals (icon, label, supporting text) for the Summit Safety homepage. Renders below the hero to reinforce delivery speed, quality, service, and bulk-order capabilities. Each item lifts slightly on hover.

## Integration

### Block Configuration

Reads N DA.live-authored table rows, 3 columns each:

| Column | Content |
|--------|---------|
| 1 | Emoji icon |
| 2 | Short label (bold) |
| 3 | Supporting sub-text |

### Events

<!-- No custom events emitted or consumed -->

## Behavior Patterns

### Responsive Layout
- At ≤900px: items wrap to 2 columns.
- At ≤600px: items stack to 1 column.

### Error Handling
- Missing cells handled via optional chaining; items render with empty text rather than throwing.
