import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-testi-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-testi-title';
  title.textContent = 'What Our Customers Say';
  header.append(title);

  const grid = document.createElement('div');
  grid.className = 'ss-testi-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'ss-testi-card ss-reveal';

    const stars = document.createElement('div');
    stars.className = 'ss-testi-stars';
    stars.setAttribute('aria-label', '5 stars');
    stars.textContent = '★★★★★';

    const quote = document.createElement('blockquote');
    quote.className = 'ss-testi-quote';
    quote.textContent = cells[3]?.textContent.trim() || '';

    const author = document.createElement('div');
    author.className = 'ss-testi-author';

    const avatar = document.createElement('div');
    avatar.className = 'ss-testi-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = cells[0]?.textContent.trim() || '';

    const meta = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'ss-testi-name';
    name.textContent = cells[1]?.textContent.trim() || '';
    const company = document.createElement('div');
    company.className = 'ss-testi-co';
    company.textContent = cells[2]?.textContent.trim() || '';
    meta.append(name, company);

    author.append(avatar, meta);
    card.append(stars, quote, author);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
