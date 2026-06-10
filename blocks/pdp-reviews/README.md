# PDP Reviews Block

## Overview

The PDP Reviews block shows a customer reviews section with an overall score, star distribution bars, an optional “write review” CTA, and up to ten individual review cards. Content is supplied entirely through key-value block configuration (no live review API in this block).

## Configuration

Configuration is read with `readBlockConfig(block)`.

### Section header

| Key | Description |
|-----|-------------|
| `section-title` | `h2` text (default: `Customer reviews`) |
| `write-review-label` | If set, shows a link styled as a button with this label |
| `write-review-url` | Href for the write-review link (default `#` if label is set) |

### Summary sidebar

| Key | Description |
|-----|-------------|
| `overall-rating` | Shown as the large score and drives the 5-star display (parsed as float; stars use `Math.round`) |
| `total-reviews` | Copy: “Based on {value} reviews” |
| `stars-5-percent` … `stars-1-percent` | Integer percentages for each star level (used as bar width and label) |

### Review cards (`review-{n}-*` for n = 1 … 10)

| Key | Description |
|-----|-------------|
| `review-{n}-name` | **Required** for card *n* to appear. If missing, rendering stops (no further cards). |
| `review-{n}-date` | Optional date line |
| `review-{n}-rating` | 1–5; drives filled vs empty stars |
| `review-{n}-verified` | `true` / `false` string or boolean — shows “Verified Purchase” when true |
| `review-{n}-initials` | Avatar initials; if omitted, derived from `name` |
| `review-{n}-title` | Optional review headline |
| `review-{n}-text` | Optional body copy |

## Integration

### URL parameters

None.

### Local storage

None.

### Events

None beyond `enhanceRevealAnimations`.

## Behavior patterns

### User interaction flows

- Header row: title plus optional write-review link.
- Left column: aggregate rating, stars, distribution bars.
- Right column: sequential review cards until the first missing `review-{n}-name`.

### Error handling

- Invalid or non-numeric `overall-rating` / per-review ratings fall back to `0` or `5` via `parseFloat` defaults in code.
- Bar percentages use `parseInt(..., 10) || 0` if missing or invalid.
- Empty optional fields simply omit those subnodes from the card.
