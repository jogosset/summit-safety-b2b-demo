import { render as companySwitcherRenderer } from '@dropins/storefront-company-switcher/render.js';
import { checkIsAuthenticated } from '../../scripts/commerce.js';
import PersistentCompanySwitcher from './PersistentCompanySwitcher.js';

// Initialize
import '../../scripts/initializers/company-switcher.js';

export default async function decorate(block) {
  if (!checkIsAuthenticated()) {
    block.textContent = '';
    return;
  }

  await companySwitcherRenderer.render(PersistentCompanySwitcher, {
    ariaLabel: 'Select company',
    onCompanyChange: () => {
      window.location.reload();
    },
  })(block);
}
