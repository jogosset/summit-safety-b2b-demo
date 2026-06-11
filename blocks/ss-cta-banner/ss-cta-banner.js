import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const left = document.createElement('div');
  left.className = 'ss-cta-left ss-reveal-left';

  const h2 = document.createElement('h2');
  h2.className = 'ss-cta-heading';
  h2.textContent = rows[0]?.children[0]?.textContent.trim() || '';

  const body = document.createElement('p');
  body.className = 'ss-cta-body';
  body.textContent = rows[1]?.children[0]?.textContent.trim() || '';

  left.append(h2, body);

  const right = document.createElement('div');
  right.className = 'ss-cta-right ss-reveal-right';

  const primaryLink = rows[2]?.querySelector('a');
  if (primaryLink) {
    primaryLink.className = 'ss-cta-btn ss-cta-btn-primary';
    right.append(primaryLink);
  }

  const secondaryLink = rows[3]?.querySelector('a');
  if (secondaryLink) {
    secondaryLink.className = 'ss-cta-btn ss-cta-btn-secondary';
    right.append(secondaryLink);
  }

  block.replaceChildren(left, right);
  observeReveal(block);
}
