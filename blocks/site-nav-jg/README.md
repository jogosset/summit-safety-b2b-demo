# Site Nav JG Block

A full-width navigation bar with author-configurable background color, text color, and hover accent color (bottom-border underline). Supports dropdown sub-navigation linking to PLP pages, an optional breadcrumb row, and a mobile hamburger menu. Works in both DA.live and Universal Editor.

Uses a **grouped-row content model** where each sub-item gets its own row, and config rows appear at the bottom of the table.

## Who Should Use It

Content authors and merchandisers who need a storefront category navigation bar with breadcrumb support.

## DA.live Authoring Instructions

Create a block table with the header **Site Nav (JG)** and the following rows:

| Site Nav (JG) | |
|---|---|
| Aviation Parts | [Tires](/plp/tires) |
| | [Windows](/plp/windows) |
| Aircraft Components | [De-Icing](/plp/de-icing) |
| | [Air Pumps](/plp/air-pumps) |
| Aircraft Parts | [Windows](/plp/windows) |
| Aircraft Electrical | [Chargers](/plp/chargers) |
| | [Batteries](/plp/batteries) |
| Account | [Log In](/account/login) |
| | [Registration](/account/register) |
| | [My Account](/account/my-account) |
| | [Create New Company Account](/account/create-company) |
| | [Quick Order](/account/quick-order) |
| Search Orders | |
| Breadcrumb | [Home](/) > [Aircraft Components](/plp/aircraft-components) > [Air Pumps](/plp/air-pumps) > RA 442CW Dry Air Pump |
| Background Color | #000000 |
| Text Color | #ffffff |
| Hover Accent Color | #fefefe |

### Content Model (Grouped Rows)

- A row with text in **col 1** starts a new top-level nav category
- Subsequent rows with **empty col 1** and a link in **col 2** are sub-items of that category
- Empty rows between groups are ignored (spacers)
- **Config rows at the bottom**: Background Color, Text Color, Hover Accent Color
- **Breadcrumb** (optional): Links separated by `>`. The final segment renders as plain text (current page)

You can add up to 6 top-level nav items, each with up to 6 sub-links.

## Universal Editor Fields

### Site Nav (JG) - Container
| Field | Type | Description |
|---|---|---|
| Background Color | text | Hex color for nav bar background (default: #000000) |
| Text Color | text | Hex color for nav text (default: #ffffff) |
| Hover Accent Color | text | Hex color for hover underline (default: #fefefe) |
| Breadcrumb | richtext | Optional breadcrumb trail with links separated by > |

### Site Nav Item (JG) - Child (add up to 6)
| Field | Type | Description |
|---|---|---|
| Category Name | text | Top-level category label |
| Sub-Link 1-6 Label | text | Sub-link label (up to 6 per category) |
| Sub-Link 1-6 URL | text | Sub-link path (up to 6 per category) |

## Configuration Options

- **Background Color**: Any valid hex color value (default: #000000)
- **Text Color**: Any valid hex color value (default: #ffffff)
- **Hover Accent Color**: Any valid hex color value (default: #fefefe, renders as bottom-border underline)
- **Breadcrumb**: Optional — omit the row entirely to hide breadcrumbs
- **Nav Items**: Up to 6 top-level categories, each with up to 6 sub-links

## Responsive Behavior

- **Desktop (900px+)**: Horizontal centered nav bar with hover dropdowns and breadcrumb row
- **Mobile (<900px)**: Hamburger menu with tap-to-expand categories; breadcrumb wraps

## Known Limitations

- UE nav items support up to 6 sub-links per category (DA.live has no limit via grouped rows)
- Hover accent is a bottom-border underline only
- No mega-menu layout (single column dropdown)

## Developer Notes

### File Structure
```
blocks/site-nav-jg/
├── site-nav-jg.js       # Block decoration logic
├── site-nav-jg.css      # Mobile-first responsive styles
├── _site-nav-jg.json    # Universal Editor component config
└── README.md            # This file
```

### CSS Custom Properties (set from author input)
- `--nav-bg-color`: Background color
- `--nav-text-color`: Text color
- `--nav-accent-color`: Hover accent underline color
