# CitiSignal Showcase Hero

## Overview

Renders the **hero** section of the CitiSignal marketing layout: badge, split headline, description, primary/secondary CTAs, proof stat with avatar chips, and the animated phone scene (speed, metrics, pills).

## Configuration

- DA **key-value** model: `_citisignal-showcase-hero.json`.
- **Anchor Namespace** — Must match other [CitiSignal Showcase section blocks](../citisignal-showcase/README.md) on the same page so `#plans`, `#network`, etc. resolve correctly.
- **Hero fields** — All `hero-*` keys plus `partner-names` (used for proof avatars) and `testimonial-1-initials` … `testimonial-4-initials` as fallback initials when partner names are empty.

See [../citisignal-showcase/README.md](../citisignal-showcase/README.md) for `|` list conventions and anchor tokens.

## Integration

- Hash CTAs (`#plans`, `#network`, …) are rewritten via shared `buildAnchors(instanceId)` in `citisignal-showcase-core.js`.
- No `localStorage`, query parameters, or custom DOM events.

## Behavior

- Section is wrapped in `.cs-shell` by `decorateCitisignalSection`; the block root gets class `citisignal-showcase` for shared styles.
- Scroll/reveal animation runs via `enhanceRevealAnimations` when enabled for this block.

## Error handling

- Blank CTA label or URL hides that button (see `createButton` in core).
- Blank pills remove the corresponding pill node.
