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
    "fragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      text\n    }\n    ... on OptionPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      option {\n        id\n        value\n      }\n    }\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}": types.WordFieldsFragmentDoc,
    "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}": types.CreateLanguageDocument,
    "query GetLanguages {\n  languages {\n    id\n    name\n  }\n}\n\nquery GetWords($languageId: ID!, $start: Int, $limit: Int, $query: String, $topic: ID, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    name\n    words(start: $start, limit: $limit, query: $query, topic: $topic, order: $order) {\n      items {\n        ...WordFields\n      }\n      hasMore\n    }\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $start: Int, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    topics(start: $start, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      hasMore\n    }\n  }\n}": types.GetLanguagesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "fragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      text\n    }\n    ... on OptionPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      option {\n        id\n        value\n      }\n    }\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}"): (typeof documents)["fragment WordFields on Word {\n  id\n  original\n  translation\n  partOfSpeech\n  properties {\n    ... on TextPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      text\n    }\n    ... on OptionPropertyValue {\n      property {\n        id\n        name\n        type\n      }\n      option {\n        id\n        value\n      }\n    }\n  }\n}\n\nfragment TextPropertyFields on TextProperty {\n  id\n  name\n  type\n  partOfSpeech\n}\n\nfragment OptionPropertyFields on OptionProperty {\n  id\n  name\n  type\n  partOfSpeech\n  options {\n    id\n    value\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}"): (typeof documents)["mutation CreateLanguage($input: CreateLanguageInput!) {\n  createLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation UpdateLanguage($input: UpdateLanguageInput!) {\n  updateLanguage(input: $input) {\n    id\n    name\n  }\n}\n\nmutation CreateProperty($input: CreatePropertyInput!) {\n  createProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation UpdateProperty($input: UpdatePropertyInput!) {\n  updateProperty(input: $input) {\n    ... on TextProperty {\n      ...TextPropertyFields\n    }\n    ... on OptionProperty {\n      ...OptionPropertyFields\n    }\n  }\n}\n\nmutation CreateWord($input: CreateWordInput!) {\n  createWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation UpdateWord($input: UpdateWordInput!) {\n  updateWord(input: $input) {\n    ...WordFields\n  }\n}\n\nmutation DeleteWord($id: ID!) {\n  deleteWord(id: $id) {\n    id\n  }\n}\n\nmutation CreateTopic($input: CreateTopicInput!) {\n  createTopic(input: $input) {\n    id\n    name\n  }\n}\n\nmutation DeleteTopic($id: ID!) {\n  deleteTopic(id: $id) {\n    id\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetLanguages {\n  languages {\n    id\n    name\n  }\n}\n\nquery GetWords($languageId: ID!, $start: Int, $limit: Int, $query: String, $topic: ID, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    name\n    words(start: $start, limit: $limit, query: $query, topic: $topic, order: $order) {\n      items {\n        ...WordFields\n      }\n      hasMore\n    }\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $start: Int, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    topics(start: $start, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      hasMore\n    }\n  }\n}"): (typeof documents)["query GetLanguages {\n  languages {\n    id\n    name\n  }\n}\n\nquery GetWords($languageId: ID!, $start: Int, $limit: Int, $query: String, $topic: ID, $order: WordOrder) {\n  language(id: $languageId) {\n    id\n    name\n    words(start: $start, limit: $limit, query: $query, topic: $topic, order: $order) {\n      items {\n        ...WordFields\n      }\n      hasMore\n    }\n  }\n}\n\nquery GetProperties($languageId: ID!, $partOfSpeech: PartOfSpeech) {\n  language(id: $languageId) {\n    properties(partOfSpeech: $partOfSpeech) {\n      ... on TextProperty {\n        ...TextPropertyFields\n      }\n      ... on OptionProperty {\n        ...OptionPropertyFields\n      }\n    }\n  }\n}\n\nquery GetTopics($languageId: ID!, $start: Int, $limit: Int, $query: String) {\n  language(id: $languageId) {\n    topics(start: $start, limit: $limit, query: $query) {\n      items {\n        id\n        name\n      }\n      hasMore\n    }\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;