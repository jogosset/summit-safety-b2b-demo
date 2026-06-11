import { createOptimizedPicture } from '../../scripts/aem.js';

function buildHeroLeft(rows) {
  const left = document.createElement('div');
  left.className = 'ss-hero-left';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'ss-hero-eyebrow';
  eyebrow.textContent = rows[0]?.children[0]?.textContent.trim() || '';
  left.append(eyebrow);

  const h1 = document.createElement('h1');
  h1.className = 'ss-hero-h1';
  const rawHeading = rows[1]?.children[0]?.textContent.trim() || '';
  // Wrap the word "SUMMIT" in <em> for gold highlight
  h1.innerHTML = rawHeading
    .split(' ')
    .map((w) => (w.toUpperCase() === 'SUMMIT' ? `<em>${w}</em>` : w))
    .join(' ');
  left.append(h1);

  const sub = document.createElement('p');
  sub.className = 'ss-hero-sub';
  sub.textContent = rows[2]?.children[0]?.textContent.trim() || '';
  left.append(sub);

  const ctas = document.createElement('div');
  ctas.className = 'ss-hero-ctas';

  const primaryLink = rows[3]?.querySelector('a');
  if (primaryLink) {
    primaryLink.className = 'ss-btn ss-btn-primary';
    ctas.append(primaryLink);
  }

  const secondaryLink = rows[4]?.querySelector('a');
  if (secondaryLink) {
    secondaryLink.className = 'ss-btn ss-btn-outline-light';
    ctas.append(secondaryLink);
  }

  left.append(ctas);
  return left;
}

function buildHeroRight(rows) {
  const right = document.createElement('div');
  right.className = 'ss-hero-right';

  // Decorative rings
  [1, 2, 3].forEach((n) => {
    const ring = document.createElement('div');
    ring.className = `ss-hero-ring ss-hero-ring-${n}`;
    right.append(ring);
  });

  const badge = document.createElement('div');
  badge.className = 'ss-hero-badge';
  badge.textContent = rows[5]?.children[0]?.textContent.trim() || '';
  right.append(badge);

  // Hero image
  const imgZone = document.createElement('div');
  imgZone.className = 'ss-hero-img-zone';
  const picture = rows[6]?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      imgZone.append(createOptimizedPicture(img.src, img.alt || 'Hero product', true, [{ width: '800' }]));
    }
  }
  right.append(imgZone);

  // Stats strip
  const stats = document.createElement('div');
  stats.className = 'ss-hero-stats';
  [rows[7], rows[8], rows[9]].forEach((row) => {
    if (!row) return;
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'ss-hero-stat';
    const num = document.createElement('div');
    num.className = 'ss-hero-stat-num';
    const rawVal = cells[0]?.textContent.trim() || '';
    // Strip suffix so counter can animate; re-attach as data-count-suffix
    const match = rawVal.match(/^(\d+)(.*)$/);
    if (match) {
      const [, countTo, countSuffix] = match;
      num.dataset.countTo = countTo;
      num.dataset.countSuffix = countSuffix;
    }
    num.textContent = rawVal;
    const label = document.createElement('div');
    label.className = 'ss-hero-stat-label';
    label.textContent = cells[1]?.textContent.trim() || '';
    item.append(num, label);
    stats.append(item);
  });
  right.append(stats);

  return right;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const left = buildHeroLeft(rows);
  const right = buildHeroRight(rows);
  block.replaceChildren(left, right);

  // Entry animations — add .ss-animated to trigger CSS animations
  requestAnimationFrame(() => {
    block.querySelectorAll(
      '.ss-hero-eyebrow, .ss-hero-h1, .ss-hero-sub, .ss-hero-ctas',
    ).forEach((el, i) => {
      el.style.animationDelay = `${i * 140}ms`;
      el.classList.add('ss-anim-fade-up');
    });
    block.querySelector('.ss-hero-img-zone')?.classList.add('ss-anim-scale-in');
    block.querySelector('.ss-hero-badge')?.classList.add('ss-anim-fade-up');
  });

  // Counter animation for stat numbers
  import('../../scripts/ss-animations.js').then(({ observeCounter }) => {
    block.querySelectorAll('.ss-hero-stat-num[data-count-to]').forEach(observeCounter);
  });
}
