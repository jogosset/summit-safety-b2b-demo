import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Showcase Feature Block
 *
 * Key-value block that renders a dark-background, two-column feature section.
 * LEFT: optional background image with up to 3 frosted-glass metric cards overlaid.
 * RIGHT: badge, title, descriptions, feature bullet list, CTA button.
 *
 * Config keys:
 *   anchor-namespace     — page anchor ID
 *   badge-label          — small pill badge above the title
 *   title                — main headline
 *   description-1        — first body paragraph
 *   description-2        — second body paragraph (optional)
 *   feature-1..4         — bullet-point features (optional)
 *   cta-label            — button text (optional)
 *   cta-url              — button href (optional)
 *   background-image     — image behind metric cards (optional)
 *   background-image-alt — alt text for background image
 *   card-N-value         — metric card value (N = 1, 2, 3)
 *   card-N-label         — metric card label (N = 1, 2, 3)
 */
export default function decorate(block) {
  const allRows = [...block.querySelectorAll(':scope > div')];

  const config = {};
  let bgImageEl = null;

  allRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;

    const key = cells[0].textContent.trim().toLowerCase();
    const valueCell = cells[1];

    if (key === 'background-image') {
      const picture = valueCell.querySelector('picture');
      const img = valueCell.querySelector('img');
      if (picture) {
        bgImageEl = picture;
      } else if (img) {
        bgImageEl = img.closest('picture') || img;
      } else {
        const url = valueCell.textContent.trim();
        if (url) config[key] = url;
      }
    } else {
      config[key] = valueCell.textContent.trim();
    }

    row.remove();
  });

  // Build optimized picture from URL string if needed
  if (!bgImageEl && config['background-image']) {
    const alt = config['background-image-alt'] || '';
    bgImageEl = createOptimizedPicture(
      config['background-image'],
      alt,
      false,
      [{ media: '(max-width: 900px)', width: '480' }, { width: '800' }],
    );
  } else if (bgImageEl) {
    const imgEl = bgImageEl.tagName === 'PICTURE'
      ? bgImageEl.querySelector('img')
      : bgImageEl;
    if (imgEl) {
      const src = imgEl.getAttribute('src') || imgEl.src;
      const alt = imgEl.getAttribute('alt') || config['background-image-alt'] || '';
      if (src) {
        bgImageEl = createOptimizedPicture(src, alt, false, [
          { media: '(max-width: 900px)', width: '480' },
          { width: '800' },
        ]);
      }
    }
  }

  // Set anchor id if provided
  if (config['anchor-namespace']) {
    block.id = config['anchor-namespace'];
  }

  // Metric cards data
  const cards = [1, 2, 3]
    .map((n) => ({
      value: config[`card-${n}-value`] || '',
      label: config[`card-${n}-label`] || '',
    }))
    .filter((c) => c.value || c.label);

  // Feature bullets
  const features = [1, 2, 3, 4]
    .map((n) => config[`feature-${n}`])
    .filter(Boolean);

  // ── Build DOM ──────────────────────────────────────────────────────

  const wrapper = document.createElement('div');
  wrapper.className = 'sf';

  // ── LEFT: Media panel ─────────────────────────────────────────────
  const mediaCol = document.createElement('div');
  mediaCol.className = 'sf__media';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'sf__image-wrap';

  if (bgImageEl) {
    bgImageEl.classList.add('sf__bg-image');
    imageWrap.append(bgImageEl);
  }

  // Frosted metric cards overlaid on image
  if (cards.length) {
    cards.forEach(({ value, label }, i) => {
      const card = document.createElement('div');
      card.className = `sf__card sf__card--${i + 1}`;
      card.innerHTML = `<span class="sf__card-value">${value}</span><span class="sf__card-label">${label}</span>`;
      imageWrap.append(card);
    });
  }

  mediaCol.append(imageWrap);

  // ── RIGHT: Content panel ──────────────────────────────────────────
  const contentCol = document.createElement('div');
  contentCol.className = 'sf__content';

  // Badge
  if (config['badge-label']) {
    const badge = document.createElement('span');
    badge.className = 'sf__badge';
    badge.textContent = config['badge-label'];
    contentCol.append(badge);
  }

  // Title
  if (config.title) {
    const heading = document.createElement('h2');
    heading.className = 'sf__title';
    heading.textContent = config.title;
    contentCol.append(heading);
  }

  // Descriptions
  ['description-1', 'description-2'].forEach((key) => {
    if (config[key]) {
      const p = document.createElement('p');
      p.className = 'sf__description';
      p.textContent = config[key];
      contentCol.append(p);
    }
  });

  // Feature list
  if (features.length) {
    const ul = document.createElement('ul');
    ul.className = 'sf__features';
    features.forEach((text) => {
      const li = document.createElement('li');
      li.className = 'sf__feature';
      li.innerHTML = `<span class="sf__feature-icon" aria-hidden="true"></span><span>${text}</span>`;
      ul.append(li);
    });
    contentCol.append(ul);
  }

  // CTA button
  if (config['cta-label']) {
    const btn = document.createElement('a');
    btn.className = 'sf__cta';
    btn.href = config['cta-url'] || '#';
    btn.textContent = config['cta-label'];
    contentCol.append(btn);
  }

  // ── Assemble ──────────────────────────────────────────────────────
  wrapper.append(mediaCol, contentCol);
  block.replaceChildren(wrapper);
}
