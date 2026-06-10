# CitiSignal B2B Welcome Hero

## Overview

The **CitiSignal B2B Welcome Hero** block renders a business-account landing strip: top navigation (brand, links, primary CTA), a welcome row (avatar initials and company name), a hero headline and description with two CTAs, and a dashboard-style preview card with stats and line summaries.

## Configuration

Authoring uses the DA **key-value** model in `_citisignal-b2b-welcome-hero.json`. Main groups:

- **Anchor Namespace** — Used with `buildAnchors()` so `#plans`-style hashes resolve consistently if you align this value with [CitiSignal Showcase section blocks](../citisignal-showcase/README.md) on the same page (default `citisignal-showcase-1`).
- **Navigation** — `nav-brand`, four nav link label/URL pairs, and `nav-cta-label` / `nav-cta-url`.
- **Welcome** — `welcome-avatar-initials`, `welcome-company-name`.
- **Hero** — `hero-title-line-1`, `hero-title-gradient`, `hero-description`, primary/secondary CTA labels and URLs.
- **Dashboard card** — Company/plan badge, stat trio, three line rows (icon, name, count, usage), and `dash-card-cta-label` / `dash-card-cta-url`.

Empty labels or URLs hide the corresponding links or buttons where the implementation omits them.

## Integration

- **URLs** — Same hash-rewrite behavior as showcase core: local anchors like `#plans` map to `${anchor-namespace}-plans` when defined on the anchors object. Use full external URLs for off-site targets.
- **localStorage / events** — Not used by this block.
- **Global header/footer** — This block is page-body content only; it does not replace site chrome.

## Behavior

- Content is built from `readBlockConfig()` and static DOM structure in `citisignal-b2b-welcome-hero.js`.
- Layout and theme are scoped under the block’s root class in `citisignal-b2b-welcome-hero.css`.

## Error handling

- Missing or blank config values fall back to in-code defaults where provided.
- Invalid or empty CTA pairs should result in no button rendered for that slot (depends on template checks in JS).
