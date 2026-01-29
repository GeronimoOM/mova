import { TEST_PASSWORD, TEST_USER } from '../support/constants';
import * as sel from '../support/selectors';

describe('exercises', () => {
  beforeEach(() => {
    cy.seedDb();
    cy.login(TEST_USER, TEST_PASSWORD);
  });

  it('shows exercises count', () => {
    cy.visit('/exercises');
    sel.exercises.readyNumber().contains('9');
  });

  it('goes through all exercises', () => {
    cy.visit('/exercises');
    sel.exercises.startBtn().click();
    Cypress._.times(9, () => {
      sel.exercise.skipBtn().click(); // mark as failure
      sel.exercise.skipBtn().click(); // go to next
    });
    cy.contains('no exercises yet');
  });

  it('shows correct words and exercises', () => {
    cy.visit('/exercises');
    sel.exercises.startBtn().click();

    const checkTitleAndWord = (title: string, word: string) => {
      sel.exercise.title().contains(title);
      sel.exercise.word().should('have.value', word);
      sel.exercise.skipBtn().click().click();
    };

    checkTitleAndWord('recall the translation', 'olenema');
    checkTitleAndWord('recall the translation', 'ihu');
    checkTitleAndWord('recall the translation', 'rivi');
    checkTitleAndWord('pick the correct word', 'помічати');
    checkTitleAndWord('spell the word', 'призначати');
    checkTitleAndWord('spell the word', 'раб');
    checkTitleAndWord('spell the word', 'тупий');
    checkTitleAndWord('spell the word', 'даремно');
    checkTitleAndWord('spell the word', 'дорога, стежка');
  });

  describe('recall exercise', () => {
    beforeEach(() => {
      cy.visit('/exercises');
      sel.exercises.startBtn().click();
    });

    it('reveals answer on click', () => {
      sel.exercise.title().contains('recall the translation');
      sel.exercise.word().should('have.value', 'olenema');
      sel.exercise.recall.translation().should('have.value', '');

      sel.exercise.recall.revealBtn().click();
      sel.exercise.recall.translation().should('have.value', 'залежати');
    });

    it('accepts successful recall', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.submitBtn().click();
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '1');
    });

    it('rejects failed recall', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.skipBtn().click();
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');
    });
  });

  describe('pick exercise', () => {
    beforeEach(() => {
      cy.visit('/exercises');
      sel.exercises.startBtn().click();
      Cypress._.times(3, () => sel.exercise.skipBtn().click().click());
    });

    it('lists options', () => {
      sel.exercise.title().contains('pick the correct word');
      sel.exercise.word().should('have.value', 'помічати');

      sel.exercise.pick.option('määrama').should('exist');
      sel.exercise.pick.option('märkama').should('exist');
      sel.exercise.pick.option('märkima').should('exist');
    });

    it('accepts correct pick', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.pick.option('märkama').click();
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '1');
    });

    it('rejects incorrect pick', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.pick.option('märkima').click();
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');
    });
  });

  describe('spell exercise', () => {
    beforeEach(() => {
      cy.visit('/exercises');
      sel.exercises.startBtn().click();
      Cypress._.times(4, () => sel.exercise.skipBtn().click().click());
    });

    it('displays hint in basic mode', () => {
      sel.exercise.title().contains('spell the word');
      sel.exercise.word().should('have.value', 'призначати');
      sel.exercise.spell.inputChar(0).should('have.value', 'm');
    });

    it('accepts correct input', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.spell.input().type('äärama'); // 'm' already included as hint
      sel.exercise.submitBtn().click();

      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '1');
    });

    it('rejects incorrect input', () => {
      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');

      sel.exercise.spell.input().type('ärkima');
      sel.exercise.submitBtn().click();

      sel.common
        .progressTypeBar('mastery')
        .should('have.attr', 'data-progress-current', '0');
    });
  });
});
