# CitiSignal Showcase Network

## Overview

Renders the **network** section: stat cards with animated counters, copy column (eyebrow, title, description), and decorative network graphic.

## Configuration

- DA **key-value** model: `_citisignal-showcase-network.json`.
- **Anchor Namespace** — Shared with other showcase sections ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `network-eyebrow`, `network-title`, `network-description`, and four stat groups `network-stat-N-value|suffix|decimals|label|sub-label`.

## Integration

- Section `id` is `${anchor-namespace}-network` for `#network` links (e.g. from the hero secondary CTA).

## Behavior

- `enhanceCounters` animates `.cs-counter` elements when they enter the viewport (skipped when `prefers-reduced-motion: reduce` or no `IntersectionObserver`).
- Stats with no value and no label are filtered out.

## Error handling

- Counter animation falls back to final formatted value if animation does not run.
- Empty eyebrow/title/description nodes are omitted where the builder checks for content.
