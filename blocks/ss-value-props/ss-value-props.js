import { observeReveal, observeCounter } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const allRows = [...block.querySelectorAll(':scope > div')];
  const sepIdx = allRows.findIndex(
    (r) => r.children.length === 1 && r.children[0].textContent.trim() === '---',
  );
  const proseRows = sepIdx === -1 ? allRows : allRows.slice(0, sepIdx);
  const statRows = sepIdx === -1 ? [] : allRows.slice(sepIdx + 1);

  /* ── Left: prose ── */
  const left = document.createElement('div');
  left.className = 'ss-value-left ss-reveal-left';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'ss-value-eyebrow';
  eyebrow.textContent = proseRows[0]?.children[0]?.textContent.trim() || '';

  const h2 = document.createElement('h2');
  h2.className = 'ss-value-h2';
  h2.textContent = proseRows[1]?.children[0]?.textContent.trim() || '';

  const body = document.createElement('p');
  body.className = 'ss-value-body';
  body.textContent = proseRows[2]?.children[0]?.textContent.trim() || '';

  const ul = document.createElement('ul');
  ul.className = 'ss-value-points';
  proseRows.slice(3).forEach((row) => {
    const li = document.createElement('li');
    li.className = 'ss-value-point';
    const dot = document.createElement('span');
    dot.className = 'ss-vp-dot';
    dot.setAttribute('aria-hidden', 'true');
    li.append(dot, row.children[0]?.textContent.trim() || '');
    ul.append(li);
  });

  left.append(eyebrow, h2, body, ul);

  /* ── Right: stats ── */
  const right = document.createElement('div');
  right.className = 'ss-stat-grid ss-stagger ss-reveal-right';

  statRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'ss-stat-card';

    const num = document.createElement('div');
    num.className = 'ss-stat-num';
    const rawVal = cells[0]?.textContent.trim() || '';
    const match = rawVal.match(/^(\d+)(.*)$/);
    if (match) {
      const [, countTo, countSuffix] = match;
      num.dataset.countTo = countTo;
      num.dataset.countSuffix = countSuffix;
    }
    num.textContent = rawVal;

    const label = document.createElement('div');
    label.className = 'ss-stat-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    card.append(num, label);
    right.append(card);
  });

  block.replaceChildren(left, right);
  observeReveal(block);
  block.querySelectorAll('.ss-stat-num[data-count-to]').forEach(observeCounter);
}
