import { readBlockConfig } from '../../scripts/aem.js';
import { createElement, enhanceRevealAnimations } from '../citisignal-showcase/citisignal-showcase-core.js';

function buildStatCard(config, index, delayClass) {
  const card = createElement('article', { className: `pdp-stat-card cs-reveal ${delayClass}` });

  const valueWrap = createElement('div', { className: 'pdp-stat-value' });
  const number = createElement('strong', { className: 'pdp-stat-number', text: config[`stat-${index}-value`] || '' });
  const unit = createElement('span', { className: 'pdp-stat-unit', text: config[`stat-${index}-unit`] || '' });
  valueWrap.append(number, unit);

  const label = createElement('p', { className: 'pdp-stat-label', text: config[`stat-${index}-label`] || '' });
  const sub = createElement('span', { className: 'pdp-stat-sub', text: config[`stat-${index}-sub`] || '' });

  card.append(valueWrap, label, sub);
  return card;
}

export default function decorate(block) {
  const config = readBlockConfig(block);

  const inner = createElement('div', { className: 'pdp-stats-inner' });

  // Header
  const header = createElement('div', { className: 'pdp-stats-header cs-reveal' });
  const h2 = createElement('h2', { text: config.headline || 'Built to perform.' });
  const subtitle = createElement('p', { text: config.subtitle || '' });
  header.append(h2, subtitle);

  // Stats grid
  const grid = createElement('div', { className: 'pdp-stats-grid' });
  const delays = ['', 'cs-delay-1', 'cs-delay-2', ''];
  for (let i = 1; i <= 4; i += 1) {
    grid.append(buildStatCard(config, i, delays[i - 1]));
  }

  inner.append(header, grid);
  block.textContent = '';
  block.append(inner);

  enhanceRevealAnimations(block);
}
