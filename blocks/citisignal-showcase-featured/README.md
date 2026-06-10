# CitiSignal Showcase Featured Product

## Overview

Renders the **featured product** section: device visual with floating stat cards, tag, split title, descriptions, feature checklist, and primary CTA.

## Configuration

- DA **key-value** model: `_citisignal-showcase-featured.json`.
- **Anchor Namespace** — Same value as sibling showcase blocks on the page ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `featured-tag`, `featured-title`, `featured-description-1` / `2`, `featured-feature-list` (pipe-separated), CTA label/URL, and `featured-card-1-*` … `featured-card-3-*` for floating cards (including optional coverage meter on card 2).

Use `|` in `featured-title` for line breaks; feature list uses `|` between items.

## Integration

- Section `id` is `${anchor-namespace}-devices` so `#devices` links target this block.

## Behavior

- Empty card label/value removes that floating card slot.
- Reveal animation for visual and copy columns.

## Error handling

- Missing feature list items are simply not rendered; empty CTA hides the button.
