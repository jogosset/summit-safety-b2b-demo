# PDP Feature Showcase Block

## Overview

The PDP Feature Showcase block renders one or more two-column feature rows for product detail pages: rich text and optional stat micro-rows on the left, and an optimized hero image on the right. It uses scroll-reveal animation helpers shared with other CitiSignal showcase blocks.

## Configuration

### Content structure (table / DA)

Each row has two columns:

| Column | Role |
|--------|------|
| Left | Text: eyebrow, body copy, and optional stat line |
| Right | Image: `picture` with `img` (replaced with an optimized picture) |

**Eyebrow:** The first paragraph whose text starts with `//` is styled as the eyebrow (`pdp-feature-eyebrow`).

**Stat row:** If the **last** paragraph contains a `strong` whose text includes `|`, that paragraph is replaced by a horizontal stat row. The `strong` text is split on `|` into chunks; each chunk is split on whitespace so the first token is the value and the remainder is the label.

Rows with fewer than two columns are skipped.

### Block metadata

There is no `readBlockConfig` surface; behavior is driven entirely by authored HTML in each row.

## Integration

### URL parameters

None.

### Local storage

None.

### Events

None. The block uses `enhanceRevealAnimations` from `citisignal-showcase-core` for viewport-based reveal classes only.

## Behavior patterns

### User interaction flows

- Authors add multiple rows; each becomes a `pdp-feature-item` with text and visual columns.
- Images are passed through `createOptimizedPicture` for responsive delivery.

### Error handling

- Rows with invalid or minimal structure are left undecorated or skipped (e.g. fewer than two columns).
- Stat-row parsing requires a `strong` with `|`; otherwise the last paragraph stays as normal copy.
- If image optimization fails at the DOM level, behavior follows `createOptimizedPicture` / `aem.js` defaults.
