function createChevron() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('fill', 'none');
  svg.classList.add('pdp-spec-chevron');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M4 6l4 4 4-4');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.8');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return svg;
}

function buildTableFromParagraphs(specsDiv) {
  const rows = [];
  specsDiv.querySelectorAll('p').forEach((p) => {
    const strong = p.querySelector('strong');
    if (!strong) return;
    const label = strong.textContent.trim();
    strong.remove();
    const value = p.textContent.trim();
    rows.push({ label, value });
  });
  return rows;
}

function buildTableFromStrongs(specsDiv) {
  const rows = [];
  const strongs = [...specsDiv.querySelectorAll('strong')];
  strongs.forEach((strong) => {
    const label = strong.textContent.trim();
    let value = '';
    let node = strong.nextSibling;
    while (node) {
      if (node.nodeType === 1 && node.tagName === 'STRONG') break;
      value += node.textContent;
      node = node.nextSibling;
    }
    value = value.trim();
    rows.push({ label, value });
  });
  return rows;
}

function buildTable(specsDiv) {
  const table = document.createElement('table');
  table.className = 'pdp-spec-table';

  // Try <p>-based structure first (local dev), fall back to raw <strong> (AEM)
  let rows = buildTableFromParagraphs(specsDiv);
  if (rows.length === 0) {
    rows = buildTableFromStrongs(specsDiv);
  }

  rows.forEach(({ label, value }) => {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    const tdValue = document.createElement('td');
    tdLabel.textContent = label;
    tdValue.textContent = value;
    tr.append(tdLabel, tdValue);
    table.append(tr);
  });

  return table;
}

export default function decorate(block) {
  const items = [...block.children];
  block.textContent = '';

  items.forEach((row, index) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const title = cols[0].textContent.trim();

    const details = document.createElement('details');
    details.className = 'pdp-spec-item';
    if (index === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'pdp-spec-summary';
    const label = document.createElement('p');
    label.textContent = title;
    summary.append(label, createChevron());

    const body = document.createElement('div');
    body.className = 'pdp-spec-body';
    body.append(buildTable(cols[1]));

    details.append(summary, body);
    block.append(details);
  });
}
