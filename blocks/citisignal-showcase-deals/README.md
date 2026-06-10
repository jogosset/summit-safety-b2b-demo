# CitiSignal Showcase Deals

## Overview

Renders the **deals** grid: section eyebrow, title, description, and up to four deal cards (icon token, title, copy, CTA).

## Configuration

- DA **key-value** model: `_citisignal-showcase-deals.json`.
- **Anchor Namespace** — Align with other showcase sections on the page ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `deals-eyebrow`, `deals-title`, `deals-description`, and `deal-1-*` … `deal-4-*` (icon token, title, description, CTA label, CTA URL).

Supported icon tokens: `music`, `phone`, `savings`, `watch`, plus fallbacks `bundle`, `speed` (see parent README).

## Integration

- Section `id` is `${anchor-namespace}-deals` so `#deals` in CTAs resolves correctly across blocks.
- CTA URLs can use showcase hash tokens (`#plans`, `#devices`, …) rewritten by `resolveUrl`.

## Behavior

- Cards without a title are omitted.
- Reveal-on-scroll for headings and cards.

## Error handling

- Blank deal CTA label or URL removes that card’s link (per `createButton`).
