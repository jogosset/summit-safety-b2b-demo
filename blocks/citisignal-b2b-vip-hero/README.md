# CitiSignal B2B VIP Hero

## Overview

The **CitiSignal B2B VIP Hero** block renders a full-bleed VIP landing experience: a fixed top bar (brand, nav links, nav CTA), a hero with badge, two-line headline (with gradient accent line), description, primary and secondary CTAs, and a right-hand panel with a member summary card (avatar, tier, stats) and three perk rows.

## Configuration

Authoring uses the DA **key-value** model in `_citisignal-b2b-vip-hero.json`. Main groups:

- **Anchor Namespace** — Passed to `buildAnchors()` so hashes like `#plans` resolve to stable section IDs when aligned with [CitiSignal Showcase section blocks](../citisignal-showcase/README.md) on the same page (default `citisignal-showcase-1`).
- **Navigation** — `nav-brand`, four `nav-link-*` label/URL pairs (`nav-link-1` through `nav-link-4`), and `nav-cta-label` / `nav-cta-url`.
- **Hero** — `vip-badge-label`, `hero-title-line-1`, `hero-title-gradient`, `hero-description`, and primary/secondary CTA labels and URLs (`hero-primary-cta-*`, `hero-secondary-cta-*`).
- **Member card** — `member-avatar-initials`, `member-name`, `member-tier`, `member-badge`, plus three stat value/label pairs (`member-stat-1` through `member-stat-3`).
- **Perks** — For each of three slots: `perk-N-icon`, `perk-N-title`, `perk-N-desc`.

If a CTA has no label or no resolvable `href`, that link is omitted. Nav links follow the same rule (label and href both required).

## Integration

- **URLs** — Hash-only links (for example `#deals`) are rewritten using the anchor map from showcase core so they target the namespaced section IDs. Use full URLs for external destinations.
- **localStorage / events** — Not used by this block.
- **Dependencies** — Uses `readBlockConfig` from `scripts/aem.js` and `createElement`, `buildAnchors`, and `DEFAULT_ANCHOR_NAMESPACE` from [`citisignal-showcase-core.js`](../citisignal-showcase/citisignal-showcase-core.js).

## Behavior

- On decorate, the block replaces its children with the generated structure (`buildVipHero`).
- The top nav is fixed; the hero section is at least viewport height and accounts for nav offset in CSS.
- At smaller breakpoints, inline nav links hide; the layout stacks and member stats can reflow per media queries. `prefers-reduced-motion: reduce` disables entrance animations.

## Error handling

- Config keys missing in authored content fall back to in-code defaults in `DEFAULTS`.
- Empty `anchor-namespace` falls back to `DEFAULT_ANCHOR_NAMESPACE`.
- CTAs and nav items with missing text or empty resolved `href` are skipped so users do not get broken controls.
