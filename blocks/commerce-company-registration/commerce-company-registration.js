import CompanyRegistration from '@dropins/storefront-company-management/containers/CompanyRegistration.js';
import { getCompanyAuthProps, renderCompanyBlock } from '../../scripts/company.js';

// Initialize
import '../../scripts/initializers/company.js';

export default async function decorate(block) {
  await renderCompanyBlock(block, CompanyRegistration, getCompanyAuthProps(), {
    requiresAuth: false,
  });
}
