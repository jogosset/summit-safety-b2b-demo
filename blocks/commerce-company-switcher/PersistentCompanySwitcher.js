import {
  Picker,
} from '@dropins/tools/components.js';
import { events } from '@dropins/tools/event-bus.js';
import { useCallback, useEffect, useState } from '@dropins/tools/preact-hooks.js';
import { h } from '@dropins/tools/preact.js';
import {
  config,
  CustomerCompanyContext,
  getCompanyHeaderManager,
  getGroupHeaderManager,
  updateCustomerGroup,
} from '@dropins/storefront-company-switcher/api.js';

const EMPTY_COMPANY = {
  text: '',
  value: '',
};

function getSelectedCompany(companies, companyId) {
  return companies.find(({ value }) => value === companyId) || null;
}

export default function PersistentCompanySwitcher({
  ariaLabel,
  onCompanyChange,
  ...props
}) {
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(EMPTY_COMPANY);

  const loadCompanies = useCallback(async () => {
    try {
      const companyContext = await CustomerCompanyContext.getInstance().getCustomerCompanyInfo();

      setCompanies(companyContext.customerCompanies);

      if (companyContext.currentCompany?.id && companyContext.currentCompany?.name) {
        setCurrentCompany({
          text: companyContext.currentCompany.name,
          value: companyContext.currentCompany.id,
        });
      } else {
        setCurrentCompany(EMPTY_COMPANY);
      }
    } catch (error) {
      console.error('Failed to load company data:', error);
    }
  }, []);

  const resetCompanyState = useCallback(() => {
    CustomerCompanyContext.getInstance().resetCache();
    setCompanies([]);
    setCurrentCompany(EMPTY_COMPANY);
  }, []);

  const handleCompanyChange = useCallback(async (event) => {
    const companyId = event.target.value;
    const selectedCompany = getSelectedCompany(companies, companyId);

    if (selectedCompany) {
      setCurrentCompany(selectedCompany);
    }

    const dropinConfig = config.getConfig();
    getCompanyHeaderManager().setCompanyHeaders(companyId);

    if (companyId) {
      sessionStorage.setItem(dropinConfig.companySessionStorageKey, companyId);
    } else {
      sessionStorage.removeItem(dropinConfig.companySessionStorageKey);
    }

    const customerGroupId = await updateCustomerGroup();
    getGroupHeaderManager().setGroupHeaders(customerGroupId);

    if (customerGroupId) {
      sessionStorage.setItem(dropinConfig.groupSessionStorageKey, customerGroupId);
    } else {
      sessionStorage.removeItem(dropinConfig.groupSessionStorageKey);
    }

    onCompanyChange?.({
      id: companyId,
      name: selectedCompany?.text || '',
    });

    events.emit('companyContext/changed', companyId);
  }, [companies, onCompanyChange]);

  const handleAuthenticationChange = useCallback((isAuthenticated) => {
    if (isAuthenticated) {
      loadCompanies();
      return;
    }

    resetCompanyState();
  }, [loadCompanies, resetCompanyState]);

  const handleCompanyContextChanged = useCallback((companyId) => {
    if (!companyId) {
      resetCompanyState();
      return;
    }

    setCurrentCompany((previousCompany) => (
      getSelectedCompany(companies, companyId) || previousCompany
    ));
  }, [companies, resetCompanyState]);

  const handleCompanyUpdated = useCallback(({ company }) => {
    setCompanies((currentCompanies) => currentCompanies.map((current) => (
      current.value === company.id
        ? { ...current, text: company.name }
        : current
    )));
    setCurrentCompany({
      text: company.name,
      value: company.id,
    });
  }, []);

  useEffect(() => {
    const authenticatedSubscription = events.on(
      'authenticated',
      handleAuthenticationChange,
      { eager: true },
    );
    const companyContextSubscription = events.on(
      'companyContext/changed',
      handleCompanyContextChanged,
      { eager: true },
    );
    const companyUpdatedSubscription = events.on('company/updated', handleCompanyUpdated);

    return () => {
      authenticatedSubscription?.off();
      companyContextSubscription?.off();
      companyUpdatedSubscription?.off();
    };
  }, [handleAuthenticationChange, handleCompanyContextChanged, handleCompanyUpdated]);

  if (companies.length < 2) {
    return null;
  }

  return h(
    'div',
    props,
    h(Picker, {
      options: companies,
      value: currentCompany.value,
      onChange: handleCompanyChange,
      'aria-label': ariaLabel || 'Select company',
      'aria-describedby': 'company-switcher-description',
    }),
  );
}
