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
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `Timestamp` scalar type represents points as a number seconds since the UNIX epoch. */
  Timestamp: { input: number; output: number };
};

export type CreateLanguageInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreatePropertyInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  options?: InputMaybe<Array<Scalars['String']['input']>>;
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type CreateTopicInput = {
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type CreateWordInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageId: Scalars['ID']['input'];
  original: Scalars['String']['input'];
  partOfSpeech: PartOfSpeech;
  properties?: InputMaybe<Array<UpdatePropertyValueInput>>;
  translation: Scalars['String']['input'];
};

export type Language = {
  __typename?: 'Language';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  properties: Array<PropertyUnion>;
  topics: TopicPage;
  words: WordPage;
  wordsStats: WordsStats;
};

export type LanguagePropertiesArgs = {
  partOfSpeech?: InputMaybe<PartOfSpeech>;
};

export type LanguageTopicsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type LanguageWordsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']['input']>;
  topics?: InputMaybe<Array<Scalars['ID']['input']>>;
  until?: InputMaybe<Scalars['String']['input']>;
};

export type LanguageWordsStatsArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
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
  topicId: Scalars['ID']['input'];
  wordId: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
};

export type MutationDeletePropertyArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteTopicArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteWordArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRemoveTopicWordArgs = {
  topicId: Scalars['ID']['input'];
  wordId: Scalars['ID']['input'];
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
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type OptionProperty = {
  __typename?: 'OptionProperty';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  id: Scalars['ID']['input'];
};

export type QueryPropertyArgs = {
  id: Scalars['ID']['input'];
};

export type QueryWordArgs = {
  id: Scalars['ID']['input'];
};

export type ReorderPropertiesInput = {
  languageId: Scalars['ID']['input'];
  partOfSpeech: PartOfSpeech;
  propertyIds: Array<Scalars['ID']['input']>;
};

export type TextProperty = {
  __typename?: 'TextProperty';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type TextPropertyValue = {
  __typename?: 'TextPropertyValue';
  property: TextProperty;
  text: Scalars['String']['output'];
};

export type Topic = {
  __typename?: 'Topic';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  words: WordPage;
};

export type TopicWordsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
  partOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type TopicPage = {
  __typename?: 'TopicPage';
  items: Array<Topic>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type UpdateLanguageInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateOptionInput = {
  id: Scalars['ID']['input'];
  value: Scalars['String']['input'];
};

export type UpdatePropertyInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<UpdateOptionInput>>;
};

export type UpdatePropertyValueInput = {
  id: Scalars['ID']['input'];
  option?: InputMaybe<Scalars['ID']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWordInput = {
  id: Scalars['ID']['input'];
  original?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<UpdatePropertyValueInput>>;
  translation?: InputMaybe<Scalars['String']['input']>;
};

export type Word = {
  __typename?: 'Word';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['String']['output'];
  languageId: Scalars['ID']['output'];
  original: Scalars['String']['output'];
  partOfSpeech: PartOfSpeech;
  properties: Array<PropertyValueUnion>;
  translation: Scalars['String']['output'];
};

export enum WordOrder {
  Alphabetical = 'Alphabetical',
  Chronological = 'Chronological',
  Random = 'Random',
}

export type WordPage = {
  __typename?: 'WordPage';
  items: Array<Word>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type WordsByDateStats = {
  __typename?: 'WordsByDateStats';
  dates: Array<WordsDateStats>;
  from: Scalars['String']['output'];
  until: Scalars['String']['output'];
};

export type WordsDateStats = {
  __typename?: 'WordsDateStats';
  date: Scalars['String']['output'];
  words: Scalars['Int']['output'];
};

export type WordsStats = {
  __typename?: 'WordsStats';
  byDate: WordsByDateStats;
  total: WordsTotalStats;
};

export type WordsTotalStats = {
  __typename?: 'WordsTotalStats';
  words: Scalars['Int']['output'];
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
    nextCursor?: string | null;
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
  addedAt: number;
};

export type WordFieldsFullFragment = {
  __typename?: 'Word';
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
  addedAt: number;
  properties: Array<
    | {
        __typename?: 'OptionPropertyValue';
        property: { __typename?: 'OptionProperty'; id: string };
        option: { __typename?: 'Option'; id: string; value: string };
      }
    | {
        __typename?: 'TextPropertyValue';
        text: string;
        property: { __typename?: 'TextProperty'; id: string };
      }
  >;
};

export type TextPropertyValueFieldsFragment = {
  __typename?: 'TextPropertyValue';
  text: string;
  property: { __typename?: 'TextProperty'; id: string };
};

export type OptionPropertyValueFieldsFragment = {
  __typename?: 'OptionPropertyValue';
  property: { __typename?: 'OptionProperty'; id: string };
  option: { __typename?: 'Option'; id: string; value: string };
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
  id: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
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
    addedAt: number;
    properties: Array<
      | {
          __typename?: 'OptionPropertyValue';
          property: { __typename?: 'OptionProperty'; id: string };
          option: { __typename?: 'Option'; id: string; value: string };
        }
      | {
          __typename?: 'TextPropertyValue';
          text: string;
          property: { __typename?: 'TextProperty'; id: string };
        }
    >;
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
    addedAt: number;
    properties: Array<
      | {
          __typename?: 'OptionPropertyValue';
          property: { __typename?: 'OptionProperty'; id: string };
          option: { __typename?: 'Option'; id: string; value: string };
        }
      | {
          __typename?: 'TextPropertyValue';
          text: string;
          property: { __typename?: 'TextProperty'; id: string };
        }
    >;
  };
};

export type DeleteWordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteWordMutation = {
  __typename?: 'Mutation';
  deleteWord: { __typename?: 'Word'; id: string; languageId: string };
};

export type CreateTopicMutationVariables = Exact<{
  input: CreateTopicInput;
}>;

export type CreateTopicMutation = {
  __typename?: 'Mutation';
  createTopic: { __typename?: 'Topic'; id: string; name: string };
};

export type DeleteTopicMutationVariables = Exact<{
  id: Scalars['ID']['input'];
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
  languageId: Scalars['ID']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech> | PartOfSpeech>;
  topics?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
}>;

export type GetWordsQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    id: string;
    words: {
      __typename?: 'WordPage';
      nextCursor?: string | null;
      items: Array<{
        __typename?: 'Word';
        id: string;
        original: string;
        translation: string;
        partOfSpeech: PartOfSpeech;
        addedAt: number;
      }>;
    };
  } | null;
};

export type GetWordQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetWordQuery = {
  __typename?: 'Query';
  word?: {
    __typename?: 'Word';
    id: string;
    original: string;
    translation: string;
    partOfSpeech: PartOfSpeech;
    addedAt: number;
    properties: Array<
      | {
          __typename?: 'OptionPropertyValue';
          property: { __typename?: 'OptionProperty'; id: string };
          option: { __typename?: 'Option'; id: string; value: string };
        }
      | {
          __typename?: 'TextPropertyValue';
          text: string;
          property: { __typename?: 'TextProperty'; id: string };
        }
    >;
  } | null;
};

export type GetPropertiesQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
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

export type GetTopicsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetTopicsQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    id: string;
    topics: {
      __typename?: 'TopicPage';
      nextCursor?: string | null;
      items: Array<{ __typename?: 'Topic'; id: string; name: string }>;
    };
  } | null;
};

export type GetWordsStatsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;

export type GetWordsStatsQuery = {
  __typename?: 'Query';
  language?: {
    __typename?: 'Language';
    id: string;
    wordsStats: {
      __typename?: 'WordsStats';
      total: { __typename?: 'WordsTotalStats'; words: number };
      byDate: {
        __typename?: 'WordsByDateStats';
        from: string;
        until: string;
        dates: Array<{
          __typename?: 'WordsDateStats';
          date: string;
          words: number;
        }>;
      };
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
                { kind: 'Field', name: { kind: 'Name', value: 'nextCursor' } },
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
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<WordFieldsFragment, unknown>;
export const TextPropertyValueFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<TextPropertyValueFieldsFragment, unknown>;
export const OptionPropertyValueFieldsFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'option' },
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
} as unknown as DocumentNode<OptionPropertyValueFieldsFragment, unknown>;
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TextPropertyValueFields',
                        },
                      },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'OptionPropertyValueFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'TextPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'option' },
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
      name: { kind: 'Name', value: 'TextPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'option' },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TextPropertyValueFields',
                        },
                      },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'OptionPropertyValueFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
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
      name: { kind: 'Name', value: 'TextPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'option' },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TextPropertyValueFields',
                        },
                      },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'OptionPropertyValueFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'languageId' } },
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
            name: { kind: 'Name', value: 'query' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'cursor' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
            name: { kind: 'Name', value: 'order' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'WordOrder' },
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
                      name: { kind: 'Name', value: 'cursor' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'cursor' },
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
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'order' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'order' },
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
                        name: { kind: 'Name', value: 'nextCursor' },
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
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
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
      name: { kind: 'Name', value: 'TextPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'text' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'OptionPropertyValueFields' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'option' },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'TextPropertyValueFields',
                        },
                      },
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
                        kind: 'FragmentSpread',
                        name: {
                          kind: 'Name',
                          value: 'OptionPropertyValueFields',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'addedAt' } },
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
            name: { kind: 'Name', value: 'cursor' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'topics' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'cursor' },
                      value: {
                        kind: 'Variable',
                        name: { kind: 'Name', value: 'cursor' },
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
                        name: { kind: 'Name', value: 'nextCursor' },
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
export const GetWordsStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetWordsStats' },
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
                  name: { kind: 'Name', value: 'wordsStats' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'total' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'words' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'byDate' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'from' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'until' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'dates' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'date' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'words' },
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
      },
    },
  ],
} as unknown as DocumentNode<GetWordsStatsQuery, GetWordsStatsQueryVariables>;
