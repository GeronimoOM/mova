import { ENV_ADMIN_TOKEN } from './constants';
import { uploadFormData } from './utils';

export function login(
  name: string,
  password: string,
): Cypress.Chainable<string> {
  return cy
    .request({
      method: 'POST',
      url: '/api/login',
      body: { name, password },
    })
    .then(({ body }) => body.token);
}

export function importData(dataFixture: string): Cypress.Chainable {
  return uploadFormData(dataFixture).then((formData) => {
    cy.request({
      method: 'POST',
      url: '/api/data',
      body: formData,
      auth: {
        bearer: Cypress.env(ENV_ADMIN_TOKEN),
      },
    });
  });
}

export function clearData(): Cypress.Chainable {
  return cy.request({
    method: 'DELETE',
    url: '/api/data',
    auth: {
      bearer: Cypress.env(ENV_ADMIN_TOKEN),
    },
  });
}
