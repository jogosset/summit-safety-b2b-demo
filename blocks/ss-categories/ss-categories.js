import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-categories-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-categories-title';
  title.textContent = 'Shop by Category';

  const viewAll = document.createElement('a');
  viewAll.className = 'ss-categories-view-all';
  viewAll.href = '/categories';
  viewAll.textContent = 'View All Products →';

  header.append(title, viewAll);

  const grid = document.createElement('div');
  grid.className = 'ss-categories-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const href = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || '#';

    const card = document.createElement('a');
    card.className = 'ss-category-card ss-reveal';
    card.href = href;

    const icon = document.createElement('span');
    icon.className = 'ss-cat-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const name = document.createElement('div');
    name.className = 'ss-cat-name';
    name.textContent = cells[1]?.textContent.trim() || '';

    const count = document.createElement('div');
    count.className = 'ss-cat-count';
    count.textContent = cells[2]?.textContent.trim() || '';

    card.append(icon, name, count);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
