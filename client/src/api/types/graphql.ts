/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateLanguageInput = {
  name: Scalars['String'];
};

export type CreatePropertyInput = {
  languageId: Scalars['ID'];
  name: Scalars['String'];
  options?: InputMaybe<Array<Scalars['String']>>;
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type CreateTopicInput = {
  languageId: Scalars['ID'];
  name: Scalars['String'];
};

export type CreateWordInput = {
  languageId: Scalars['ID'];
  original: Scalars['String'];
  partOfSpeech: PartOfSpeech;
  properties?: InputMaybe<Array<UpdatePropertyValueInput>>;
  translation: Scalars['String'];
};

export type Language = {
  __typename?: 'Language';
  id: Scalars['ID'];
  name: Scalars['String'];
  properties: Array<PropertyUnion>;
  topics: TopicPage;
  words: WordPage;
};

export type LanguagePropertiesArgs = {
  partOfSpeech?: InputMaybe<PartOfSpeech>;
};

export type LanguageTopicsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  start?: Scalars['Int'];
};

export type LanguageWordsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']>;
  start?: Scalars['Int'];
  topics?: InputMaybe<Array<Scalars['ID']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addTopicWord: Topic;
  createLanguage: Language;
  createProperty: PropertyUnion;
  createTopic: Topic;
  createWord: Word;
  deleteLanguage: Language;
  deleteProperty: PropertyUnion;
  deleteTopic: Topic;
  deleteWord: Word;
  removeTopicWord: Topic;
  reorderProperties: Array<PropertyUnion>;
  updateLanguage: Language;
  updateProperty: PropertyUnion;
  updateWord: Word;
};

export type MutationAddTopicWordArgs = {
  topicId: Scalars['ID'];
  wordId: Scalars['ID'];
};

export type MutationCreateLanguageArgs = {
  input: CreateLanguageInput;
};

export type MutationCreatePropertyArgs = {
  input: CreatePropertyInput;
};

export type MutationCreateTopicArgs = {
  input: CreateTopicInput;
};

export type MutationCreateWordArgs = {
  input: CreateWordInput;
};

export type MutationDeleteLanguageArgs = {
  id: Scalars['ID'];
};

export type MutationDeletePropertyArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteTopicArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteWordArgs = {
  id: Scalars['ID'];
};

export type MutationRemoveTopicWordArgs = {
  topicId: Scalars['ID'];
  wordId: Scalars['ID'];
};

export type MutationReorderPropertiesArgs = {
  input: ReorderPropertiesInput;
};

export type MutationUpdateLanguageArgs = {
  input: UpdateLanguageInput;
};

export type MutationUpdatePropertyArgs = {
  input: UpdatePropertyInput;
};

export type MutationUpdateWordArgs = {
  input: UpdateWordInput;
};

export type Option = {
  __typename?: 'Option';
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type OptionProperty = {
  __typename?: 'OptionProperty';
  id: Scalars['ID'];
  languageId: Scalars['ID'];
  name: Scalars['String'];
  options: Array<Option>;
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type OptionPropertyValue = {
  __typename?: 'OptionPropertyValue';
  option: Option;
  property: OptionProperty;
};

export enum PartOfSpeech {
  Adj = 'Adj',
  Adv = 'Adv',
  Misc = 'Misc',
  Noun = 'Noun',
  Pron = 'Pron',
  Verb = 'Verb',
}

export enum PropertyType {
  Option = 'Option',
  Text = 'Text',
}

export type PropertyUnion = OptionProperty | TextProperty;

export type PropertyValueUnion = OptionPropertyValue | TextPropertyValue;

export type Query = {
  __typename?: 'Query';
  language?: Maybe<Language>;
  languages: Array<Language>;
  property?: Maybe<PropertyUnion>;
  word?: Maybe<Word>;
};

export type QueryLanguageArgs = {
  id: Scalars['ID'];
};

export type QueryPropertyArgs = {
  id: Scalars['ID'];
};

export type QueryWordArgs = {
  id: Scalars['ID'];
};

export type ReorderPropertiesInput = {
  languageId: Scalars['ID'];
  partOfSpeech: PartOfSpeech;
  propertyIds: Array<Scalars['ID']>;
};

export type TextProperty = {
  __typename?: 'TextProperty';
  id: Scalars['ID'];
  languageId: Scalars['ID'];
  name: Scalars['String'];
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type TextPropertyValue = {
  __typename?: 'TextPropertyValue';
  property: TextProperty;
  text: Scalars['String'];
};

export type Topic = {
  __typename?: 'Topic';
  id: Scalars['ID'];
  name: Scalars['String'];
  words: WordPage;
};

export type TopicWordsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<WordOrder>;
  partOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']>;
  start?: Scalars['Int'];
};

export type TopicPage = {
  __typename?: 'TopicPage';
  hasMore: Scalars['Boolean'];
  items: Array<Topic>;
};

export type UpdateLanguageInput = {
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type UpdateOptionInput = {
  id: Scalars['ID'];
  value: Scalars['String'];
};

export type UpdatePropertyInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  options?: InputMaybe<Array<UpdateOptionInput>>;
};

export type UpdatePropertyValueInput = {
  id: Scalars['ID'];
  option?: InputMaybe<Scalars['ID']>;
  text?: InputMaybe<Scalars['String']>;
};

export type UpdateWordInput = {
  id: Scalars['ID'];
  original?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<Array<UpdatePropertyValueInput>>;
  translation?: InputMaybe<Scalars['String']>;
};

export type Word = {
  __typename?: 'Word';
  id: Scalars['String'];
  languageId: Scalars['ID'];
  original: Scalars['String'];
  partOfSpeech: PartOfSpeech;
  properties: Array<PropertyValueUnion>;
  translation: Scalars['String'];
};

export enum WordOrder {
  Alphabetical = 'Alphabetical',
  Chronological = 'Chronological',
}

export type WordPage = {
  __typename?: 'WordPage';
  hasMore: Scalars['Boolean'];
  items: Array<Word>;
};

export type LanguageFieldsFragment = {
  __typename?: 'Language';
  id: string;
  name: string;
};

export type LanguageWordsFragment = {
  __typename?: 'Language';
  words: {
    __typename?: 'WordPage';
    hasMore: boolean;
    items: Array<{ __typename?: 'Word'; id: string }>;
  };
};

export type LanguagePropertiesFragment = {
  __typename?: 'Language';
  properties: Array<
    | { __typename?: 'OptionProperty'; id: string }
    | { __typename?: 'TextProperty'; id: string }
  >;
};

export type WordFieldsFragment = {
  __typename?: 'Word';
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
};

export type WordFieldsFullFragment = {
  __typename?: 'Word';
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  properties: Array<
    | {
        __typename?: 'OptionPropertyValue';
        property: {
          __typename?: 'OptionProperty';
          id: string;
          name: string;
          type: PropertyType;
        };
        option: { __typename?: 'Option'; id: string; value: string };
      }
    | {
        __typename?: 'TextPropertyValue';
        text: string;
        property: {
          __typename?: 'TextProperty';
          id: string;
          name: string;
          type: PropertyType;
        };
      }
  >;
};

export type TextPropertyFieldsFragment = {
  __typename?: 'TextProperty';
  id: string;
  name: string;
  type: PropertyType;
  partOfSpeech: PartOfSpeech;
};

export type OptionPropertyFieldsFragment = {
  __typename?: 'OptionProperty';
  id: string;
  name: string;
  type: PropertyType;
  partOfSpeech: PartOfSpeech;
  options: Array<{ __typename?: 'Option'; id: string; value: string }>;
};

export type CreateLanguageMutationVariables = Exact<{
  input: CreateLanguageInput;
}>;

export type CreateLanguageMutation = {
  __typename?: 'Mutation';
  createLanguage: { __typename?: 'Language'; id: string; name: string };
};

export type UpdateLanguageMutationVariables = Exact<{
  input: UpdateLanguageInput;
}>;

export type UpdateLanguageMutation = {
  __typename?: 'Mutation';
  updateLanguage: { __typename?: 'Language'; id: string; name: string };
};

export type DeleteLanguageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteLanguageMutation = {
  __typename?: 'Mutation';
  deleteLanguage: { __typename?: 'Language'; id: string };
};

export type CreatePropertyMutationVariables = Exact<{
  input: CreatePropertyInput;
}>;

export type CreatePropertyMutation = {
  __typename?: 'Mutation';
  createProperty:
    | {
        __typename?: 'OptionProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
        options: Array<{ __typename?: 'Option'; id: string; value: string }>;
      }
    | {
        __typename?: 'TextProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
      };
};

export type UpdatePropertyMutationVariables = Exact<{
  input: UpdatePropertyInput;
}>;

export type UpdatePropertyMutation = {
  __typename?: 'Mutation';
  updateProperty:
    | {
        __typename?: 'OptionProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
        options: Array<{ __typename?: 'Option'; id: string; value: string }>;
      }
    | {
        __typename?: 'TextProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
      };
};

export type DeletePropertyMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeletePropertyMutation = {
  __typename?: 'Mutation';
  deleteProperty:
    | {
        __typename?: 'OptionProperty';
        id: string;
        languageId: string;
        partOfSpeech: PartOfSpeech;
      }
    | {
        __typename?: 'TextProperty';
        id: string;
        languageId: string;
        partOfSpeech: PartOfSpeech;
      };
};

export type ReorderPropertiesMutationVariables = Exact<{
  input: ReorderPropertiesInput;
}>;

export type ReorderPropertiesMutation = {
  __typename?: 'Mutation';
  reorderProperties: Array<
    | { __typename?: 'OptionProperty'; id: string }
    | { __typename?: 'TextProperty'; id: string }
  >;
};

export type CreateWordMutationVariables = Exact<{
  input: CreateWordInput;
}>;

export type CreateWordMutation = {
  __typename?: 'Mutation';
  createWord: {
    __typename?: 'Word';
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
  };
};

export type UpdateWordMutationVariables = Exact<{
  input: UpdateWordInput;
}>;

export type UpdateWordMutation = {
  __typename?: 'Mutation';
  updateWord: {
    __typename?: 'Word';
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
  };
};

export type DeleteWordMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteWordMutation = {
  __typename?: 'Mutation';
  deleteWord: { __typename?: 'Word'; id: string };
};

export type CreateTopicMutationVariables = Exact<{
  input: CreateTopicInput;
}>;

export type CreateTopicMutation = {
  __typename?: 'Mutation';
  createTopic: { __typename?: 'Topic'; id: string; name: string };
};

export type DeleteTopicMutationVariables = Exact<{
  id: Scalars['ID'];
}>;

export type DeleteTopicMutation = {
  __typename?: 'Mutation';
  deleteTopic: { __typename?: 'Topic'; id: string };
};

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never }>;

export type GetLanguagesQuery = {
  __typename?: 'Query';
  languages: Array<{ __typename?: 'Language'; id: string; name: string }>;
};

export type GetWordsQueryVariables = Exact<{
  languageId: Scalars['ID'];
  start?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech> | PartOfSpeech>;
  query?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;

export type GetWordsQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    id: string;
    words: {
      __typename?: 'WordPage';
      hasMore: boolean;
      items: Array<{
        __typename?: 'Word';
        id: string;
        original: string;
        translation: string;
        partOfSpeech: PartOfSpeech;
      }>;
    };
  } | null;
};

export type GetWordQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetWordQuery = {
  __typename?: 'Query';
  word?: {
    __typename?: 'Word';
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
    properties: Array<
      | {
          __typename?: 'OptionPropertyValue';
          property: {
            __typename?: 'OptionProperty';
            id: string;
            name: string;
            type: PropertyType;
          };
          option: { __typename?: 'Option'; id: string; value: string };
        }
      | {
          __typename?: 'TextPropertyValue';
          text: string;
          property: {
            __typename?: 'TextProperty';
            id: string;
            name: string;
            type: PropertyType;
          };
        }
    >;
  } | null;
};

export type GetPropertiesQueryVariables = Exact<{
  languageId: Scalars['ID'];
  partOfSpeech?: InputMaybe<PartOfSpeech>;
}>;

export type GetPropertiesQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    id: string;
    properties: Array<
      | {
          __typename?: 'OptionProperty';
          id: string;
          name: string;
          type: PropertyType;
          partOfSpeech: PartOfSpeech;
          options: Array<{ __typename?: 'Option'; id: string; value: string }>;
        }
      | {
          __typename?: 'TextProperty';
          id: string;
          name: string;
          type: PropertyType;
          partOfSpeech: PartOfSpeech;
        }
    >;
  } | null;
};

export type GetPropertyQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetPropertyQuery = {
  __typename?: 'Query';
  property?:
    | {
        __typename?: 'OptionProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
        options: Array<{ __typename?: 'Option'; id: string; value: string }>;
      }
    | {
        __typename?: 'TextProperty';
        id: string;
        name: string;
        type: PropertyType;
        partOfSpeech: PartOfSpeech;
      }
    | null;
};

export type GetTopicsQueryVariables = Exact<{
  languageId: Scalars['ID'];
  start?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
}>;

export type GetTopicsQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    topics: {
      __typename?: 'TopicPage';
      hasMore: boolean;
      items: Array<{ __typename?: 'Topic'; id: string; name: string }>;
    };
  } | null;
};

export const LanguageFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LanguageFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Language' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LanguageFieldsFragment, unknown>;
export const LanguageWordsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LanguageWords' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Language' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'words' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'hasMore' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LanguageWordsFragment, unknown>;
export const LanguagePropertiesFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LanguageProperties' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Language' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'properties' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'partOfSpeech' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'partOfSpeech' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LanguagePropertiesFragment, unknown>;
export const WordFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WordFieldsFragment, unknown>;
export const WordFieldsFullFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFieldsFull' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'properties' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextPropertyValue' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'property' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionPropertyValue' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'property' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'option' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'value' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WordFieldsFullFragment, unknown>;
export const TextPropertyFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TextProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TextPropertyFieldsFragment, unknown>;
export const OptionPropertyFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OptionProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OptionPropertyFieldsFragment, unknown>;
export const CreateLanguageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateLanguage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateLanguageInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLanguage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateLanguageMutation,
  CreateLanguageMutationVariables
>;
export const UpdateLanguageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateLanguage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateLanguageInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateLanguage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables
>;
export const DeleteLanguageDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteLanguage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteLanguage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables
>;
export const CreatePropertyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateProperty' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreatePropertyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createProperty' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'TextPropertyFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OptionPropertyFields' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TextProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OptionProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreatePropertyMutation,
  CreatePropertyMutationVariables
>;
export const UpdatePropertyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateProperty' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdatePropertyInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateProperty' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'TextPropertyFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OptionPropertyFields' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TextProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OptionProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdatePropertyMutation,
  UpdatePropertyMutationVariables
>;
export const DeletePropertyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProperty' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteProperty' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'languageId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'partOfSpeech' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'languageId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'partOfSpeech' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeletePropertyMutation,
  DeletePropertyMutationVariables
>;
export const ReorderPropertiesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ReorderProperties' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ReorderPropertiesInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'reorderProperties' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ReorderPropertiesMutation,
  ReorderPropertiesMutationVariables
>;
export const CreateWordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateWord' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateWordInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createWord' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'WordFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateWordMutation, CreateWordMutationVariables>;
export const UpdateWordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateWord' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateWordInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateWord' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'WordFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateWordMutation, UpdateWordMutationVariables>;
export const DeleteWordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteWord' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteWord' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteWordMutation, DeleteWordMutationVariables>;
export const CreateTopicDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateTopic' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'CreateTopicInput' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createTopic' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateTopicMutation, CreateTopicMutationVariables>;
export const DeleteTopicDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteTopic' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteTopic' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteTopicMutation, DeleteTopicMutationVariables>;
export const GetLanguagesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetLanguages' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'languages' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'LanguageFields' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LanguageFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Language' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetLanguagesQuery, GetLanguagesQueryVariables>;
export const GetWordsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWords' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'languageId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'start' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'partsOfSpeech' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'PartOfSpeech' },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'topics' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'language' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'languageId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'words' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'start' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'start' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'limit' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'partsOfSpeech' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'partsOfSpeech' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'query' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'query' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'topics' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'topics' },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: { kind: 'Name', value: 'WordFields' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasMore' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetWordsQuery, GetWordsQueryVariables>;
export const GetWordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWord' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'word' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'WordFieldsFull' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'WordFieldsFull' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'Word' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'original' } },
          { kind: 'Field', name: { kind: 'Name', value: 'translation' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'properties' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextPropertyValue' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'property' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'text' } },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionPropertyValue' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'property' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'type' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'option' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'value' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetWordQuery, GetWordQueryVariables>;
export const GetPropertiesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProperties' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'languageId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'partOfSpeech' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'PartOfSpeech' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'language' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'languageId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'properties' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'partOfSpeech' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'partOfSpeech' },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'TextProperty' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'TextPropertyFields',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'OptionProperty' },
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'FragmentSpread',
                              name: {
                                kind: 'Name',
                                value: 'OptionPropertyFields',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TextProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OptionProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPropertiesQuery, GetPropertiesQueryVariables>;
export const GetPropertyDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetProperty' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'property' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'id' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TextProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'TextPropertyFields' },
                      },
                    ],
                  },
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'OptionProperty' },
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'OptionPropertyFields' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'TextProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyFields' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'OptionProperty' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'partOfSpeech' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'options' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetPropertyQuery, GetPropertyQueryVariables>;
export const GetTopicsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetTopics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'languageId' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'start' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'language' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'languageId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topics' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'start' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'start' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'limit' },
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'query' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'query' },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'hasMore' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetTopicsQuery, GetTopicsQueryVariables>;
