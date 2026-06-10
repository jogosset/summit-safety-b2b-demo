/**
 * Site Nav JG Block
 * Full-width navigation bar with author-configurable colors, dropdown sub-navigation,
 * and optional breadcrumb row. Uses a grouped-row content model where config rows
 * appear at the bottom of the table.
 *
 * DA.live content model:
 *   - A row with text in col 1 starts a new top-level category
 *   - Subsequent rows with empty col 1 and text/link in col 2 are sub-items
 *   - Config rows at the bottom: "Background Color", "Text Color", "Hover Accent Color"
 *   - Optional "Breadcrumb" row
 *
 * @param {HTMLElement} block - The block element
 */
export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';

  const rows = [...block.querySelectorAll(':scope > div')];

  // Helper: find config row by label (case-insensitive)
  const getConfigValue = (label) => {
    const row = rows.find(
      (r) => r.querySelector(':scope > div')?.textContent?.trim().toLowerCase() === label.toLowerCase(),
    );
    return row?.querySelector(':scope > div:last-child')?.textContent?.trim() ?? '';
  };

  // Extract config values (rows at the bottom of the table)
  const bgColor = getConfigValue('background color') || '#000000';
  const textColor = getConfigValue('text color') || '#ffffff';
  const accentColor = getConfigValue('hover accent color') || '#fefefe';

  // Identify config and special rows to exclude from nav parsing
  const configLabels = ['background color', 'text color', 'hover accent color'];
  const breadcrumbLabel = 'breadcrumb';

  let breadcrumbRow = null;
  const contentRows = [];

  rows.forEach((r) => {
    const label = r.querySelector(':scope > div')?.textContent?.trim().toLowerCase();
    if (configLabels.includes(label)) return;
    if (label === breadcrumbLabel) {
      breadcrumbRow = r;
      return;
    }
    contentRows.push(r);
  });

  // Parse grouped-row content model into nav items
  // A row with text in col 1 starts a new group (top-level category)
  // Subsequent rows with empty col 1 are sub-items of that group
  const navItems = [];

  contentRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const col1Text = cells[0]?.textContent?.trim() || '';
    const col2 = cells[1];
    const col2Text = col2?.textContent?.trim() || '';

    // Skip completely empty rows (spacers)
    if (!col1Text && !col2Text) return;

    if (col1Text) {
      // New top-level category
      navItems.push({
        name: col1Text,
        subItems: [],
      });
      // If col 2 has content on the same row as the category, add it as a sub-item
      if (col2) {
        const links = [...col2.querySelectorAll('a')];
        if (links.length > 0) {
          links.forEach((link) => {
            navItems[navItems.length - 1].subItems.push({
              label: link.textContent.trim(),
              href: link.href,
            });
          });
        } else if (col2Text) {
          // Plain text sub-item on the category row (no link)
          navItems[navItems.length - 1].subItems.push({
            label: col2Text,
            href: '#',
          });
        }
      }
    } else if (col2 && navItems.length > 0) {
      // Sub-item row (empty col 1, content in col 2)
      const links = [...col2.querySelectorAll('a')];
      if (links.length > 0) {
        links.forEach((link) => {
          navItems[navItems.length - 1].subItems.push({
            label: link.textContent.trim(),
            href: link.href,
          });
        });
      } else if (col2Text) {
        // Plain text sub-item (no link)
        navItems[navItems.length - 1].subItems.push({
          label: col2Text,
          href: '#',
        });
      }
    }
  });

  // Apply custom colors as CSS variables
  block.style.setProperty('--nav-bg-color', bgColor);
  block.style.setProperty('--nav-text-color', textColor);
  block.style.setProperty('--nav-accent-color', accentColor);

  // Build wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'site-nav-jg__wrapper';

  // --- Main Nav Bar ---
  const navBar = document.createElement('div');
  navBar.className = 'site-nav-jg__bar';

  const navInner = document.createElement('nav');
  navInner.className = 'site-nav-jg__inner';
  navInner.setAttribute('aria-label', 'Main navigation');

  // Hamburger button (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'site-nav-jg__hamburger';
  hamburger.setAttribute('aria-label', 'Toggle navigation menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="site-nav-jg__hamburger-icon"></span>';
  navInner.appendChild(hamburger);

  // Nav list
  const ul = document.createElement('ul');
  ul.className = 'site-nav-jg__list';

  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'site-nav-jg__item';

    if (item.subItems.length > 0) {
      li.classList.add('site-nav-jg__item--has-children');

      const trigger = document.createElement('button');
      trigger.className = 'site-nav-jg__trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = `<span>${item.name}</span><svg class="site-nav-jg__chevron" aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      li.appendChild(trigger);

      // Dropdown
      const dropdown = document.createElement('div');
      dropdown.className = 'site-nav-jg__dropdown';
      const subUl = document.createElement('ul');
      subUl.className = 'site-nav-jg__sub-list';
      item.subItems.forEach((sub) => {
        const subLi = document.createElement('li');
        subLi.className = 'site-nav-jg__sub-item';
        const a = document.createElement('a');
        a.href = sub.href;
        a.textContent = sub.label;
        a.className = 'site-nav-jg__sub-link';
        subLi.appendChild(a);
        subUl.appendChild(subLi);
      });
      dropdown.appendChild(subUl);
      li.appendChild(dropdown);

      // Desktop hover
      li.addEventListener('mouseenter', () => {
        trigger.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', () => {
        trigger.setAttribute('aria-expanded', 'false');
      });

      // Click toggle (mobile + accessibility)
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        ul.querySelectorAll('.site-nav-jg__trigger[aria-expanded="true"]').forEach((other) => {
          if (other !== trigger) other.setAttribute('aria-expanded', 'false');
        });
        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
    } else {
      // Direct link item (no sub-nav, no chevron)
      const a = document.createElement('a');
      a.className = 'site-nav-jg__link';
      a.href = '#';
      a.textContent = item.name;
      li.appendChild(a);
    }

    ul.appendChild(li);
  });

  navInner.appendChild(ul);
  navBar.appendChild(navInner);
  wrapper.appendChild(navBar);

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    ul.classList.toggle('site-nav-jg__list--open');
  });

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navInner.querySelectorAll('.site-nav-jg__trigger[aria-expanded="true"]').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
      if (hamburger.getAttribute('aria-expanded') === 'true') {
        hamburger.setAttribute('aria-expanded', 'false');
        ul.classList.remove('site-nav-jg__list--open');
      }
    }
  });

  // --- Breadcrumb Row (optional) ---
  if (breadcrumbRow) {
    const bcCell = breadcrumbRow.querySelector(':scope > div:last-child');
    if (bcCell) {
      const bcBar = document.createElement('div');
      bcBar.className = 'site-nav-jg__breadcrumb-bar';

      const bcInner = document.createElement('nav');
      bcInner.className = 'site-nav-jg__breadcrumb-inner';
      bcInner.setAttribute('aria-label', 'Breadcrumb');

      const bcList = document.createElement('ol');
      bcList.className = 'site-nav-jg__breadcrumb-list';

      // Parse breadcrumb by walking child nodes
      // EDS wraps inline content in <p> tags, so look inside those
      const bcContainer = bcCell.querySelector('p') || bcCell;
      const bcSegments = [];
      bcContainer.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          bcSegments.push({ text: node.textContent.trim(), href: node.href });
        } else if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.textContent.split('>');
          parts.forEach((part) => {
            const trimmed = part.trim();
            if (trimmed) {
              bcSegments.push({ text: trimmed });
            }
          });
        }
      });

      bcSegments.forEach((seg, i) => {
        const bcLi = document.createElement('li');
        bcLi.className = 'site-nav-jg__breadcrumb-item';

        if (seg.href && i < bcSegments.length - 1) {
          const a = document.createElement('a');
          a.href = seg.href;
          a.textContent = seg.text;
          a.className = 'site-nav-jg__breadcrumb-link';
          bcLi.appendChild(a);
        } else {
          const span = document.createElement('span');
          span.className = 'site-nav-jg__breadcrumb-current';
          span.textContent = seg.text;
          if (i === bcSegments.length - 1) {
            span.setAttribute('aria-current', 'page');
          }
          bcLi.appendChild(span);
        }

        bcList.appendChild(bcLi);
      });

      bcInner.appendChild(bcList);
      bcBar.appendChild(bcInner);
      wrapper.appendChild(bcBar);
    }
  }

  // Replace block content
  block.textContent = '';
  block.appendChild(wrapper);
}
