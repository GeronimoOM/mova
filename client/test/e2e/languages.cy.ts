import { TEST_PASSWORD, TEST_USER } from '../support/constants';
import {
  TestModes,
  testModeTitle,
  testModeVisitOptions,
} from '../support/modes';
import * as sel from '../support/selectors';

describe('languages', () => {
  beforeEach(() => {
    cy.seedDb();
    cy.login(TEST_USER, TEST_PASSWORD);
  });

  TestModes.forEach((mode) => {
    describe(testModeTitle[mode], () => {
      it('shows list of languages', () => {
        cy.visit('/languages', testModeVisitOptions[mode]);

        sel.languages.listItems().should('have.length', 2);
        sel.languages.listItem(0).find('input').should('have.value', 'Eesti');
        sel.languages
          .listItem(1)
          .find('input')
          .should('have.value', 'Deutsche');

        sel.languages.listItem(0).should('have.attr', 'data-selected');
      });

      it('switches selected language', () => {
        cy.visit('/languages', testModeVisitOptions[mode]);
        sel.languages.listItem(0).should('have.attr', 'data-selected');

        sel.common.navBarLink('words').click();
        sel.words.listItems().contains('asjata');
        sel.common.navBarLink('properties').click();
        sel.properties.listItemName(0).should('have.value', 'ainsuse omastav');

        sel.common.navBarLink('languages').click();
        sel.languages.listItem(1).within(() => {
          sel.language.selectBtn().click();
        });
        sel.languages.listItem(1).should('have.attr', 'data-selected');
        sel.common.navBarLink('words').click();
        sel.words.listItems().contains('Natur');
        sel.common.navBarLink('properties').click();
        sel.properties.listItemName(0).should('have.value', 'Geschlecht');

        cy.visit('/languages', testModeVisitOptions[mode]);
        sel.languages.listItem(1).should('have.attr', 'data-selected');
      });

      it('creates language', () => {
        cy.visit('/languages', testModeVisitOptions[mode]);

        sel.languages.listItems().should('have.length', 2);
        sel.languages.createBtn().click();
        sel.languages.listItemNew().within(() => {
          cy.get('input').type('Svenska');
          sel.language.saveBtn().click();
        });

        const assertCreated = () => {
          sel.languages.listItems().should('have.length', 3);
          sel.languages
            .listItem(-1)
            .find('input')
            .should('have.value', 'Svenska');
          sel.languages.listItem(-1).should('have.attr', 'data-selected');

          sel.common.navBarLink('words').click();
          sel.words.listItems().should('have.length', 0);
        };

        assertCreated();

        cy.visit('/languages', testModeVisitOptions[mode]);
        assertCreated();
      });

      it('updates language', () => {
        cy.visit('/languages', testModeVisitOptions[mode]);

        sel.languages.listItem(0).within(() => {
          cy.get('input').type(' ');
          sel.language.saveBtn().should('not.be.enabled');

          cy.get('input').clear().type('Estonian');
          sel.language.saveBtn().click();
        });

        const assertUpdated = () => {
          sel.languages
            .listItem(0)
            .find('input')
            .should('have.value', 'Estonian');
        };

        assertUpdated();

        cy.visit('/languages', testModeVisitOptions[mode]);
        assertUpdated();
      });

      it('deletes language', () => {
        cy.visit('/languages', testModeVisitOptions[mode]);

        sel.languages.listItems().should('have.length', 2);
        sel.languages.listItem(1).within(() => {
          sel.language.deleteBtn().click();
          sel.language.deleteCancelBtn().click();

          sel.language.deleteBtn().click();
          sel.language.deleteConfirmBtn().click();
        });

        const assertDeleted = () => {
          sel.languages.listItems().should('have.length', 1);
        };

        assertDeleted();

        cy.visit('/languages', testModeVisitOptions[mode]);
        assertDeleted();
      });
    });
  });
});
