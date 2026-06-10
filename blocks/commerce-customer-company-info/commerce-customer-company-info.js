import { CustomerCompanyInfo } from '@dropins/storefront-company-management/containers/CustomerCompanyInfo.js';
import { renderCompanyBlock } from '../../scripts/company.js';

// Initialize
import '../../scripts/initializers/company.js';

export default async function decorate(block) {
  await renderCompanyBlock(block, CustomerCompanyInfo);
}
