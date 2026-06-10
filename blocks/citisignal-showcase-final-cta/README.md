# CitiSignal Showcase Final CTA

## Overview

Renders the **closing CTA** band: split headline, body copy, and a single primary button.

## Configuration

- DA **key-value** model: `_citisignal-showcase-final-cta.json`.
- **Anchor Namespace** — Shared with other showcase sections ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `final-cta-heading` (use `|` for line breaks), `final-cta-body`, `final-cta-label`, `final-cta-url`.

## Integration

- Section `id` is `${anchor-namespace}-cta` so plan CTAs using `#cta` scroll here.
- Hash URLs are rewritten consistently with `buildAnchors`.

## Behavior

- Reveal animation on the CTA panel.
- Light button variant for contrast on the panel background.

## Error handling

- Blank CTA label or URL hides the button (`createButton`).
