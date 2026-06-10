# CitiSignal Showcase Testimonials

## Overview

Renders the **testimonials** section: eyebrow, title, and a horizontal track of testimonial cards (quote, avatar initials, name, location). Prev/next buttons appear when more than one quote exists.

## Configuration

- DA **key-value** model: `_citisignal-showcase-testimonials.json`.
- **Anchor Namespace** — Shared with other showcase sections ([../citisignal-showcase/README.md](../citisignal-showcase/README.md)).
- **Fields** — `testimonials-eyebrow`, `testimonials-title`, and for each of five slots: `testimonial-N-quote`, `testimonial-N-initials`, `testimonial-N-name`, `testimonial-N-role-location`.

Use `|` in `testimonials-title` for line breaks.

## Integration

- Section `id` is `${anchor-namespace}-testimonials`; track element id `${anchor-namespace}-testimonial-track`.
- No external APIs or storage.

## Behavior

- `enhanceTestimonials` scrolls the track by one card width on button click; respects reduced motion.
- Single testimonial removes the control buttons.

## Error handling

- Entries with no quote text are excluded; if none remain, the section may render with an empty track (avoid by authoring at least one quote).
