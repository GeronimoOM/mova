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
    "fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n}\n\nfragment WordFieldsFull on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      ...TextPropertyValueFields\n    }\n    ... on OptionPropertyValue {\n      ...OptionPropertyValueFields\n    }\n  }\n  addedAt\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}": types.LanguageFieldsFragmentDoc,
    "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($id: ID!) {\n  deleteLanguage(id: $id) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation DeleteProperty($id: ID!) {\n  deleteProperty(id: $id) {\n    ... on TextProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n    ... on OptionProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on TextProperty {\n      id\n    }\n    ... on OptionProperty {\n      id\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n    languageId\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}": types.CreateLanguageDocument,
    "query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $topics: [ID!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      topics: $topics\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $cursor: String, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    id\n    topics(cursor: $cursor, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWordsStats($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    wordsStats {\n      total {\n        words\n      }\n      byDate {\n        from\n        until\n        dates {\n          date\n          words\n        }\n      }\n    }\n  }\n}": types.GetLanguagesDocument,
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
export function graphql(source: "fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n}\n\nfragment WordFieldsFull on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      ...TextPropertyValueFields\n    }\n    ... on OptionPropertyValue {\n      ...OptionPropertyValueFields\n    }\n  }\n  addedAt\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}"): (typeof documents)["fragment LanguageFields on Language {\n  id\n  name\n  addedAt\n}\n\nfragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  addedAt\n}\n\nfragment WordFieldsFull on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      ...TextPropertyValueFields\n    }\n    ... on OptionPropertyValue {\n      ...OptionPropertyValueFields\n    }\n  }\n  addedAt\n}\n\nfragment TextPropertyValueFields on TextPropertyValue {\n  property {\n    id\n  }\n  text\n}\n\nfragment OptionPropertyValueFields on OptionPropertyValue {\n  property {\n    id\n  }\n  option {\n    id\n    value\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($id: ID!) {\n  deleteLanguage(id: $id) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation DeleteProperty($id: ID!) {\n  deleteProperty(id: $id) {\n    ... on TextProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n    ... on OptionProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on TextProperty {\n      id\n    }\n    ... on OptionProperty {\n      id\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n    languageId\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}"): (typeof documents)["mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteLanguage($id: ID!) {\n  deleteLanguage(id: $id) {\n    id\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation DeleteProperty($id: ID!) {\n  deleteProperty(id: $id) {\n    ... on TextProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n    ... on OptionProperty {\n      id\n      languageId\n      partOfSpeech\n    }\n  }\n}\n\nmutation ReorderProperties($input: ReorderPropertiesInput!) {\n  reorderProperties(input: $input) {\n    ... on TextProperty {\n      id\n    }\n    ... on OptionProperty {\n      id\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFieldsFull\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n    languageId\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $topics: [ID!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      topics: $topics\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $cursor: String, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    id\n    topics(cursor: $cursor, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWordsStats($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    wordsStats {\n      total {\n        words\n      }\n      byDate {\n        from\n        until\n        dates {\n          date\n          words\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetLanguages {\n  languages {\n    ...LanguageFields\n  }\n}\n\nquery GetWords($languageId: ID!, $query: String, $partsOfSpeech: [PartOfSpeech!], $topics: [ID!], $cursor: String, $limit: Int, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    words(\n      cursor: $cursor\n      limit: $limit\n      partsOfSpeech: $partsOfSpeech\n      query: $query\n      topics: $topics\n      order: $order\n    ) {\n      items {\n        ...WordFields\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWord($id: ID!) {\n  word(id: $id) {\n    ...WordFieldsFull\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    id\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $cursor: String, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    id\n    topics(cursor: $cursor, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      nextCursor\n    }\n  }\n}\n\nquery GetWordsStats($languageId: ID!) {\n  language(id: $languageId) {\n    id\n    wordsStats {\n      total {\n        words\n      }\n      byDate {\n        from\n        until\n        dates {\n          date\n          words\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;