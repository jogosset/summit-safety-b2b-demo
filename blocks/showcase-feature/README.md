# Showcase Feature

Dark-background, two-column feature block. Left panel shows an optional background image with up to three frosted-glass metric cards overlaid. Right panel shows a badge, title, descriptions, feature bullet list, and a CTA button.

## Features

- **Dark theme** — near-black background (`--sf-bg`) with white text
- **Two-column layout** — media panel left (45%), content panel right (55%) at tablet and above; stacked on mobile
- **Background image** — optional image from AEM Assets fills the media panel behind the metric cards
- **Frosted metric cards** — up to 3 semi-transparent glassmorphism cards overlaid on the image showing a value and label
- **Feature bullet list** — up to 4 items with a CSS checkmark icon
- **Badge pill** — small outlined pill label above the title
- **CTA button** — outlined ghost-style button
- **Works in da.live (document authoring) and Universal Editor**

## Authoring — da.live

Insert a **Showcase Feature** block. The block is authored as a two-column key-value table.

| Key | Value | Notes |
|-----|-------|-------|
| `anchor-namespace` | `showcase-feature` | Page anchor ID |
| `badge-label` | `Capability Spotlight` | Small pill badge above the title |
| `title` | `Advanced Engine Overhaul & Testing` | Main headline |
| `description-1` | Long body text | First description paragraph |
| `description-2` | Additional text | Second description paragraph (optional) |
| `feature-1` | `FAA / EASA Part 145 certified facility` | Feature bullet 1 |
| `feature-2` | `Full hot-section inspection capability` | Feature bullet 2 |
| `feature-3` | `Borescope and NDT inspection services` | Feature bullet 3 |
| `feature-4` | `Rapid turn around on AOG requirements` | Feature bullet 4 |
| `cta-label` | `Request a Quote` | CTA button text |
| `cta-url` | `#contact` | CTA button href |
| `background-image` | _(insert image from Assets)_ | Optional background image behind metric cards |
| `background-image-alt` | `Engine overhaul facility` | Alt text for image |
| `card-1-value` | `862 Days` | Metric card 1 value |
| `card-1-label` | `Average TAT` | Metric card 1 label |
| `card-2-value` | `Excellent` | Metric card 2 value |
| `card-2-label` | `Quality Rating` | Metric card 2 label |
| `card-3-value` | `97%` | Metric card 3 value |
| `card-3-label` | `On-Time Delivery` | Metric card 3 label |

## Authoring — Universal Editor

Select the block in the canvas. The properties panel shows all fields including a **Background Image** asset picker.

## Content Model

This is a **key-value block** (`type: "key-value-block"`). All rows are read as key-value pairs.

## CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--sf-bg` | `#070d19` | Block background colour |
| `--sf-text` | `#fff` | Default text colour |
