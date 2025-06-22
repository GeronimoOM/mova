import { TEST_PASSWORD, TEST_USER } from '../support/constants';
import {
  TestModes,
  testModeTitle,
  testModeVisitOptions,
} from '../support/modes';
import * as sel from '../support/selectors';

describe('words', () => {
  beforeEach(() => {
    cy.seedDb();
    cy.login(TEST_USER, TEST_PASSWORD);
  });

  TestModes.forEach((mode) => {
    describe(testModeTitle[mode], () => {
      describe('words list', () => {
        it('shows list of words', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.listItems().should('have.length.at.least', 15);
          sel.words.list().scrollTo('bottom');
          sel.words.listItems().should('have.length', 17);
          sel.words.listItemOriginal(0).contains('pidi');
          sel.words.listItemTranslation(0).contains('по, уздовж');
        });

        it('searches list of words', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.searchInput().type('mark');
          cy.wait(1000);
          sel.words.listItems().should('have.length', 2);
          sel.words.listItems().contains('märkama');
          sel.words.listItems().contains('märkima');

          sel.words.searchClearBtn().click();
          sel.words.searchInput().should('have.value', '');
          sel.words.listItems().should('have.length.at.least', 15);

          sel.words.searchInput().type('залежати');
          cy.wait(1000);
          sel.words.listItems().should('have.length', 1);
          sel.words.listItems().contains('olenema');

          sel.words.searchClearBtn().click();
          sel.words.searchInput().should('have.value', '');
          sel.words.listItems().should('have.length.at.least', 15);

          sel.words.searchInput().type('kaevelda');
          sel.words.listItems().should('have.length', 1);
          sel.words.listItems().contains('kaeblema');
        });
      });

      describe('word details', () => {
        it('shows word details', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.listItems().contains('kaeblema').click();
          sel.word.original().should('have.value', 'kaeblema');
          sel.word.translation().should('have.value', 'жалітися');
          sel.common.partOfSpeechSelect().contains('verb');
          sel.word
            .propertyText('da-tegevusnimi')
            .should('have.value', 'kaevelda');
          sel.word
            .propertyText('oleviku ainsuse 3. isik')
            .should('have.value', 'kaebleb');
          sel.word
            .propertyText('lihtmineviku ainsuse 3. isik')
            .should('have.value', 'kaebles');
          sel.word.propertyText('tud-kesksõna').should('have.value', '');
          sel.word
            .propertyOption('rektsioon')
            .find('input')
            .should('have.value', 'mille üle');

          sel.word.closeBtn().click();
          sel.words.listItems().should('be.visible');

          sel.words.listItems().contains('kaeblema').click();
          sel.word.moreBtn().click();
          sel.word.upBtn().click();
          sel.word.original().should('have.value', 'saatus');
          sel.word.downBtn().click().click();
          sel.word.original().should('have.value', 'lõtv');
        });

        it('creates word', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.createBtn().click();
          sel.common.partOfSpeechSelect().click();
          sel.common.partOfSpeechOption('noun').click();
          sel.word.original().type('kont');
          sel.word.translation().type('кістка');
          sel.word.propertyText('ainsuse omastav').type('kondi');
          sel.word.propertyText('ainsuse osastav').type('konti');
          sel.word.saveBtn().click();

          sel.words.listItemOriginal(0).contains('kont');
          sel.words.listItemTranslation(0).contains('кістка');

          sel.words.createBtn().click();
          sel.common.partOfSpeechSelect().click();
          sel.common.partOfSpeechOption('verb').click();
          sel.word.original().type('heitlema');
          sel.word.translation().type('боротися');
          sel.word.propertyText('da-tegevusnimi').type('heidelda');
          sel.word.propertyText('oleviku ainsuse 3. isik').type('heitleb');
          sel.word.propertyOption('rektsioon').click();
          sel.word.propertyOptionsOption('kellega/millega').click();
          sel.word.saveBtn().click();

          sel.words.listItemOriginal(0).contains('heitlema');
          sel.words.listItemTranslation(0).contains('боротися');

          const assertCreated = () => {
            sel.words.listItems().contains('kont').click();
            sel.word.original().should('have.value', 'kont');
            sel.word.translation().should('have.value', 'кістка');
            sel.common.partOfSpeechSelect().contains('noun');
            sel.word
              .propertyText('ainsuse omastav')
              .should('have.value', 'kondi');
            sel.word
              .propertyText('ainsuse osastav')
              .should('have.value', 'konti');
            sel.word.propertyText('mitmuse omastav').should('have.value', '');
            sel.word.closeBtn().click();

            sel.words.listItems().contains('heitlema').click();
            sel.word.original().should('have.value', 'heitlema');
            sel.word.translation().should('have.value', 'боротися');
            sel.common.partOfSpeechSelect().contains('verb');
            sel.word
              .propertyText('da-tegevusnimi')
              .should('have.value', 'heidelda');
            sel.word
              .propertyText('oleviku ainsuse 3. isik')
              .should('have.value', 'heitleb');
            sel.word
              .propertyOption('rektsioon')
              .find('input')
              .should('have.value', 'kellega/millega');
          };

          assertCreated();

          cy.visit('/', testModeVisitOptions[mode]);
          assertCreated();
        });

        it('updates word', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.listItems().contains('kaeblema').click();
          sel.word.translation().clear().type('жалітися  ');
          sel.word.saveBtn().should('not.be.enabled');

          sel.word.translation().clear().type('жалітися, скаржитися');
          sel.word.propertyText('tud-kesksõna').type('kaeveldud');
          sel.word.propertyOption('rektsioon').click();
          sel.word.propertyOptionsOption('et').click();
          sel.word.saveBtn().click();

          const assertUpdated1 = () => {
            sel.word.translation().should('have.value', 'жалітися, скаржитися');
            sel.word
              .propertyText('tud-kesksõna')
              .should('have.value', 'kaeveldud');
            sel.word
              .propertyOption('rektsioon')
              .find('input')
              .should('have.value', 'et');
          };

          assertUpdated1();

          cy.visit('/', testModeVisitOptions[mode]);
          sel.words.listItems().contains('kaeblema').click();
          assertUpdated1();

          sel.word.propertyOption('rektsioon').click();
          sel.word.propertyOptionsCustom().find('input').type('mille eest');
          sel.common.optionColorPicker().click();
          sel.common.optionColorPickerOption('purple').click();
          sel.word.propertyOptionsCustomSaveBtn().click();
          sel.word.saveBtn().click();

          const assertUpdated2 = () => {
            sel.word
              .propertyOption('rektsioon')
              .find('input')
              .should('have.value', 'mille eest');
            sel.word
              .propertyOption('rektsioon')
              .should('have.attr', 'data-option-color', 'purple');
          };

          assertUpdated2();

          cy.visit('/', testModeVisitOptions[mode]);
          sel.words.listItems().contains('kaeblema').click();
          assertUpdated2();
        });

        it('updates links', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.list().scrollTo('bottom');
          sel.words.listItems().contains('märkama').click();
          sel.word.linksAddBtn('distinct').click();
          sel.word.link('märkima').click();
          sel.word.links('distinct').contains('märkima');
          sel.word.linkSearchInput().type('olene');
          sel.word.link('olenema').click();
          sel.word.links('distinct').contains('olenema');
          sel.word.saveBtn().click();

          sel.word.links('distinct').contains('märkima');
          sel.word.links('distinct').contains('olenema');

          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.list().scrollTo('bottom');
          sel.words.listItems().contains('märkama').click();
          sel.word.links('distinct').contains('märkima');
          sel.word.links('distinct').contains('olenema');

          sel.word.linkBtn('olenema').click();
          sel.word.saveBtn().click();
          sel.word.links('distinct').should('not.contain.text', 'olenema');

          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.list().scrollTo('bottom');
          sel.words.listItems().contains('märkama').click();
          sel.word.links('distinct').contains('märkima');
          sel.word.links('distinct').should('not.contain.text', 'olenema');
        });

        it('deletes word', () => {
          cy.visit('/', testModeVisitOptions[mode]);

          sel.words.listItems().contains('saatus').click();
          sel.word.moreBtn().click();
          sel.word.deleteBtn().click();
          sel.word.deleteCancelBtn().click();

          sel.word.deleteBtn().click();
          sel.word.deleteConfirmBtn().click();

          const assertDeleted = () => {
            sel.words.listItems().should('not.contain.text', 'saatus');
          };

          assertDeleted();

          cy.visit('/', testModeVisitOptions[mode]);
          assertDeleted();
        });
      });
    });
  });
});
