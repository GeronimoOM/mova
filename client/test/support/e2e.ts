import { login } from './api';
import './commands';
import { ENV_ADMIN_TOKEN } from './constants';
import { readSecrets } from './utils';

before(() => {
  readSecrets().then(({ name, password }) => {
    login(name, password).then((token) => {
      Cypress.env(ENV_ADMIN_TOKEN, token);
    });
  });
});

beforeEach(() => {
  cy.resetSw();
});
