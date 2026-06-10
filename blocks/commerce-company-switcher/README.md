# Commerce Company Switcher Block

## Overview

The Commerce Company Switcher block lets B2B shoppers tied to multiple companies pick which company context they are shopping under. It uses the Adobe Commerce `@dropins/storefront-company-switcher` drop-in with a custom `PersistentCompanySwitcher` Preact component that keeps company and customer-group headers in sync with `sessionStorage` and the event bus.

The block is typically mounted from the site header (see `blocks/header/header.js`) inside a `.company-switcher-wrapper` container. If the visitor is not logged in, the block clears its content and does nothing.

## Integration

### Drop-in initialization

Company switcher APIs are initialized in `scripts/initializers/company-switcher.js` (GraphQL endpoints, placeholders from `placeholders/company-switcher.json`, and `initialize` from the storefront company-switcher package). This block assumes that initializer has run before decorate.

### Block configuration

| Configuration Key | Type | Default | Description | Required | Side Effects |
|-------------------|------|---------|-------------|----------|--------------|
| *(none)* | — | — | This block does not read AEM block row/column config; behavior is driven by auth state and `CustomerCompanyContext` | — | — |

### URL parameters

No URL parameters are read by this block.

### Session storage

On company change, the implementation writes the selected company id and resolved customer group id using keys from the drop-in `config` (`companySessionStorageKey` and `groupSessionStorageKey`). Those keys are removed when the corresponding value is empty.

### Events

**Subscribed (via `@dropins/tools/event-bus`):**

| Event | Purpose |
|-------|---------|
| `authenticated` | Reloads company list when the user signs in; resets local state when signed out |
| `companyContext/changed` | Syncs the picker when company context changes elsewhere; clears state if id is cleared |
| `company/updated` | Updates option labels and current selection when company metadata changes |

**Emitted:**

| Event | Payload | When |
|-------|---------|------|
| `companyContext/changed` | `companyId` | After a successful picker change, once headers and storage are updated |

## Behavior patterns

### Visibility

- **Unauthenticated**: Block content is cleared in `decorate`; nothing is rendered.
- **Single company**: `PersistentCompanySwitcher` returns `null` when fewer than two companies exist, so no UI is shown.

### User interaction flows

1. **Load**: On mount, subscriptions run; if authenticated, customer companies load from `CustomerCompanyContext`.
2. **Change company**: User selects another company in the `Picker`. The drop-in sets company headers, updates `sessionStorage`, calls `updateCustomerGroup()` and sets group headers, invokes `onCompanyChange` (the block passes a handler that reloads the page), and emits `companyContext/changed`.
3. **Sign out**: Authentication handler resets cached context and clears local component state.

### Error handling

- **Failed company load**: Errors in `loadCompanies` are logged with `console.error`; the user may see an empty or stale UI depending on prior state.
- **Render guard**: Unauthenticated users never see the drop-in UI.
