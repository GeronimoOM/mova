const byTestId = (dataTestId: string) => `[data-testid="${dataTestId}"]`;

export const words = {
  searchInput: () => cy.get(byTestId('words-search')),
  searchClearBtn: () => cy.get(byTestId('words-search-clear-btn')),

  list: () => cy.get(byTestId('words-list')),
  listItems: () => cy.get(byTestId('words-list-item')),
  listItem: (index: number) => words.listItems().eq(index),
  listItemOriginal: (index: number) =>
    words.listItem(index).find(byTestId('words-list-item-original')),
  listItemTranslation: (index: number) =>
    words.listItem(index).find(byTestId('words-list-item-translation')),
  createBtn: () => cy.get(byTestId('words-create-btn')),
};

export const word = {
  closeBtn: () => cy.get(byTestId('word-details-close-btn')),
  saveBtn: () => cy.get(byTestId('word-details-save-btn')),
  deleteBtn: () => cy.get(byTestId('word-details-delete-btn')),
  deleteConfirmBtn: () => cy.get(byTestId('word-details-delete-confirm-btn')),
  deleteCancelBtn: () => cy.get(byTestId('word-details-delete-cancel-btn')),
  moreBtn: () => cy.get(byTestId('word-details-more-btn')),
  upBtn: () => cy.get(byTestId('word-details-up-btn')),
  downBtn: () => cy.get(byTestId('word-details-down-btn')),

  original: () => cy.get(byTestId('word-details-original')),
  translation: () => cy.get(byTestId('word-details-translation')),

  property: (propertyName: string) =>
    cy
      .get(byTestId('word-details-property'))
      .contains(propertyName)
      .closest(byTestId('word-details-property')),

  propertyText: (propertyName: string) =>
    word.property(propertyName).find(byTestId('word-details-property-text')),

  propertyOption: (propertyName: string) =>
    word.property(propertyName).find(byTestId('word-details-property-option')),
  propertyOptionsOption: (optionValue: string) =>
    cy
      .get(byTestId('word-details-options-option'))
      .find(`input[value="${optionValue}"]`)
      .closest(byTestId('word-details-options-option')),
  propertyOptionsClear: () =>
    cy.get(byTestId('word-details-options-clear-btn')),
  propertyOptionsCustom: () => cy.get(byTestId('word-details-options-custom')),
  propertyOptionsCustomSaveBtn: () =>
    cy.get(byTestId('word-details-options-custom-save-btn')),

  links: (type: string) =>
    cy.get(byTestId(`word-details-link-${type.toLowerCase()}`)),
  linksAddBtn: (type: string) =>
    word.links(type).find(byTestId('word-links-btn')),
  linkSearchInput: () => cy.get(byTestId('word-links-search')),
  link: (original: string) =>
    cy
      .get(byTestId('word-link'))
      .contains(original)
      .closest(byTestId('word-link')),
  linkBtn: (original: string) =>
    word.link(original).find(byTestId('word-link-btn')),
};

export const properties = {
  partOfSpeechTab: (partOfSpeech: string) =>
    cy.get(byTestId(`properties-pos-tab-${partOfSpeech.toLowerCase()}`)),

  listItems: () => cy.get(byTestId('properties-list-item')),
  listItem: (index: number) => properties.listItems().eq(index),
  listItemNew: () => properties.listItem(-1),
  listItemName: (index: number) =>
    properties.listItem(index).find(byTestId('property-name')),

  createBtn: () => cy.get(byTestId('properties-create-btn')),
};

export const property = {
  name: () => cy.get(byTestId('property-name')),
  typePill: (type: string) => cy.get(byTestId(`property-type-pill-${type}`)),
  saveBtn: () => cy.get(byTestId('properties-list-item-save-btn')),
  saveDeleteOptionConfirmBtn: () =>
    cy.get(byTestId('properties-list-item-delete-option-confirm-btn')),
  saveDeleteOptionCancelBtn: () =>
    cy.get(byTestId('properties-list-item-delete-option-cancel-btn')),
  deleteBtn: () => cy.get(byTestId('properties-list-item-delete-btn')),
  deleteConfirmBtn: () =>
    cy.get(byTestId('properties-list-item-delete-confirm-btn')),
  deleteCancelBtn: () =>
    cy.get(byTestId('properties-list-item-delete-cancel-btn')),
  reorderBtn: () => cy.get(byTestId('properties-list-item-reorder-btn')),

  optionAddBtn: () => cy.get(byTestId('properties-list-item-option-add-btn')),
  options: () => cy.get(byTestId('properties-list-item-option')),
  option: (optionValue: string) =>
    property
      .options()
      .find(`input[value="${optionValue}"]`)
      .closest(byTestId('properties-list-item-option')),
};

export const languages = {
  listItems: () => cy.get(byTestId('languages-list-item')),
  listItem: (index: number) => languages.listItems().eq(index),
  listItemNew: () => languages.listItem(-1),

  createBtn: () => cy.get(byTestId('languages-create-btn')),
};

export const language = {
  selectBtn: () => cy.get(byTestId('languages-list-item-select-btn')),
  saveBtn: () => cy.get(byTestId('languages-list-item-save-btn')),
  deleteBtn: () => cy.get(byTestId('languages-list-item-delete-btn')),
  deleteConfirmBtn: () =>
    cy.get(byTestId('languages-list-item-delete-confirm-btn')),
  deleteCancelBtn: () =>
    cy.get(byTestId('languages-list-item-delete-cancel-btn')),
};

export const exercises = {
  startBtn: () => cy.get(byTestId('exercises-start-btn')),
  readyNumber: () => cy.get(byTestId('exercises-ready-number')),
};

export const exercise = {
  submitBtn: () => cy.get(byTestId('exercise-submit-btn')),
  skipBtn: () => cy.get(byTestId('exercise-skip-btn')),
  title: () => cy.get(byTestId('exercise-title')),
  word: () => cy.get(byTestId('exercise-word')),

  recall: {
    translation: () => cy.get(byTestId('recall-exercise-translation')),
    revealBtn: () => cy.get(byTestId('recall-exercise-reveal-btn')),
  },

  pick: {
    options: () => cy.get(byTestId('pick-exercise-option')),
    option: (optionValue: string) =>
      exercise.pick
        .options()
        .contains(optionValue)
        .closest(byTestId('pick-exercise-option')),
  },

  spell: {
    input: () => cy.get(byTestId('spell-exercise-input')),
    inputChar: (index: number) =>
      exercise.spell.input().find('input').eq(index),
  },
};

export const login = {
  user: () => cy.get(byTestId('login-user')),
  password: () => cy.get(byTestId('login-password')),
  submitBtn: () => cy.get(byTestId('login-submit-btn')),
};

export const user = {
  logoutBtn: () => cy.get(byTestId('user-logout-btn')),
};

export const common = {
  navBarLink: (to: string) => cy.get(byTestId(`navbar-link-${to}`)),

  partOfSpeechSelect: () => cy.get(byTestId('part-of-speech-select')),
  partOfSpeechOption: (partOfSpeech: string) =>
    cy.get(byTestId(`part-of-speech-option-${partOfSpeech}`)),

  optionColorPicker: () => cy.get(byTestId('option-color-picker')),
  optionColorPickerOption: (color?: string) =>
    cy.get(byTestId(`option-color-picker-option-${color ?? 'empty'}`)),
  optionDeleteBtn: () => cy.get(byTestId('option-delete-btn')),
  optionRestoreBtn: () => cy.get(byTestId('option-restore-btn')),

  progressTypeBar: (type: string) =>
    cy.get(byTestId(`progress-type-bar-${type}`)),
};
