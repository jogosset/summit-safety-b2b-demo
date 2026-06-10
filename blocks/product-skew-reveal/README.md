# Product Skew Reveal Block

## Overview

The Product Skew Reveal block renders a single editorial product section with a serif headline, staggered reveal animation, and a responsive grid of product or media tiles. Authors build pages like the reference mock by stacking multiple `product-skew-reveal` blocks, one section per block instance.

## Configuration

### Content structure (table / DA)

This is a filter-based block with two child component types:

| Component | Purpose |
|-----------|---------|
| `product-skew-reveal-header` | Section heading, subtitle lines, and left/right alignment |
| `product-skew-reveal-tile` | Product or media tile content |

Use one header item followed by any number of tile items.

### Header fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | text | Main section title |
| `subtitleLines` | text | Subtitle lines separated by `|` or line breaks |
| `alignment` | select | `left` or `right` |

### Tile fields

| Field | Type | Description |
|-------|------|-------------|
| `variant` | select | `product` or `media` |
| `span` | select | `standard` or `wide` |
| `label` | text | Small overline/microcopy label |
| `name` | text | Large tile title |
| `link` | text | Optional tile URL; if present the whole tile becomes a link |
| `backgroundStyle` | select | `dark`, `neutral`, `green`, `peach`, or `pink` |
| `image` | reference | Optional poster/product image |
| `imageAlt` | text | Alt text for the authored image |
| `videoUrl` | text | Optional background video URL for media tiles |
| `fallbackShape` | select | `none`, `bottle`, or `can` for product-tile fallback silhouettes |

## Integration

### Block Configuration

This block does not use `readBlockConfig()`. Content is read from authored child rows and rebuilt into the final editorial layout during decoration.

### URL Parameters

None.

### Local Storage

None.

### Events

No custom DOM events are emitted.

## Behavior Patterns

### Reveal behavior

- Header title and subtitle lines animate independently with staggered delays.
- Tiles animate on first intersection using a per-index 100ms stagger.
- With `prefers-reduced-motion` enabled, all content renders immediately and media tiles stay in poster-image mode.

### Tile rendering

- **Product tiles** use the selected gradient background plus a centered product image, or a decorative bottle/can silhouette when no image is supplied.
- **Media tiles** use a full-bleed poster image when available and can upgrade to muted background video when `videoUrl` is supplied.
- Tile order follows authored DOM order exactly.

### Accessibility

- Linked tiles use whole-tile anchors with visible focus treatment.
- Non-linked tiles render as static articles without interactive affordances.
- Decorative fallback silhouettes and background video iframes/videos are marked `aria-hidden`.

## Error handling

- Rows that do not match the expected header or tile shapes are ignored.
- Invalid `videoUrl` values fail silently and leave the poster/gradient background in place.
- Missing image references fall back to gradients and optional decorative silhouettes rather than leaving empty space.
