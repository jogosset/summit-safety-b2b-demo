# Product Teaser V2

Displays a single product card fetched live from the catalog service, showing the product image, name, SKU, price, short description, and optional action buttons. Supports configurable background and text colors.

## Configuration Options

All options are set as key-value rows in the block table.

| Key | Default | Description |
|-----|---------|-------------|
| `sku` | *(required)* | Product SKU to display |
| `details-button` | `false` | Show a "Details" link to the product page |
| `cart-button` | `false` | Show an "Add to Cart" button |
| `background-color` | `#003087` | Card background — any valid CSS color |
| `text-color` | `#ffffff` | Color for the product name, SKU, price, and description |

## Example Table

| Product Teaser V2 | |
|---|---|
| sku | MH01-XS-Black |
| details-button | true |
| cart-button | true |
| background-color | #003087 |
| text-color | #ffffff |

## Display Order

The card renders in this order:

1. Product image (left / top on mobile)
2. Product name
3. Product SKU
4. Product price (final price; strikethrough regular price if on sale)
5. Short description (if available from catalog)
6. Action buttons (Details / Add to Cart)

## Behavior

- Fetches product data on page load from the catalog service using the provided SKU.
- Shows a placeholder skeleton while loading.
- For complex/configurable products, displays a price range and disables the Add to Cart button.
- Colors are applied via CSS custom properties (`--ptv2-bg-color`, `--ptv2-text-color`).
- The Details button link is automatically constructed from `urlKey` and `sku`.

## Universal Editor

All five fields are editable in the UE properties panel. The block appears in the "Product" component group and is also available in page sections.

## DA.live

Insert the block from the component panel — all five fields are pre-filled with default values for immediate editing. Enter the product SKU in the first row to load the product.
