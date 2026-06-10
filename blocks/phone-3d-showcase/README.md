# Phone 3D Showcase Block

## Overview

The Phone 3D Showcase block provides a full-viewport, dark “hero” section themed around a 3D-style phone presentation: ambient gradient orbs, lightweight particle motion, a CSS 3D phone shell (faces, edges, screen, rear camera layout), optional spec cards, control chips/buttons, and CTAs. All styling is scoped under `.phone-3d-showcase` with **`--p3d-*` custom properties** so palette and typography stay isolated from global site tokens.

This folder currently ships **`phone-3d-showcase.css` only**. Markup and any drag/flip/zoom logic are expected from page content or a future `phone-3d-showcase.js` block script once added.

## Configuration

### Design tokens (CSS variables)

Defined on `.phone-3d-showcase`:

- **Surfaces:** `--p3d-bg`, `--p3d-surface`, `--p3d-glass`, `--p3d-glass-border`
- **Text:** `--p3d-text`, `--p3d-text-dim`, `--p3d-text-muted`
- **Accents:** `--p3d-purple`, `--p3d-purple-light`, `--p3d-purple-glow`, `--p3d-violet`, `--p3d-cyan`, `--p3d-green`, `--p3d-amber`, `--p3d-rose`
- **Typography:** `--p3d-font` (Outfit), `--p3d-mono` (DM Mono)

Override these on `.phone-3d-showcase` in a layer that loads after the block stylesheet to retheme without editing the block file.

### Content model

There is no `_phone-3d-showcase.json` in-repo yet. Authors supply HTML that matches the class names this stylesheet expects (see **Behavior**).

## Integration

### URL parameters

None read by this block (no associated JavaScript).

### Local storage

None.

### Events

None at the block level until a decorator script is added. Interactive elements (`.p3d-ctrl-chip`, `.p3d-ctrl-btn`, `.p3d-fi-dot`, buttons) are styled for click/hover; wiring is the responsibility of authored scripts or a future block JS file.

### Fonts

The stylesheet references **Outfit** and **DM Mono**. Ensure those families are loaded on pages that use this block (for example via site `styles/lazy-styles.css` or page `head`) to avoid fallback fonts.

## Behavior patterns

### Expected DOM structure (high level)

Content should live inside a root element with class **`phone-3d-showcase`**. Typical regions styled by this CSS include:

- **Atmosphere:** `.p3d-ambient` / `.p3d-orb*`, `.p3d-particles` / `.p3d-particle`
- **Hero copy:** `.p3d-hero`, `.p3d-hero-top`, `.p3d-badge`, headings and paragraphs
- **3D phone:** `.p3d-viewport`, `.p3d-perspective`, `.p3d-phone`, faces (`.p3d-face-front`, `.p3d-face-back`), `.p3d-edge*`, `.p3d-side-btn*`, `.p3d-screen*` (island, status, notifications, home bar), `.p3d-back*` (camera module, regulatory text)
- **Spec UI:** `.p3d-spec-card`, `.p3d-sc-*` metric rows and bars; `.show` toggles visibility/animation for cards and bar fills
- **Controls:** `.p3d-controls`, `.p3d-ctrl-chip` (`.active` for selected state), `.p3d-ctrl-row`, `.p3d-ctrl-btn`, `.p3d-zoom-label`, `.p3d-flip-hint`
- **CTAs:** `.p3d-cta-row`, `.p3d-btn-primary`, `.p3d-btn-ghost`
- **Face indicator:** `.p3d-face-indicator`, `.p3d-fi-dot` (`.active`), `.p3d-fi-label`

### Motion and animation

Multiple **`@keyframes`** drive orb drift, particles, fade-up entrances, notification/spec-card reveals, and a subtle “wiggle” on the flip hint. There is **no `prefers-reduced-motion` override** in the current stylesheet; consider adding one if motion needs to be reduced for accessibility.

### Responsive behavior

- **≤800px:** Spec cards are hidden (`display: none !important`); phone dimensions shrink.
- **≤500px:** Phone dimensions shrink further.

### User interaction flows

Documented for completeness when JS is present:

- Chips and face-indicator dots suggest **view or face selection** (classes `.active`).
- Viewport uses **grab cursor**; **`:active`** uses grabbing cursor—typically paired with pointer-driven rotation in JS.
- Primary/ghost buttons and CTAs are standard clickable controls.

## Error handling

- **CSS-only:** No network or parsing error handling; broken markup simply results in missing or unstyled sections.
- **Missing fonts:** Visual degradation to system UI fonts; no runtime error.
- **Future JS:** Any script should guard DOM queries and handle missing optional sections (for example no spec cards on small viewports).

## Files

- `phone-3d-showcase.css` — Scoped layout, 3D phone chrome, theme tokens, animations, and breakpoints.
