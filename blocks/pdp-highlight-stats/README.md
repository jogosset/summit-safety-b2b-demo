# PDP Highlight Stats Block

## Overview

The PDP Highlight Stats block displays a headline, optional subtitle, and a fixed grid of four stat cards (value + unit, label, and sub-label). It is configured via key-value block metadata and uses scroll-reveal animation helpers.

## Configuration

Configuration is read with `readBlockConfig(block)` from the first table in the block.

| Key | Type | Default (per model) | Description |
|-----|------|---------------------|-------------|
| `headline` | string | `Built to perform.` | Section heading (`h2`) |
| `subtitle` | string | (see `_pdp-highlight-stats.json`) | Subtitle paragraph below the headline |
| `stat-{1-4}-value` | string | per field | Primary number or text for the stat |
| `stat-{1-4}-unit` | string | per field | Suffix next to the value (e.g. `"`, MP) |
| `stat-{1-4}-label` | string | per field | Main stat description |
| `stat-{1-4}-sub` | string | per field | Secondary line (specs, fine print) |

All four stat slots are always rendered; empty keys render as empty strings.

## Integration

### URL parameters

None.

### Local storage

None.

### Events

None beyond `enhanceRevealAnimations` for reveal-on-scroll styling.

## Behavior patterns

### User interaction flows

- The block clears default content and injects `pdp-stats-inner` with header + `pdp-stats-grid`.
- Stagger classes `cs-delay-1` and `cs-delay-2` are applied to the second and third cards for animation timing.

### Error handling

- If `readBlockConfig` fails or keys are missing, the decorator still runs with empty strings and the default headline where applicable.
- No network or async paths; failures are limited to missing DOM or config table.
