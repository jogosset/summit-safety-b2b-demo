# CitiSignal Showcase Block

The `citisignal-showcase` block recreates the CitiSignal one-page marketing experience as a single DA.Live-ready EDS block.

## Section blocks (insertable)

You can build the same experience with **eight separate blocks** (one section each), registered in the block picker:

| Block | Purpose |
| --- | --- |
| `citisignal-showcase-hero` | Hero |
| `citisignal-showcase-partners` | Partner marquee |
| `citisignal-showcase-deals` | Deals grid |
| `citisignal-showcase-featured` | Featured product |
| `citisignal-showcase-plans` | Plans + pricing toggle |
| `citisignal-showcase-network` | Network stats |
| `citisignal-showcase-testimonials` | Testimonials |
| `citisignal-showcase-final-cta` | Final CTA |

Each section block imports shared markup and behavior from [`citisignal-showcase-core.js`](citisignal-showcase-core.js) and shared styles from [`citisignal-showcase.css`](citisignal-showcase.css). The root element gets the class `citisignal-showcase` so styling matches the monolithic block.

### Anchor namespace (section blocks only)

Every section block includes an **Anchor Namespace** field (default `citisignal-showcase-1`). All section blocks that belong on the **same** landing page must use the **same** value so in-page links such as `#plans` and `#network` resolve to the correct section IDs (for example `citisignal-showcase-1-plans`). If you place two independent showcases on one page, use a different namespace for the second set (for example `citisignal-showcase-2`).

The monolithic `citisignal-showcase` block does **not** use this field; it keeps the existing auto-incrementing instance id (`citisignal-showcase-1`, `citisignal-showcase-2`, …) per block on the page.

### Partner names on Hero and Partners

The hero proof row uses **Partner Names** for avatar initials, and the partners block uses the same field for the marquee. If you use **both** blocks, enter the **same** partner list in each block’s `Partner Names` field (or omit the partners block if you only need the hero strip).

## Authoring model

- The block is a DA `key-value-block`.
- Content is generated from `readBlockConfig()` and rendered into a scoped landing-page layout.
- The site header and footer remain global page chrome; this block renders only page-body content.

## Field conventions

- Use `|` to separate list items for:
  - `Partner Names`
  - `Featured Feature List`
  - `Plan X Feature List`
- Use `|` to force a line break in headline-style fields such as:
  - `Hero Title`
  - `Featured Title`
  - `Plans Title`
  - `Network Title`
  - `Testimonials Title`
  - `Final CTA Heading`
- Supported deal icon tokens are:
  - `music`
  - `phone`
  - `savings`
  - `watch`
  - `bundle`
  - `speed`

## Local anchor tokens

CTA URL fields can use local block anchors:

- `#deals`
- `#devices`
- `#plans`
- `#network`
- `#testimonials`
- `#cta`

These are rewritten per block instance so multiple showcase blocks can exist on one page without duplicate IDs.

## Behavior

- Blank CTA URL values hide the related CTA.
- Blank repeated content suppresses that card, plan, stat, or testimonial.
- If any rendered plan is missing an annual price, the monthly/annual toggle is hidden and monthly pricing is shown.
- Motion respects `prefers-reduced-motion`.

## Regenerating component models

After editing `_*.json` under `blocks/` or `models/`, run `npm run build:json` so `component-models.json` and `component-definition.json` stay in sync.

## Regenerating section `_*.json` from the monolith model

If the full `citisignal-showcase` field list in `component-models.json` changes, you can rebuild the eight section `_*.json` files with:

`node blocks/citisignal-showcase/scripts/build-section-models.mjs`

Then run `npm run build:json`.
