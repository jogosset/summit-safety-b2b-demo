export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')].map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'ss-trust-item';

    const icon = document.createElement('span');
    icon.className = 'ss-trust-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const wrap = document.createElement('div');
    wrap.className = 'ss-trust-text';

    const label = document.createElement('strong');
    label.className = 'ss-trust-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    const sub = document.createElement('span');
    sub.className = 'ss-trust-sub';
    sub.textContent = cells[2]?.textContent.trim() || '';

    wrap.append(label, sub);
    item.append(icon, wrap);
    return item;
  });

  block.replaceChildren(...items);
}
