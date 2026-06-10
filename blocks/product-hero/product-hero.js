/**
 * Product Hero block
 * Renders a large product image alongside name, price, short description, and a CTA.
 * Product name, price, and short description are fetched live from the catalog
 * service using an authored SKU — the SKU row is consumed by JS and never rendered.
 * Supports light (default) and dark themes via a data-theme attribute set from
 * the block's variant class (add "dark" variant in the authoring table).
 *
 * Expected authored structure (two-column table):
 * | Product Hero |                   |
 * |--------------|-------------------|
 * | sku          | MH01-XS-Black     |  ← consumed, not rendered
 * | [image]      | [CTA link]        |
 *
 * @param {Element} block the block element
 */
import {
  performCatalogServiceQuery,
  renderPrice,
} from '../product-teaser/product-teaser-utils.js';

const PRODUCT_HERO_QUERY = `query productHero($sku: String!) {
  products(skus: [$sku]) {
    name
    shortDescription
    ... on SimpleProductView {
      price {
        ...priceFields
      }
    }
    ... on ComplexProductView {
      priceRange {
        minimum { ...priceFields }
        maximum { ...priceFields }
      }
    }
  }
}
fragment priceFields on ProductViewPrice {
  regular { amount { currency value } }
  final { amount { currency value } }
}`;

export default async function decorate(block) {
  // Set data-theme from variant class; default to light
  block.dataset.theme = block.classList.contains('dark') ? 'dark' : 'light';

  // --- Extract SKU from key-value row (first cell text = "sku") ---
  let sku = null;
  const allRows = [...block.querySelectorAll(':scope > div')];
  const skuRow = allRows.find((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    return cells.length === 2 && cells[0].textContent.trim().toLowerCase() === 'sku';
  });

  if (skuRow) {
    const skuCells = [...skuRow.querySelectorAll(':scope > div')];
    sku = skuCells[1]?.textContent.trim() || null;
    skuRow.remove();
  }

  // --- Remaining row: image (left) + CTA content (right) ---
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.querySelectorAll(':scope > div')];
  const [mediaCell, contentCell] = cells;

  // --- Media ---
  const media = document.createElement('div');
  media.className = 'ph-media';
  const picture = mediaCell?.querySelector('picture');
  if (picture) media.append(picture);

  // --- Content shell (rendered immediately; name/price/desc filled after fetch) ---
  const content = document.createElement('div');
  content.className = 'ph-content';

  const nameEl = document.createElement('h2');
  nameEl.className = 'ph-name';

  const priceEl = document.createElement('div');
  priceEl.className = 'ph-price';

  const descEl = document.createElement('p');
  descEl.className = 'ph-description';

  // Extract CTA from authored content cell
  let ctaDiv = null;
  if (contentCell) {
    const ctaP = [...contentCell.querySelectorAll('p')].find((p) => p.querySelector('a'));
    if (ctaP) {
      const link = ctaP.querySelector('a');
      link.className = 'button primary';
      ctaDiv = document.createElement('div');
      ctaDiv.className = 'ph-cta';
      ctaDiv.append(link);
    }
  }

  content.append(nameEl, priceEl, descEl);
  if (ctaDiv) content.append(ctaDiv);

  block.replaceChildren(media, content);

  // --- Fetch product data ---
  if (!sku) return;

  try {
    const data = await performCatalogServiceQuery(PRODUCT_HERO_QUERY, { sku });
    const product = data?.products?.[0];
    if (!product) return;

    const {
      name, shortDescription, price, priceRange,
    } = product;

    if (name) nameEl.textContent = name;

    if (price || priceRange) {
      const currency = price?.final?.amount?.currency
        || priceRange?.minimum?.final?.amount?.currency;
      const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
      priceEl.innerHTML = renderPrice(product, formatter.format);
    }

    if (shortDescription) descEl.innerHTML = shortDescription;
  } catch {
    // Fail silently — block still renders with empty name/price/desc
  }
}
