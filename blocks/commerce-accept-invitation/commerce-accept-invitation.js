import { AcceptInvitation } from '@dropins/storefront-company-management/containers/AcceptInvitation.js';
import { getAcceptInvitationProps, renderCompanyBlock } from '../../scripts/company.js';

// Initialize
import '../../scripts/initializers/company.js';

export default async function decorate(block) {
  await renderCompanyBlock(block, AcceptInvitation, getAcceptInvitationProps(), {
    requiresAuth: false,
  });
}
