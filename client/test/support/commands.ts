import { clearData, importData, login } from './api';
import { FIXTURE_DATA, IDB_NAME } from './constants';
import { promisifyIdbRequest } from './utils';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      seedDb(): Chainable<void>;

      resetSw(): Chainable<void>;

      disableSw(): Chainable<void>;

      login(name: string, password: string): Chainable<string>;
    }
  }
}

Cypress.Commands.add('seedDb', () => {
  clearData();
  importData(FIXTURE_DATA);
});

Cypress.Commands.add('resetSw', () => {
  cy.window().then((win) =>
    promisifyIdbRequest(win.indexedDB.deleteDatabase(IDB_NAME)),
  );
});

Cypress.Commands.add('disableSw', () => {
  cy.window().then(async (win) => {
    if (!win.navigator?.serviceWorker) {
      return;
    }
    const registrations = await navigator.serviceWorker.getRegistrations();
    return Promise.all(
      registrations.map((registration) => registration.unregister()),
    );
  });
});

Cypress.Commands.add('login', (name, password) => {
  return cy.session(name, () => {
    login(name, password).then((token) => {
      cy.window().then((win) => win.localStorage.setItem('jwtToken', token));
    });
  });
});
