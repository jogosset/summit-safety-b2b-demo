import { createOptimizedPicture } from '../../scripts/aem.js';
import { createElement, enhanceRevealAnimations } from '../citisignal-showcase/citisignal-showcase-core.js';

/**
 * Ensure the text div has <p> and <h3> structure.
 * AEM may deliver content as flat text + <strong> inside a single <div>.
 * If no <p> elements exist, wrap text segments into proper elements.
 */
function normalizeTextDiv(textDiv) {
  if (textDiv.querySelectorAll('p').length > 0) return;

  const raw = textDiv.innerHTML;
  const h3 = textDiv.querySelector('h3');
  if (h3) return; // has headings, probably structured enough

  // Flat content: split on <strong> boundaries and rebuild
  const text = textDiv.textContent.trim();
  if (!text) return;

  // Try to detect eyebrow // heading | description | bold stat pattern
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return;

  textDiv.textContent = '';
  lines.forEach((line) => {
    if (line.startsWith('//')) {
      const p = document.createElement('p');
      p.textContent = line;
      textDiv.append(p);
    } else if (line.includes('|')) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = line;
      p.append(strong);
      textDiv.append(p);
    } else if (textDiv.children.length === 1) {
      // Second element after eyebrow = heading
      const heading = document.createElement('h3');
      heading.textContent = line;
      textDiv.append(heading);
    } else {
      const p = document.createElement('p');
      p.textContent = line;
      textDiv.append(p);
    }
  });
}

function decorateEyebrow(textDiv) {
  const firstP = textDiv.querySelector('p');
  if (firstP && firstP.textContent.trim().startsWith('//')) {
    firstP.className = 'pdp-feature-eyebrow';
  }
}

function decorateStatRow(textDiv) {
  const paragraphs = textDiv.querySelectorAll('p');
  const lastP = paragraphs[paragraphs.length - 1];
  if (!lastP) return;

  const strong = lastP.querySelector('strong');
  if (!strong) return;

  const text = strong.textContent;
  if (!text.includes('|')) return;

  const row = createElement('div', { className: 'pdp-feature-stat-row' });
  text.split('|').forEach((chunk) => {
    const parts = chunk.trim().split(/\s+/);
    const val = parts.shift();
    const label = parts.join(' ');
    const item = createElement('div', { className: 'pdp-feature-stat' });
    item.append(
      createElement('strong', { className: 'pdp-feature-stat-val', text: val }),
      createElement('span', { className: 'pdp-feature-stat-label', text: label }),
    );
    row.append(item);
  });
  lastP.replaceWith(row);
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const textDiv = cols[0];
    const imageDiv = cols[1];

    textDiv.className = 'pdp-feature-text';
    imageDiv.className = 'pdp-feature-visual';

    normalizeTextDiv(textDiv);
    decorateEyebrow(textDiv);
    decorateStatRow(textDiv);

    // Optimize images
    imageDiv.querySelectorAll('picture > img').forEach((img) => {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      img.closest('picture').replaceWith(optimized);
    });

    row.className = 'pdp-feature-item cs-reveal';
  });

  enhanceRevealAnimations(block);
}
