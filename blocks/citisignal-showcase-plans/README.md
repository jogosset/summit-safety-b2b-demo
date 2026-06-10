# CitiSignal Showcase Plans

## Overview

Renders the **plans** section: eyebrow, title, description, optional monthly/annual toggle with savings pill, and up to three plan cards with pricing, bullets, and CTAs.

## Configuration

- DA **key-value** model: `_citisignal-showcase-plans.json`.
- **Anchor Namespace** — Shared with other showcase sections ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `plans-eyebrow`, `plans-title`, `plans-description`, toggle labels (`plans-monthly-label`, `plans-annual-label`, `plans-saving-label`), and `plan-1-*` … `plan-3-*` (name, monthly/annual price, description, pipe-separated feature list, CTA, `plan-X-featured` boolean).

If any plan lacks an annual price, the monthly/annual toggle is hidden and monthly prices are shown only.

## Integration

- Section `id` is `${anchor-namespace}-plans` for `#plans` hash targets.
- Plan CTAs often use `#cta` to scroll to the final CTA section.

## Behavior

- `enhancePlanToggle` wires the pricing toggle to swap `data-monthly` / `data-annual` on price elements.
- Reveal animation on headings and cards.

## Error handling

- Plans without a name are dropped from the grid.
- Blank CTA hides that plan’s button.
