# Hero B2B Returning

## Overview

The **Hero B2B Returning** block is a full-viewport B2B landing hero for signed-in or returning business users. It renders a fixed glass-style top navigation (brand, up to four links, primary CTA), a “welcome back” row with avatar initials and company name, a two-line headline (second line uses gradient styling), description, and two hero CTAs. The right column shows a dashboard-style preview card with plan badge, three stats, three line summaries (emoji icons, counts, usage), and a card-level CTA. A canvas-backed soft gradient background and dot overlay sit behind the hero; entry animations respect `prefers-reduced-motion`.

## Configuration

Authoring uses the DA **key-value** model in `_hero-b2b-returning.json`. Main groups:

- **Anchor Namespace** — Passed to `buildAnchors()` from [citisignal-showcase-core](../citisignal-showcase/citisignal-showcase-core.js) so in-page hashes align with other showcase blocks on the same page (default `citisignal-showcase-1`).
- **Navigation** — `nav-brand`, four `nav-link-N-label` / `nav-link-N-url` pairs, and `nav-cta-label` / `nav-cta-url`.
- **Welcome** — `welcome-avatar-initials`, `welcome-company-name` (shown in “Welcome back, **Company**”).
- **Hero** — `hero-title-line-1`, `hero-title-gradient`, `hero-description`, primary and secondary CTA labels and URLs.
- **Dashboard card** — `dash-avatar-initials`, `dash-company-name`, `dash-plan`, `dash-badge`, three stats (`dash-stat-*`), three line rows (`dash-line-N-icon`, name, count, usage), and `dash-card-cta-label` / `dash-card-cta-url`.

If a nav link or CTA has an empty **label** or **resolved URL**, that control is omitted. The logo uses `#` resolved through the anchor map when configured.

## Integration

- **URLs and hashes** — Values starting with `#` are passed through `resolveUrl()` against the anchors built for `anchor-namespace` (e.g. `#` maps to the showcase anchor for the logo). Use full URLs for external targets.
- **localStorage / events** — Not used by this block.
- **Dependencies** — Uses `readBlockConfig` from `scripts/aem.js` and `createElement`, `buildAnchors`, and `DEFAULT_ANCHOR_NAMESPACE` from `citisignal-showcase-core.js`.

## Behavior

- On decorate, the block replaces its children with the generated DOM under `.cb2br-welcome`.
- The hero background canvas is sized to its container and repainted on resize via `ResizeObserver`, or `window.resize` when `ResizeObserver` is unavailable.
- Primary CTA markup uses an inner `<span>` for the label to support the gradient hover layer in CSS.
- At **1024px** and below, the split stacks; at **768px** and below, inline nav links hide and hero buttons stack full width.

## Error handling

- Missing or blank config keys fall back to in-code `DEFAULTS` in `hero-b2b-returning.js`.
- If the canvas context cannot be obtained, the background step is skipped without throwing.
- Empty CTA label or URL pairs result in no link for that slot.
