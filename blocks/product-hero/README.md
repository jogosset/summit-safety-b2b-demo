# Product Hero

A large-format hero block for featuring a single product. Displays a full-width product image alongside the product name, short description, and a single CTA button in a side-by-side layout on desktop.

## Authoring Structure

The block uses a two-column table. The left cell contains the product image; the right cell contains the name, description, and CTA link stacked vertically.

| Product Hero |  |
|---|---|
| [product image] | Product Name (heading) |
|  | Short description of the product. |
|  | [Shop Now](https://example.com/product) |

## Variants

| Variant | How to use | Effect |
|---|---|---|
| *(default)* | `Product Hero` | Light background, dark text |
| `dark` | `Product Hero (Dark)` | Dark background, light text |

The variant is applied by choosing the correct block name in the authoring table header. The JS sets a `data-theme` attribute on the block wrapper (`light` or `dark`) which drives all color changes via CSS.

## Content Slots

| Slot | Element | Notes |
|---|---|---|
| Product Image | `<picture>` | Left column — any aspect ratio; displayed at 4:3 on mobile, natural on desktop |
| Product Name | `<h2>` | First heading in the right column |
| Short Description | `<p>` (no link) | First paragraph without a link in the right column |
| CTA Button | `<a>` inside a `<p>` | Last paragraph in the right column; styled as a primary button |

## CSS Custom Properties Used

All tokens come from `styles/styles.css`.

| Property | Used for |
|---|---|
| `--background-color` | Light theme background |
| `--color-brand-700` | Dark theme background |
| `--color-neutral-50` | Dark theme text / light theme CTA text |
| `--color-neutral-800` | Light theme text |
| `--type-display-2-font` | Product name heading |
| `--type-body-1-default-font` | Description text |
| `--spacing-*` | Padding and gap |
| `--shape-border-radius-2` | Card and image rounding |

## Responsive Behaviour

- **Mobile / Tablet (<900px):** image stacked above content, full-width
- **Desktop (≥900px):** image on the left (50%), content on the right (flexible)

## Universal Editor

All six fields (image, alt, name, description, CTA text, CTA URL) are editable in the UE properties panel. The dark variant is inserted via the "Product Hero (Dark)" component.

## DA.live

Insert the block using either **Product Hero** or **Product Hero (Dark)** from the component picker. A 1×2 table is created; fill in the image reference and right-column content directly in the editor.
