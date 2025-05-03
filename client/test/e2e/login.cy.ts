import { TEST_PASSWORD, TEST_USER, TEST_USER2 } from '../support/constants';
import * as sel from '../support/selectors';

describe('login', () => {
  beforeEach(() => {
    cy.seedDb();
  });

  it('logs in and out', () => {
    cy.visit('/');

    sel.login.user().type(TEST_USER);
    sel.login.password().type('fake');
    sel.login.submitBtn().click();

    sel.login.user().type(TEST_USER);
    sel.login.password().type(TEST_PASSWORD);
    sel.login.submitBtn().click();
    sel.common.navBarLink('languages').click();
    sel.languages.listItem(0).find('input').should('have.value', 'Eesti');

    sel.common.navBarLink('user').click();
    sel.user.logoutBtn().click();

    sel.login.user().type(TEST_USER2);
    sel.login.password().type(TEST_PASSWORD);
    sel.login.submitBtn().click();
    sel.common.navBarLink('languages').click();
    sel.languages.listItem(0).find('input').should('have.value', 'Polska');
  });
});
