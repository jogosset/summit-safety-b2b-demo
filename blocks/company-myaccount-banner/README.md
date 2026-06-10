# Company My Account Banner

A thin, full-width banner with a logo image on the left and a freeform rich-text area on the right. The banner height is driven by the logo image's natural height (a 100×100 placeholder is shown when no image is set).

## Authored Table Structure

| Company My Account Banner | |
|---|---|
| bgcolor | #f5f5f5 |
| text-color | #2b2b2b |
| [logo image] | Rich text content — bold, italic, headings, alignment, links |

The `bgcolor` and `text-color` rows are optional config rows. They are consumed by JS and never shown on the rendered page.

## Configuration Options

| Key | Default | Description |
|---|---|---|
| `bgcolor` | `#f5f5f5` | Banner background — any valid CSS color |
| `text-color` | `#2b2b2b` | Color for all text in the content area |

## Content Slots

| Slot | Location | Notes |
|---|---|---|
| Logo Image | Left cell of the content row | Selected from the Assets repository. Natural image size drives the banner height. Max display width 200px. If omitted, a 100×100 grey placeholder is shown. |
| Rich Text | Right cell of the content row | Fully freeform — use bold, italic, headings (H1–H6), lists, links, and text alignment. All formatting is preserved. |

## Responsive Layout

The banner stays in a row layout at all breakpoints (logo left, text right) since it is designed as a full-width horizontal band.

| Breakpoint | Side padding |
|---|---|
| Mobile (<600px) | `--spacing-medium` (24px) |
| Tablet (≥600px) | `--spacing-big` (32px) |
| Desktop (≥900px) | `--spacing-large` (64px) |

## CSS Custom Properties

| Property | Used for |
|---|---|
| `--cmab-bgcolor` | Banner background (set via `bgcolor` row) |
| `--cmab-text-color` | All text (set via `text-color` row) |
| `--color-neutral-100` | Default background fallback |
| `--color-neutral-800` | Default text color fallback |
| `--color-neutral-300` | Logo placeholder background |

## Universal Editor

Five fields in the UE properties panel:
- **Background Color** — hex or named CSS color
- **Text Color** — hex or named CSS color
- **Logo Image** — reference picker for Assets repository
- **Logo Alt Text** — accessibility text for the logo
- **Banner Text** — rich text editor (bold, italic, alignment, headings, links)

## DA.live

Insert **Company My Account Banner** from the component panel. A pre-filled 3-row table is created:
- Row 1: `bgcolor` with default `#f5f5f5`
- Row 2: `text-color` with default `#2b2b2b`
- Row 3: empty image cell + editable rich text cell

Edit the color values in rows 1–2, add your logo image in the left cell of row 3, and type/format your banner text in the right cell.
