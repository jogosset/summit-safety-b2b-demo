# CitiSignal Showcase Hero V2

## Overview

Renders a tighter CitiSignal hero with the original left-side copy system and a new right-side product scene: large square image, attached product info card, soft signal rings, and floating status pills.

## Configuration

- DA **key-value** model: `_citisignal-showcase-hero-v2.json`
- **Anchor Namespace** — Must match other [CitiSignal Showcase section blocks](../citisignal-showcase/README.md) on the same page so local `#plans`, `#network`, and similar links resolve correctly.
- **Hero copy fields** — Reuses the standard `hero-*` CTA/copy fields plus `partner-names` and testimonial initials for the proof row avatar fallback.
- **Hero visual fields**:
  - `hero-visual-image`
  - `hero-visual-image-alt`
  - `hero-visual-tag`
  - `hero-visual-title`
  - `hero-visual-description`

See [../citisignal-showcase/README.md](../citisignal-showcase/README.md) for `|` list conventions and anchor token behavior.

## Behavior

- Uses shared anchor rewriting and reveal animation helpers from `citisignal-showcase-core.js`.
- The right-side image is rendered through `createOptimizedPicture()` and cropped to a square frame with `object-fit: cover`.
- If no image is authored, the block shows a branded placeholder tile while keeping the metadata card layout intact.
- Blank CTA label or URL hides the related button.
- Blank pill values remove the corresponding floating pill.
