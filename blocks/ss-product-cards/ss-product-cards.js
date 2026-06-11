import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/ss-animations.js';

const BG_CLASSES = [
  'ss-img-bg-1',
  'ss-img-bg-2',
  'ss-img-bg-3',
  'ss-img-bg-4',
];

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-product-cards-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-product-cards-title';
  title.textContent = 'Bestsellers';

  const viewAll = document.createElement('a');
  viewAll.className = 'ss-product-cards-view-all';
  viewAll.href = '/products';
  viewAll.textContent = 'See Full Catalog →';

  header.append(title, viewAll);

  const grid = document.createElement('div');
  grid.className = 'ss-product-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row, idx) => {
    const cells = [...row.children];
    const article = document.createElement('article');
    article.className = 'ss-product-card ss-reveal';

    /* Image zone */
    const imgDiv = document.createElement('div');
    imgDiv.className = `ss-product-img ${BG_CLASSES[idx % BG_CLASSES.length]}`;

    const picture = cells[0]?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imgDiv.append(
          createOptimizedPicture(img.src, img.alt || cells[2]?.textContent.trim() || '', false, [{ width: '400' }]),
        );
      }
    }

    const badgeText = cells[5]?.textContent.trim() || '';
    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = `ss-product-badge${badgeText.startsWith('BESTSELLER') ? ' ss-badge-gold' : ''}`;
      badge.textContent = badgeText;
      imgDiv.append(badge);
    }

    /* Body */
    const body = document.createElement('div');
    body.className = 'ss-product-body';

    const cat = document.createElement('div');
    cat.className = 'ss-product-cat';
    cat.textContent = cells[1]?.textContent.trim() || '';

    const name = document.createElement('h3');
    name.className = 'ss-product-name';
    name.textContent = cells[2]?.textContent.trim() || '';

    const sku = document.createElement('p');
    sku.className = 'ss-product-sku';
    sku.textContent = cells[3]?.textContent.trim() || '';

    const footer = document.createElement('div');
    footer.className = 'ss-product-footer';

    const priceRaw = cells[4]?.textContent.trim() || '';
    const [amount, unit] = priceRaw.split('/').map((s) => s.trim());
    const price = document.createElement('div');
    price.className = 'ss-product-price';
    price.innerHTML = amount ? `${amount}${unit ? `<span>/ ${unit}</span>` : ''}` : '';

    const addBtn = document.createElement('button');
    addBtn.className = 'ss-add-btn';
    addBtn.type = 'button';
    addBtn.textContent = 'ADD →';
    addBtn.addEventListener('click', () => {
      addBtn.textContent = '✓ ADDED';
      addBtn.classList.add('ss-added');
      setTimeout(() => {
        addBtn.textContent = 'ADD →';
        addBtn.classList.remove('ss-added');
      }, 1400);
    });

    footer.append(price, addBtn);
    body.append(cat, name, sku, footer);
    article.append(imgDiv, body);
    grid.append(article);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
