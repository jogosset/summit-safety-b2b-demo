# PDP Spec Accordion Block

## Overview

The PDP Spec Accordion block turns authored rows into native `<details>` / `<summary>` accordions: each row has a summary column (icon, title, subtitle) and a body column turned into a definition list of specification label/value pairs. The first panel is open by default.

## Configuration

### Content structure (table / DA)

Each row has two columns:

| Column | Role |
|--------|------|
| Column 1 — Summary | Rich text parsed by `parseSummary` |
| Column 2 — Specs | Paragraphs parsed by `parseSpecRows` |

**Summary column:**

- Optional `img`: used as the icon (20×20).
- Title: first `h3`, `h4`, or `h5`.
- Subtitle: first `p` that is not the heading and does not contain an `img` (if no image, the first paragraph may supply icon text when no `img` is present — see implementation).
- If there is no `img`, the first paragraph’s text can serve as icon text for the icon span.

**Specs column:**

- Each `p` must contain a `strong` for the label. The label is taken from `strong.textContent`; after removing the `strong`, the rest of the paragraph is the value.

There is no `readBlockConfig`; structure follows the DOM.

## Integration

### URL parameters

None.

### Local storage

None.

### Events

None beyond `enhanceRevealAnimations`.

## Behavior patterns

### User interaction flows

- Users expand/collapse each `<details>`; the first item has `open` set.
- Chevron is decorative in the summary; native disclosure handles accessibility.

### Error handling

- Rows with fewer than two columns are skipped.
- Paragraphs in the specs column without a `strong` are skipped for that row.
- Missing title or subtitle yields empty strings in the summary text span.
