/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment LanguageWords on Language {\n  words {\n    items {\n      id\n    }\n    nextCursor\n  }\n}\n\nfragment LanguageProperties on Language {\n  properties(partOfSpeech: $partOfSpeech) {\n    ...PropertyFields\n  }\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n  languageId\n  mastery\n}\n\nfragment WordFieldsFull on Word {\n  ...WordFields\n  properties {\n    ...PropertyValueFields\n  }\n}\n\nfragment PropertyValueFields on PropertyValue {\n  ... on TextPropertyValue {\n    ...TextPropertyValueFields\n  }\n  ... on OptionPropertyValue {\n    ...OptionPropertyValueFields\n  }\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment PropertyFields on Property {\n  ... on TextProperty {\n    ...TextPropertyFields\n  }\n  ... on OptionProperty {\n    ...OptionPropertyFields\n  }\n}\n\nfragment IPropertyFields on IProperty {\n  id\n  name\n  type\n  partOfSpeech\n  languageId\n  addedAt\n  order\n}\n\nfragment TextPropertyFields on TextProperty {\n  ...IPropertyFields\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  ...IPropertyFields\n  options {\n    id\n    value\n  }\n}\n\nfragment ChangeFields on Change {\n  ... on IChange {\n    id\n    changedAt\n    type\n  }\n  ...CreateLanguageChangeFields\n  ...UpdateLanguageChangeFields\n  ...DeleteLanguageChangeFields\n  ...CreatePropertyChangeFields\n  ...UpdatePropertyChangeFields\n  ...ReorderPropertiesChangeFields\n  ...DeletePropertyChangeFields\n  ...CreateWordChangeFields\n  ...UpdateWordChangeFields\n  ...DeleteWordChangeFields\n}\n\nfragment CreateLanguageChangeFields on CreateLanguageChange {\n  createdLanguage: created {\n    ...LanguageFields\n  }\n}\n\nfragment UpdateLanguageChangeFields on UpdateLanguageChange {\n  updatedLanguage: updated {\n    id\n    name\n  }\n}\n\nfragment DeleteLanguageChangeFields on DeleteLanguageChange {\n  deletedLanguage: deleted\n}\n\nfragment CreatePropertyChangeFields on CreatePropertyChange {\n  createdProperty: created {\n    ...PropertyFields\n  }\n}\n\nfragment UpdatePropertyChangeFields on UpdatePropertyChange {\n  updatedProperty: updated {\n    ... on IPropertyUpdate {\n      id\n      name\n      type\n    }\n  }\n}\n\nfragment ReorderPropertiesChangeFields on ReorderPropertiesChange {\n  reorderedProperties: reordered {\n    propertyIds\n  }\n}\n\nfragment DeletePropertyChangeFields on DeletePropertyChange {\n  deletedProperty: deleted\n}\n\nfragment CreateWordChangeFields on CreateWordChange {\n  createdWord: created {\n    id\n    original\n    translation\n    partOfSpeech\n    mastery\n    addedAt\n    languageId\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment UpdateWordChangeFields on UpdateWordChange {\n  updatedWord: updated {\n    id\n    original\n    translation\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment DeleteWordChangeFields on DeleteWordChange {\n  deletedWord: deleted\n}\n\nfragment PropertyValueSaveFields on PropertyValueSave {\n  ... on IPropertyValueSave {\n    propertyId\n    type\n  }\n  ... on TextPropertyValueSave {\n    text\n  }\n  ... on OptionPropertyValueSave {\n    optionId\n  }\n}\n\nfragment GoalFields on Goal {\n  type\n  cadence\n  points\n}": types.LanguageFieldsFragmentDoc,
    "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    ...LanguageFields\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($input: DeleteLanguageInput!) {\n  deleteLanguage(input: $input) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on IProperty {\n      id\n      order\n    }\n  }\n}\n\nmutation DeleteProperty($input: DeletePropertyInput!) {\n  deleteProperty(input: $input) {\n    ... on IProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($input: DeleteWordInput!) {\n  deleteWord(input: $input) {\n    id\n    languageId\n  }\n}\n\nmutation IncreaseWordMastery($wordId: ID!) {\n  increaseMastery(wordId: $wordId) {\n    ...WordFields\n  }\n}\n\nmutation SetGoals($input: SetGoalsInput!) {\n  setGoals(input: $input) {\n    ...GoalFields\n  }\n}\n\nmutation ApplyChanges($changes: [ApplyChangeInput!]!) {\n  applyChanges(changes: $changes)\n}\n\nmutation Login($input: LoginInput!) {\n  token(input: $input)\n}": types.CreateLanguageDocument,
    "query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ...PropertyFields\n    }\n  }\n}\n\nquery GetExerciseWords($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    exerciseWords {\n      ...WordFieldsFull\n    }\n  }\n}\n\nquery GetGoals($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    goals {\n      ...GoalFields\n    }\n  }\n}\n\nquery GetChanges($syncType: SyncType!, $cursor: String, $changedAt: Timestamp) {\n  changes(syncType: $syncType, cursor: $cursor, changedAt: $changedAt) {\n    items {\n      ...ChangeFields\n    }\n    syncType\n    nextCursor\n  }\n}": types.GetLanguagesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment LanguageWords on Language {\n  words {\n    items {\n      id\n    }\n    nextCursor\n  }\n}\n\nfragment LanguageProperties on Language {\n  properties(partOfSpeech: $partOfSpeech) {\n    ...PropertyFields\n  }\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n  languageId\n  mastery\n}\n\nfragment WordFieldsFull on Word {\n  ...WordFields\n  properties {\n    ...PropertyValueFields\n  }\n}\n\nfragment PropertyValueFields on PropertyValue {\n  ... on TextPropertyValue {\n    ...TextPropertyValueFields\n  }\n  ... on OptionPropertyValue {\n    ...OptionPropertyValueFields\n  }\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment PropertyFields on Property {\n  ... on TextProperty {\n    ...TextPropertyFields\n  }\n  ... on OptionProperty {\n    ...OptionPropertyFields\n  }\n}\n\nfragment IPropertyFields on IProperty {\n  id\n  name\n  type\n  partOfSpeech\n  languageId\n  addedAt\n  order\n}\n\nfragment TextPropertyFields on TextProperty {\n  ...IPropertyFields\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  ...IPropertyFields\n  options {\n    id\n    value\n  }\n}\n\nfragment ChangeFields on Change {\n  ... on IChange {\n    id\n    changedAt\n    type\n  }\n  ...CreateLanguageChangeFields\n  ...UpdateLanguageChangeFields\n  ...DeleteLanguageChangeFields\n  ...CreatePropertyChangeFields\n  ...UpdatePropertyChangeFields\n  ...ReorderPropertiesChangeFields\n  ...DeletePropertyChangeFields\n  ...CreateWordChangeFields\n  ...UpdateWordChangeFields\n  ...DeleteWordChangeFields\n}\n\nfragment CreateLanguageChangeFields on CreateLanguageChange {\n  createdLanguage: created {\n    ...LanguageFields\n  }\n}\n\nfragment UpdateLanguageChangeFields on UpdateLanguageChange {\n  updatedLanguage: updated {\n    id\n    name\n  }\n}\n\nfragment DeleteLanguageChangeFields on DeleteLanguageChange {\n  deletedLanguage: deleted\n}\n\nfragment CreatePropertyChangeFields on CreatePropertyChange {\n  createdProperty: created {\n    ...PropertyFields\n  }\n}\n\nfragment UpdatePropertyChangeFields on UpdatePropertyChange {\n  updatedProperty: updated {\n    ... on IPropertyUpdate {\n      id\n      name\n      type\n    }\n  }\n}\n\nfragment ReorderPropertiesChangeFields on ReorderPropertiesChange {\n  reorderedProperties: reordered {\n    propertyIds\n  }\n}\n\nfragment DeletePropertyChangeFields on DeletePropertyChange {\n  deletedProperty: deleted\n}\n\nfragment CreateWordChangeFields on CreateWordChange {\n  createdWord: created {\n    id\n    original\n    translation\n    partOfSpeech\n    mastery\n    addedAt\n    languageId\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment UpdateWordChangeFields on UpdateWordChange {\n  updatedWord: updated {\n    id\n    original\n    translation\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment DeleteWordChangeFields on DeleteWordChange {\n  deletedWord: deleted\n}\n\nfragment PropertyValueSaveFields on PropertyValueSave {\n  ... on IPropertyValueSave {\n    propertyId\n    type\n  }\n  ... on TextPropertyValueSave {\n    text\n  }\n  ... on OptionPropertyValueSave {\n    optionId\n  }\n}\n\nfragment GoalFields on Goal {\n  type\n  cadence\n  points\n}"): (typeof documents)["fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment LanguageWords on Language {\n  words {\n    items {\n      id\n    }\n    nextCursor\n  }\n}\n\nfragment LanguageProperties on Language {\n  properties(partOfSpeech: $partOfSpeech) {\n    ...PropertyFields\n  }\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n  languageId\n  mastery\n}\n\nfragment WordFieldsFull on Word {\n  ...WordFields\n  properties {\n    ...PropertyValueFields\n  }\n}\n\nfragment PropertyValueFields on PropertyValue {\n  ... on TextPropertyValue {\n    ...TextPropertyValueFields\n  }\n  ... on OptionPropertyValue {\n    ...OptionPropertyValueFields\n  }\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment PropertyFields on Property {\n  ... on TextProperty {\n    ...TextPropertyFields\n  }\n  ... on OptionProperty {\n    ...OptionPropertyFields\n  }\n}\n\nfragment IPropertyFields on IProperty {\n  id\n  name\n  type\n  partOfSpeech\n  languageId\n  addedAt\n  order\n}\n\nfragment TextPropertyFields on TextProperty {\n  ...IPropertyFields\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  ...IPropertyFields\n  options {\n    id\n    value\n  }\n}\n\nfragment ChangeFields on Change {\n  ... on IChange {\n    id\n    changedAt\n    type\n  }\n  ...CreateLanguageChangeFields\n  ...UpdateLanguageChangeFields\n  ...DeleteLanguageChangeFields\n  ...CreatePropertyChangeFields\n  ...UpdatePropertyChangeFields\n  ...ReorderPropertiesChangeFields\n  ...DeletePropertyChangeFields\n  ...CreateWordChangeFields\n  ...UpdateWordChangeFields\n  ...DeleteWordChangeFields\n}\n\nfragment CreateLanguageChangeFields on CreateLanguageChange {\n  createdLanguage: created {\n    ...LanguageFields\n  }\n}\n\nfragment UpdateLanguageChangeFields on UpdateLanguageChange {\n  updatedLanguage: updated {\n    id\n    name\n  }\n}\n\nfragment DeleteLanguageChangeFields on DeleteLanguageChange {\n  deletedLanguage: deleted\n}\n\nfragment CreatePropertyChangeFields on CreatePropertyChange {\n  createdProperty: created {\n    ...PropertyFields\n  }\n}\n\nfragment UpdatePropertyChangeFields on UpdatePropertyChange {\n  updatedProperty: updated {\n    ... on IPropertyUpdate {\n      id\n      name\n      type\n    }\n  }\n}\n\nfragment ReorderPropertiesChangeFields on ReorderPropertiesChange {\n  reorderedProperties: reordered {\n    propertyIds\n  }\n}\n\nfragment DeletePropertyChangeFields on DeletePropertyChange {\n  deletedProperty: deleted\n}\n\nfragment CreateWordChangeFields on CreateWordChange {\n  createdWord: created {\n    id\n    original\n    translation\n    partOfSpeech\n    mastery\n    addedAt\n    languageId\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment UpdateWordChangeFields on UpdateWordChange {\n  updatedWord: updated {\n    id\n    original\n    translation\n    properties {\n      ...PropertyValueSaveFields\n    }\n  }\n}\n\nfragment DeleteWordChangeFields on DeleteWordChange {\n  deletedWord: deleted\n}\n\nfragment PropertyValueSaveFields on PropertyValueSave {\n  ... on IPropertyValueSave {\n    propertyId\n    type\n  }\n  ... on TextPropertyValueSave {\n    text\n  }\n  ... on OptionPropertyValueSave {\n    optionId\n  }\n}\n\nfragment GoalFields on Goal {\n  type\n  cadence\n  points\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    ...LanguageFields\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($input: DeleteLanguageInput!) {\n  deleteLanguage(input: $input) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on IProperty {\n      id\n      order\n    }\n  }\n}\n\nmutation DeleteProperty($input: DeletePropertyInput!) {\n  deleteProperty(input: $input) {\n    ... on IProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($input: DeleteWordInput!) {\n  deleteWord(input: $input) {\n    id\n    languageId\n  }\n}\n\nmutation IncreaseWordMastery($wordId: ID!) {\n  increaseMastery(wordId: $wordId) {\n    ...WordFields\n  }\n}\n\nmutation SetGoals($input: SetGoalsInput!) {\n  setGoals(input: $input) {\n    ...GoalFields\n  }\n}\n\nmutation ApplyChanges($changes: [ApplyChangeInput!]!) {\n  applyChanges(changes: $changes)\n}\n\nmutation Login($input: LoginInput!) {\n  token(input: $input)\n}"): (typeof documents)["mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    ...LanguageFields\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($input: DeleteLanguageInput!) {\n  deleteLanguage(input: $input) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ...PropertyFields\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on IProperty {\n      id\n      order\n    }\n  }\n}\n\nmutation DeleteProperty($input: DeletePropertyInput!) {\n  deleteProperty(input: $input) {\n    ... on IProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($input: DeleteWordInput!) {\n  deleteWord(input: $input) {\n    id\n    languageId\n  }\n}\n\nmutation IncreaseWordMastery($wordId: ID!) {\n  increaseMastery(wordId: $wordId) {\n    ...WordFields\n  }\n}\n\nmutation SetGoals($input: SetGoalsInput!) {\n  setGoals(input: $input) {\n    ...GoalFields\n  }\n}\n\nmutation ApplyChanges($changes: [ApplyChangeInput!]!) {\n  applyChanges(changes: $changes)\n}\n\nmutation Login($input: LoginInput!) {\n  token(input: $input)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ...PropertyFields\n    }\n  }\n}\n\nquery GetExerciseWords($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    exerciseWords {\n      ...WordFieldsFull\n    }\n  }\n}\n\nquery GetGoals($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    goals {\n      ...GoalFields\n    }\n  }\n}\n\nquery GetChanges($syncType: SyncType!, $cursor: String, $changedAt: Timestamp) {\n  changes(syncType: $syncType, cursor: $cursor, changedAt: $changedAt) {\n    items {\n      ...ChangeFields\n    }\n    syncType\n    nextCursor\n  }\n}"): (typeof documents)["query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ...PropertyFields\n    }\n  }\n}\n\nquery GetExerciseWords($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    exerciseWords {\n      ...WordFieldsFull\n    }\n  }\n}\n\nquery GetGoals($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    goals {\n      ...GoalFields\n    }\n  }\n}\n\nquery GetChanges($syncType: SyncType!, $cursor: String, $changedAt: Timestamp) {\n  changes(syncType: $syncType, cursor: $cursor, changedAt: $changedAt) {\n    items {\n      ...ChangeFields\n    }\n    syncType\n    nextCursor\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;