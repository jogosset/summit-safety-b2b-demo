import { readBlockConfig } from '../../scripts/aem.js';
import { createElement, enhanceRevealAnimations } from '../citisignal-showcase/citisignal-showcase-core.js';

function createStarSvg(filled) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  if (!filled) svg.setAttribute('opacity', '0.15');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M8 1.3l1.8 3.7 4.1.6-3 2.9.7 4.1L8 10.7l-3.6 1.9.7-4.1-3-2.9 4.1-.6z');
  svg.append(path);
  return svg;
}

function buildStarRating(rating, size = 16) {
  const wrap = createElement('div', { className: 'pdp-stars' });
  const numRating = parseFloat(rating) || 0;
  for (let i = 1; i <= 5; i += 1) {
    const star = createStarSvg(i <= Math.round(numRating));
    star.setAttribute('width', String(size));
    star.setAttribute('height', String(size));
    wrap.append(star);
  }
  return wrap;
}

function buildBarRow(label, percent) {
  const row = createElement('div', { className: 'pdp-bar-row' });
  const labelEl = createElement('span', { className: 'pdp-bar-label', text: String(label) });
  const track = createElement('div', { className: 'pdp-bar-track' });
  const fill = createElement('div', { className: 'pdp-bar-fill' });
  fill.style.width = `${percent}%`;
  track.append(fill);
  const countEl = createElement('span', { className: 'pdp-bar-count', text: `${percent}%` });
  row.append(labelEl, track, countEl);
  return row;
}

function buildReviewCard(config, index) {
  const prefix = `review-${index}`;
  const name = config[`${prefix}-name`];
  if (!name) return null;

  const card = createElement('article', { className: 'pdp-review-card cs-reveal' });

  // Top: author + stars
  const top = createElement('div', { className: 'pdp-review-top' });
  const author = createElement('div', { className: 'pdp-review-author' });
  const initials = config[`${prefix}-initials`] || name.split(' ').map((w) => w[0]).join('').toUpperCase();
  const avatar = createElement('span', { className: 'pdp-review-avatar', text: initials });
  const nameWrap = createElement('div');
  nameWrap.append(
    createElement('strong', { className: 'pdp-review-name', text: name }),
    createElement('span', { className: 'pdp-review-date', text: config[`${prefix}-date`] || '' }),
  );
  author.append(avatar, nameWrap);
  const stars = buildStarRating(config[`${prefix}-rating`] || 5, 18);
  stars.className = 'pdp-review-stars';
  top.append(author, stars);

  card.append(top);

  // Verified badge
  const verified = config[`${prefix}-verified`];
  if (verified === 'true' || verified === true) {
    card.append(createElement('span', { className: 'pdp-review-badge', text: '\u2713 Verified Purchase' }));
  }

  // Title + text
  const title = config[`${prefix}-title`];
  if (title) card.append(createElement('h4', { className: 'pdp-review-title', text: title }));
  const text = config[`${prefix}-text`];
  if (text) card.append(createElement('p', { className: 'pdp-review-text', text }));

  return card;
}

export default function decorate(block) {
  const config = readBlockConfig(block);

  const inner = createElement('div', { className: 'pdp-reviews-inner' });

  // Header
  const header = createElement('div', { className: 'pdp-reviews-header cs-reveal' });
  header.append(createElement('h2', { text: config['section-title'] || 'Customer reviews' }));
  const writeLabel = config['write-review-label'];
  if (writeLabel) {
    const btn = createElement('a', {
      className: 'pdp-reviews-write-btn',
      text: writeLabel,
      attrs: { href: config['write-review-url'] || '#' },
    });
    header.append(btn);
  }

  // Content grid
  const content = createElement('div', { className: 'pdp-reviews-content' });

  // Rating summary sidebar
  const sidebar = createElement('aside', { className: 'pdp-reviews-summary cs-reveal' });
  const overall = createElement('div', { className: 'pdp-reviews-overall' });
  overall.append(
    createElement('strong', { className: 'pdp-reviews-score', text: config['overall-rating'] || '0' }),
    buildStarRating(config['overall-rating'] || 0, 22),
    createElement('span', { className: 'pdp-reviews-count', text: `Based on ${config['total-reviews'] || '0'} reviews` }),
  );
  sidebar.append(overall);

  // Bar chart
  const bars = createElement('div', { className: 'pdp-reviews-bars' });
  for (let s = 5; s >= 1; s -= 1) {
    bars.append(buildBarRow(s, parseInt(config[`stars-${s}-percent`], 10) || 0));
  }
  sidebar.append(bars);

  // Review list
  const list = createElement('div', { className: 'pdp-reviews-list' });
  for (let i = 1; i <= 10; i += 1) {
    const card = buildReviewCard(config, i);
    if (!card) break;
    list.append(card);
  }

  content.append(sidebar, list);
  inner.append(header, content);

  block.textContent = '';
  block.append(inner);

  enhanceRevealAnimations(block);
}
