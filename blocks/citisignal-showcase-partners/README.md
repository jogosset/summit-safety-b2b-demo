# CitiSignal Showcase Partners

## Overview

Renders the **partner marquee**: eyebrow label and a scrolling row of partner names.

## Configuration

- DA **key-value** model: `_citisignal-showcase-partners.json`.
- **Anchor Namespace** — Required for consistency with other sections on the page (see [../citisignal-showcase/README.md](../citisignal-showcase/README.md)); this section does not expose its own hash target but participates in the same page instance.
- **Fields** — `partners-label`, `partner-names` (pipe `|` separated list).

If `partner-names` is empty, the builder returns no section and the block renders empty.

## Integration

- Partner list format matches the main showcase README (`|` separators).
- If you also use **Showcase Hero**, duplicate the same `partner-names` value there for avatar initials (documented in the parent README).

## Behavior

- Duplicated marquee tracks for seamless CSS animation.
- Reveal animation when included in the block’s enhancer list.

## Error handling

- No partners → `buildPartners` returns `null`; empty block output.
