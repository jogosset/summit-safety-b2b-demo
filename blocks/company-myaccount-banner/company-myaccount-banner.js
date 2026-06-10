/**
 * Company My Account Banner block
 * A thin wide banner with a logo image on the left and a freeform rich-text
 * area on the right. Banner height is driven by the logo image size (defaults
 * to a 100×100 placeholder when no image is supplied).
 *
 * Optional config rows (key-value, consumed by JS, never rendered):
 *   bgcolor     — CSS color for the banner background
 *   text-color  — CSS color for all text in the banner
 *
 * Authored table structure:
 * | Company My Account Banner |                              |
 * |---------------------------|------------------------------|
 * | bgcolor                   | #003087                      |  ← optional, removed
 * | text-color                | #ffffff                      |  ← optional, removed
 * | [logo image]              | Rich text content (freeform) |
 *
 * @param {Element} block the block element
 */
export default function decorate(block) {
  const CONFIG_KEYS = ['bgcolor', 'text-color'];
  const rows = [...block.querySelectorAll(':scope > div')];

  // --- Parse and remove config key-value rows ---
  const config = {};
  const contentRows = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length === 2) {
      const key = cells[0].textContent.trim().toLowerCase().replace(/\s+/g, '-');
      if (CONFIG_KEYS.includes(key)) {
        config[key] = cells[1].textContent.trim();
        row.remove();
        return;
      }
    }
    contentRows.push(row);
  });

  // Apply color custom properties
  if (config.bgcolor) block.style.setProperty('--cmab-bgcolor', config.bgcolor);
  if (config['text-color']) block.style.setProperty('--cmab-text-color', config['text-color']);

  // --- Build from the first content row ---
  const contentRow = contentRows[0];
  if (!contentRow) return;

  const cells = [...contentRow.querySelectorAll(':scope > div')];
  const [logoCell, textCell] = cells;

  // Logo
  const logo = document.createElement('div');
  logo.className = 'cmab-logo';
  const picture = logoCell?.querySelector('picture');
  if (picture) {
    logo.append(picture);
  } else {
    // 100×100 placeholder when no image is authored
    const placeholder = document.createElement('div');
    placeholder.className = 'cmab-logo-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    logo.append(placeholder);
  }

  // Rich text content — re-use all child nodes to preserve authored formatting
  const text = document.createElement('div');
  text.className = 'cmab-text';
  if (textCell) {
    [...textCell.childNodes].forEach((node) => text.append(node));
  }

  block.replaceChildren(logo, text);
}
