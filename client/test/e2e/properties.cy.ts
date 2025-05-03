import { TEST_PASSWORD, TEST_USER } from '../support/constants';
import {
  TestModes,
  testModeTitle,
  testModeVisitOptions,
} from '../support/modes';
import * as sel from '../support/selectors';

describe('properties', () => {
  beforeEach(() => {
    cy.seedDb();
    cy.login(TEST_USER, TEST_PASSWORD);
  });

  TestModes.forEach((mode) => {
    describe(testModeTitle[mode], () => {
      it('shows list of properties', () => {
        cy.visit('/properties', testModeVisitOptions[mode]);

        sel.properties.listItems().should('have.length', 5);
        sel.properties.listItemName(0).should('have.value', 'ainsuse omastav');
        sel.properties.listItemName(1).should('have.value', 'ainsuse osastav');
        sel.properties.listItemName(2).should('have.value', 'mitmuse omastav');
        sel.properties.listItemName(3).should('have.value', 'mitmuse osastav');
        sel.properties
          .listItemName(4)
          .should('have.value', 'lühike sisseütlev');

        sel.properties.partOfSpeechTab('verb').click();
        sel.properties.listItems().should('have.length', 5);
        sel.properties.listItemName(0).should('have.value', 'da-tegevusnimi');
        sel.properties
          .listItemName(1)
          .should('have.value', 'oleviku ainsuse 3. isik');
        sel.properties
          .listItemName(2)
          .should('have.value', 'lihtmineviku ainsuse 3. isik');
        sel.properties.listItemName(3).should('have.value', 'tud-kesksõna');
        sel.properties.listItemName(4).should('have.value', 'rektsioon');
      });

      it('creates property', () => {
        cy.visit('/properties', testModeVisitOptions[mode]);

        sel.properties.partOfSpeechTab('verb').click();
        sel.properties.listItems().should('have.length', 5);
        sel.properties.createBtn().click();
        sel.properties.listItemNew().within(() => {
          sel.property.name().type('text prop');
          sel.property.saveBtn().click();
        });

        sel.properties.createBtn().click();
        sel.properties.listItemNew().within(() => {
          sel.property.typePill('text').click();
          sel.property.typePill('option').click();

          sel.property.name().type('option prop');

          sel.property.optionAddBtn().click();
          sel.property.option('').find('input').type('blue');
          sel.property.option('blue').within(() => {
            sel.common.optionColorPicker().click();
            sel.common.optionColorPickerOption('blue').click();
          });

          sel.property.optionAddBtn().click();
          sel.property.option('').find('input').type('yellow');
          sel.property.option('yellow').within(() => {
            sel.common.optionColorPicker().click();
            sel.common.optionColorPickerOption('yellow').click();
          });

          sel.property.saveBtn().click();
        });

        const assertCreated = () => {
          sel.properties.listItems().should('have.length', 7);

          sel.properties.listItem(-2).within(() => {
            sel.property.name().should('have.value', 'text prop');
            sel.property.typePill('text').should('be.visible');
          });

          sel.properties.listItem(-1).within(() => {
            sel.property.name().should('have.value', 'option prop');
            sel.property.typePill('option').should('be.visible');

            sel.property
              .option('blue')
              .should('have.attr', 'data-option-color', 'blue');
            sel.property
              .option('yellow')
              .should('have.attr', 'data-option-color', 'yellow');
          });
        };

        assertCreated();

        cy.visit('/properties', testModeVisitOptions[mode]);
        sel.properties.partOfSpeechTab('verb').click();
        assertCreated();
      });

      it('updates property', () => {
        cy.visit('/properties', testModeVisitOptions[mode]);

        sel.properties.partOfSpeechTab('verb').click();
        sel.properties.listItem(-1).within(($listItem) => {
          cy.wrap($listItem).click();
          sel.property.name().should('have.value', 'rektsioon').type(' ');
          sel.property.saveBtn().should('not.be.enabled');

          sel.property.options().should('have.length', 6);
          sel.property.optionAddBtn().click();
          sel.property.option('').type('new');
          sel.property.option('new').within(() => {
            sel.common.optionDeleteBtn().click();
          });
          sel.property.saveBtn().should('not.be.enabled');

          sel.property.option('et').within(() => {
            sel.common.optionDeleteBtn().click();
            sel.common.optionRestoreBtn().click();
          });
          sel.property.saveBtn().should('not.be.enabled');
        });

        sel.properties.listItem(-1).within(() => {
          sel.property.name().clear().type('rekt');

          sel.property.optionAddBtn().click();
          sel.property.option('').type('mille üle');
          sel.property.option('mille üle').within(() => {
            sel.common.optionColorPicker().click();
            sel.common.optionColorPickerOption('pink').click();
          });

          sel.property.optionAddBtn().click();
          sel.property.option('').type('mille eest');

          sel.property.option('keda/mida').find('input').clear().type('kes');

          sel.property.option('kellest/millest').within(() => {
            sel.common.optionColorPicker().click();
            sel.common.optionColorPickerOption('red').click();
          });

          sel.property.saveBtn().click();
        });

        sel.properties.listItem(-1).within(() => {
          sel.property.option('kuhu').within(() => {
            sel.common.optionDeleteBtn().click();
          });

          sel.property.saveBtn().click();
          sel.property.saveDeleteOptionCancelBtn().click();

          sel.property.saveBtn().click();
          sel.property.saveDeleteOptionConfirmBtn().click();
        });

        const assertUpdated = () => {
          sel.properties.listItem(-1).within(() => {
            sel.property.name().should('have.value', 'rekt');
            sel.property.options().should('have.length', 7);
            sel.property
              .option('kes')
              .should('have.attr', 'data-option-color', 'blue');
            sel.property
              .option('kellest/millest')
              .should('have.attr', 'data-option-color', 'red');
            sel.property
              .option('kellega/millega')
              .should('have.attr', 'data-option-color', 'teal');
            sel.property
              .option('kus')
              .should('have.attr', 'data-option-color', 'yellow');
            sel.property
              .option('et')
              .should('have.attr', 'data-option-color', 'brown');
            sel.property
              .option('mille üle')
              .should('have.attr', 'data-option-color', 'pink');
            sel.property
              .option('mille eest')
              .should('have.attr', 'data-option-color', 'empty');
          });
        };

        assertUpdated();

        cy.visit('/properties', testModeVisitOptions[mode]);
        sel.properties.partOfSpeechTab('verb').click();
        assertUpdated();
      });

      it('deletes property', () => {
        cy.visit('/properties', testModeVisitOptions[mode]);

        sel.properties.partOfSpeechTab('misc').click();
        sel.properties.listItems().should('have.length', 2);
        sel.properties.listItem(0).within(($listItem) => {
          cy.wrap($listItem).click();
          sel.property.name().should('have.value', 'sisseütlev / alaleütlev');
          sel.property.deleteBtn().click();
          sel.property.deleteCancelBtn().click();

          sel.property.deleteBtn().click();
          sel.property.deleteConfirmBtn().click();
        });

        sel.properties.listItems().should('have.length', 1);

        cy.visit('/properties', testModeVisitOptions[mode]);
        sel.properties.partOfSpeechTab('misc').click();
        sel.properties.listItems().should('have.length', 1);
      });
    });
  });
});
