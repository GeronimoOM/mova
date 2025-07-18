 
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Timestamp` scalar type represents a timepoint as a string in the format `YYYY-MM-DD hh:mm:ss` . */
  Timestamp: { input: string; output: string; }
};

export type ApplyChangeInput = {
  createLanguage?: InputMaybe<CreateLanguageInput>;
  createProperty?: InputMaybe<CreatePropertyInput>;
  createWord?: InputMaybe<CreateWordInput>;
  createWordLink?: InputMaybe<CreateWordLinkInput>;
  deleteLanguage?: InputMaybe<DeleteLanguageInput>;
  deleteProperty?: InputMaybe<DeletePropertyInput>;
  deleteWord?: InputMaybe<DeleteWordInput>;
  deleteWordLink?: InputMaybe<DeleteWordLinkInput>;
  reorderProperties?: InputMaybe<ReorderPropertiesInput>;
  updateLanguage?: InputMaybe<UpdateLanguageInput>;
  updateProperty?: InputMaybe<UpdatePropertyInput>;
  updateWord?: InputMaybe<UpdateWordInput>;
};

export type Change = CreateLanguageChange | CreatePropertyChange | CreateWordChange | CreateWordLinkChange | DeleteLanguageChange | DeletePropertyChange | DeleteWordChange | DeleteWordLinkChange | ReorderPropertiesChange | UpdateLanguageChange | UpdatePropertyChange | UpdateWordChange;

export type ChangePage = {
  __typename?: 'ChangePage';
  items: Array<Change>;
  nextCursor?: Maybe<Scalars['String']['output']>;
  syncType: SyncType;
};

export enum ChangeType {
  CreateLanguage = 'CreateLanguage',
  CreateProperty = 'CreateProperty',
  CreateWord = 'CreateWord',
  CreateWordLink = 'CreateWordLink',
  DeleteLanguage = 'DeleteLanguage',
  DeleteProperty = 'DeleteProperty',
  DeleteWord = 'DeleteWord',
  DeleteWordLink = 'DeleteWordLink',
  ReorderProperties = 'ReorderProperties',
  UpdateLanguage = 'UpdateLanguage',
  UpdateProperty = 'UpdateProperty',
  UpdateWord = 'UpdateWord'
}

export enum Color {
  Blue = 'Blue',
  Brown = 'Brown',
  Green = 'Green',
  Orange = 'Orange',
  Pink = 'Pink',
  Purple = 'Purple',
  Red = 'Red',
  Teal = 'Teal',
  Yellow = 'Yellow'
}

export type CreateLanguageChange = IChange & {
  __typename?: 'CreateLanguageChange';
  changedAt: Scalars['Timestamp']['output'];
  created: Language;
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type CreateLanguageInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type CreateOptionInput = {
  color?: InputMaybe<Color>;
  id?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['String']['input'];
};

export type CreatePropertyChange = IChange & {
  __typename?: 'CreatePropertyChange';
  changedAt: Scalars['Timestamp']['output'];
  created: Property;
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type CreatePropertyInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  options?: InputMaybe<Array<CreateOptionInput>>;
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
};

export type CreateWordChange = IChange & {
  __typename?: 'CreateWordChange';
  changedAt: Scalars['Timestamp']['output'];
  created: WordCreate;
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type CreateWordInput = {
  addedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageId: Scalars['ID']['input'];
  original: Scalars['String']['input'];
  partOfSpeech: PartOfSpeech;
  properties?: InputMaybe<Array<SavePropertyValueInput>>;
  translation: Scalars['String']['input'];
};

export type CreateWordLinkChange = IChange & {
  __typename?: 'CreateWordLinkChange';
  changedAt: Scalars['Timestamp']['output'];
  created: WordLink;
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type CreateWordLinkInput = {
  type: WordLinkType;
  word1Id: Scalars['ID']['input'];
  word2Id: Scalars['ID']['input'];
};

export type DeleteLanguageChange = IChange & {
  __typename?: 'DeleteLanguageChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeleteLanguageInput = {
  id: Scalars['ID']['input'];
};

export type DeletePropertyChange = IChange & {
  __typename?: 'DeletePropertyChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeletePropertyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteWordChange = IChange & {
  __typename?: 'DeleteWordChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeleteWordInput = {
  id: Scalars['ID']['input'];
};

export type DeleteWordLinkChange = IChange & {
  __typename?: 'DeleteWordLinkChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: WordLink;
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeleteWordLinkInput = {
  type: WordLinkType;
  word1Id: Scalars['ID']['input'];
  word2Id: Scalars['ID']['input'];
};

export enum Direction {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Goal = {
  __typename?: 'Goal';
  cadence: ProgressCadence;
  points: Scalars['Int']['output'];
  type: ProgressType;
};

export type IChange = {
  changedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type IProperty = {
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
  usage: Scalars['Int']['output'];
};

export type IPropertyUpdate = {
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type: PropertyType;
};

export type IPropertyValueSave = {
  propertyId: Scalars['ID']['output'];
  type: PropertyType;
};

export type Language = {
  __typename?: 'Language';
  addedAt: Scalars['Timestamp']['output'];
  exerciseCount: Scalars['Int']['output'];
  exerciseWords: Array<Word>;
  goals: Array<Goal>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  progress: Progress;
  properties: Array<Property>;
  stats: WordsStats;
  word?: Maybe<Word>;
  words: WordPage;
};


export type LanguageExerciseWordsArgs = {
  total?: InputMaybe<Scalars['Int']['input']>;
};


export type LanguageProgressArgs = {
  type: ProgressType;
};


export type LanguagePropertiesArgs = {
  partOfSpeech?: InputMaybe<PartOfSpeech>;
};


export type LanguageWordArgs = {
  original: Scalars['String']['input'];
};


export type LanguageWordsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Direction>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type LanguageUpdate = {
  __typename?: 'LanguageUpdate';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type LoginInput = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  applyChanges: Scalars['Boolean']['output'];
  attemptMastery: Word;
  createLanguage: Language;
  createLink: WordLink;
  createProperty: Property;
  createWord: Word;
  deleteLanguage: Language;
  deleteLink: WordLink;
  deleteProperty: Property;
  deleteWord: Word;
  login?: Maybe<Scalars['String']['output']>;
  reorderProperties: Array<Property>;
  setGoals: Array<Goal>;
  updateLanguage: Language;
  updateProperty: Property;
  updateSettings: UserSettings;
  updateWord: Word;
};


export type MutationApplyChangesArgs = {
  changes: Array<ApplyChangeInput>;
};


export type MutationAttemptMasteryArgs = {
  success: Scalars['Boolean']['input'];
  wordId: Scalars['ID']['input'];
};


export type MutationCreateLanguageArgs = {
  input: CreateLanguageInput;
};


export type MutationCreateLinkArgs = {
  input: CreateWordLinkInput;
};


export type MutationCreatePropertyArgs = {
  input: CreatePropertyInput;
};


export type MutationCreateWordArgs = {
  input: CreateWordInput;
};


export type MutationDeleteLanguageArgs = {
  input: DeleteLanguageInput;
};


export type MutationDeleteLinkArgs = {
  input: DeleteWordLinkInput;
};


export type MutationDeletePropertyArgs = {
  input: DeletePropertyInput;
};


export type MutationDeleteWordArgs = {
  input: DeleteWordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationReorderPropertiesArgs = {
  input: ReorderPropertiesInput;
};


export type MutationSetGoalsArgs = {
  input: SetGoalsInput;
};


export type MutationUpdateLanguageArgs = {
  input: UpdateLanguageInput;
};


export type MutationUpdatePropertyArgs = {
  input: UpdatePropertyInput;
};


export type MutationUpdateSettingsArgs = {
  input: UpdateUserSettingsInput;
};


export type MutationUpdateWordArgs = {
  input: UpdateWordInput;
};

export type Option = {
  __typename?: 'Option';
  color?: Maybe<Color>;
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type OptionProperty = IProperty & {
  __typename?: 'OptionProperty';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  options: Array<Option>;
  optionsUsage: Array<OptionUsage>;
  order: Scalars['Int']['output'];
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
  usage: Scalars['Int']['output'];
};

export type OptionPropertyUpdate = IPropertyUpdate & {
  __typename?: 'OptionPropertyUpdate';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<OptionUpdate>>;
  type: PropertyType;
};

export type OptionPropertyValue = {
  __typename?: 'OptionPropertyValue';
  option?: Maybe<OptionValue>;
  property: OptionProperty;
};

export type OptionPropertyValueSave = IPropertyValueSave & {
  __typename?: 'OptionPropertyValueSave';
  color?: Maybe<Color>;
  optionId?: Maybe<Scalars['ID']['output']>;
  propertyId: Scalars['ID']['output'];
  type: PropertyType;
  value?: Maybe<Scalars['String']['output']>;
};

export type OptionUpdate = {
  __typename?: 'OptionUpdate';
  color?: Maybe<Color>;
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type OptionUsage = {
  __typename?: 'OptionUsage';
  count: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
};

export type OptionValue = {
  __typename?: 'OptionValue';
  color?: Maybe<Color>;
  id?: Maybe<Scalars['ID']['output']>;
  value: Scalars['String']['output'];
};

export enum PartOfSpeech {
  Adj = 'Adj',
  Adv = 'Adv',
  Misc = 'Misc',
  Noun = 'Noun',
  Pron = 'Pron',
  Verb = 'Verb'
}

export type Progress = {
  __typename?: 'Progress';
  cadence: ProgressCadence;
  current: ProgressInstance;
  goal: Goal;
  history: ProgressHistory;
  streak: Scalars['Int']['output'];
  type: ProgressType;
};


export type ProgressCurrentArgs = {
  cadence?: InputMaybe<ProgressCadence>;
};


export type ProgressHistoryArgs = {
  cadence: ProgressCadence;
};

export enum ProgressCadence {
  Daily = 'Daily',
  Weekly = 'Weekly'
}

export type ProgressHistory = {
  __typename?: 'ProgressHistory';
  cadence: ProgressCadence;
  from: Scalars['Timestamp']['output'];
  instances: Array<ProgressInstance>;
  until: Scalars['Timestamp']['output'];
};

export type ProgressInstance = {
  __typename?: 'ProgressInstance';
  date: Scalars['Timestamp']['output'];
  points: Scalars['Int']['output'];
};

export enum ProgressType {
  Mastery = 'Mastery',
  Words = 'Words'
}

export type PropertiesReorder = {
  __typename?: 'PropertiesReorder';
  languageId: Scalars['ID']['output'];
  partOfSpeech: PartOfSpeech;
  propertyIds: Array<Scalars['ID']['output']>;
};

export type Property = OptionProperty | TextProperty;

export enum PropertyType {
  Option = 'Option',
  Text = 'Text'
}

export type PropertyUpdate = OptionPropertyUpdate | TextPropertyUpdate;

export type PropertyValue = OptionPropertyValue | TextPropertyValue;

export type PropertyValueSave = OptionPropertyValueSave | TextPropertyValueSave;

export type Query = {
  __typename?: 'Query';
  changes: ChangePage;
  language?: Maybe<Language>;
  languages: Array<Language>;
  property?: Maybe<Property>;
  settings: UserSettings;
  word?: Maybe<Word>;
};


export type QueryChangesArgs = {
  changedAt?: InputMaybe<Scalars['Timestamp']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  syncType?: InputMaybe<SyncType>;
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

export type ReorderPropertiesChange = IChange & {
  __typename?: 'ReorderPropertiesChange';
  changedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  reordered: PropertiesReorder;
  type: ChangeType;
};

export type ReorderPropertiesInput = {
  languageId: Scalars['ID']['input'];
  partOfSpeech: PartOfSpeech;
  propertyIds: Array<Scalars['ID']['input']>;
};

export type SavePropertyValueInput = {
  id: Scalars['ID']['input'];
  option?: InputMaybe<UpdatePropertyValueOptionInput>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type SetGoalInput = {
  cadence: ProgressCadence;
  points: Scalars['Int']['input'];
  type: ProgressType;
};

export type SetGoalsInput = {
  goals: Array<SetGoalInput>;
  languageId: Scalars['ID']['input'];
};

export enum SyncType {
  Delta = 'Delta',
  Full = 'Full'
}

export type TextProperty = IProperty & {
  __typename?: 'TextProperty';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  partOfSpeech: PartOfSpeech;
  type: PropertyType;
  usage: Scalars['Int']['output'];
};

export type TextPropertyUpdate = IPropertyUpdate & {
  __typename?: 'TextPropertyUpdate';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type: PropertyType;
};

export type TextPropertyValue = {
  __typename?: 'TextPropertyValue';
  property: TextProperty;
  text: Scalars['String']['output'];
};

export type TextPropertyValueSave = IPropertyValueSave & {
  __typename?: 'TextPropertyValueSave';
  propertyId: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  type: PropertyType;
};

export type UpdateLanguageChange = IChange & {
  __typename?: 'UpdateLanguageChange';
  changedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
  updated: LanguageUpdate;
};

export type UpdateLanguageInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateOptionInput = {
  color?: InputMaybe<Color>;
  id?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePropertyChange = IChange & {
  __typename?: 'UpdatePropertyChange';
  changedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
  updated: PropertyUpdate;
};

export type UpdatePropertyInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<UpdateOptionInput>>;
};

export type UpdatePropertyValueOptionInput = {
  color?: InputMaybe<Color>;
  id?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserSettingsInput = {
  includeMastered?: InputMaybe<Scalars['Boolean']['input']>;
  selectedFont?: InputMaybe<Scalars['String']['input']>;
  selectedLanguageId?: InputMaybe<Scalars['ID']['input']>;
  selectedLocale?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWordChange = IChange & {
  __typename?: 'UpdateWordChange';
  changedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
  updated: WordUpdate;
};

export type UpdateWordInput = {
  id: Scalars['ID']['input'];
  original?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Array<SavePropertyValueInput>>;
  translation?: InputMaybe<Scalars['String']['input']>;
};

export type UserSettings = {
  __typename?: 'UserSettings';
  includeMastered?: Maybe<Scalars['Boolean']['output']>;
  selectedFont?: Maybe<Scalars['String']['output']>;
  selectedLanguageId?: Maybe<Scalars['ID']['output']>;
  selectedLocale?: Maybe<Scalars['String']['output']>;
};

export type Word = {
  __typename?: 'Word';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  links: Array<Word>;
  mastery: Scalars['Int']['output'];
  nextExerciseAt: Scalars['Timestamp']['output'];
  original: Scalars['String']['output'];
  partOfSpeech: PartOfSpeech;
  properties: Array<PropertyValue>;
  translation: Scalars['String']['output'];
};


export type WordLinksArgs = {
  type: WordLinkType;
};

export type WordCreate = {
  __typename?: 'WordCreate';
  addedAt: Scalars['Timestamp']['output'];
  id: Scalars['ID']['output'];
  languageId: Scalars['ID']['output'];
  mastery: Scalars['Int']['output'];
  nextExerciseAt: Scalars['Timestamp']['output'];
  original: Scalars['String']['output'];
  partOfSpeech: PartOfSpeech;
  properties: Array<PropertyValueSave>;
  translation: Scalars['String']['output'];
};

export type WordLink = {
  __typename?: 'WordLink';
  type: WordLinkType;
  word1Id: Scalars['ID']['output'];
  word2Id: Scalars['ID']['output'];
};

export enum WordLinkType {
  Distinct = 'Distinct',
  Similar = 'Similar'
}

export enum WordOrder {
  Alphabetical = 'Alphabetical',
  Chronological = 'Chronological',
  Random = 'Random'
}

export type WordPage = {
  __typename?: 'WordPage';
  items: Array<Word>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type WordUpdate = {
  __typename?: 'WordUpdate';
  id: Scalars['ID']['output'];
  mastery?: Maybe<Scalars['Int']['output']>;
  nextExerciseAt?: Maybe<Scalars['Timestamp']['output']>;
  original?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Array<PropertyValueSave>>;
  translation?: Maybe<Scalars['String']['output']>;
};

export type WordsStats = {
  __typename?: 'WordsStats';
  mastery: Array<WordsStatsMastery>;
  partsOfSpeech: Array<WordsStatsPartOfSpeech>;
  total: Scalars['Int']['output'];
};

export type WordsStatsMastery = {
  __typename?: 'WordsStatsMastery';
  mastery: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type WordsStatsPartOfSpeech = {
  __typename?: 'WordsStatsPartOfSpeech';
  partOfSpeech: PartOfSpeech;
  total: Scalars['Int']['output'];
};

export type LanguageFieldsFragment = { __typename?: 'Language', id: string, name: string, addedAt: string };

export type LanguageWordsFragment = { __typename?: 'Language', words: { __typename?: 'WordPage', nextCursor?: string | null, items: Array<{ __typename?: 'Word', id: string }> } };

export type LanguagePropertiesFragment = { __typename?: 'Language', properties: Array<{ __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number }> };

export type WordFieldsFragment = { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string };

export type WordFieldsFullFragment = { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string, properties: Array<{ __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null } | { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } }> };

export type WordFieldsLinksFragment = { __typename?: 'Word', similarLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }>, distinctLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }> };

export type LinkedWordFieldsFragment = { __typename?: 'Word', id: string, original: string, translation: string };

export type WordLinkFieldsFragment = { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType };

type PropertyValueFields_OptionPropertyValue_Fragment = { __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null };

type PropertyValueFields_TextPropertyValue_Fragment = { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } };

export type PropertyValueFieldsFragment = PropertyValueFields_OptionPropertyValue_Fragment | PropertyValueFields_TextPropertyValue_Fragment;

export type TextPropertyValueFieldsFragment = { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } };

export type OptionPropertyValueFieldsFragment = { __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null };

type PropertyFields_OptionProperty_Fragment = { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> };

type PropertyFields_TextProperty_Fragment = { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number };

export type PropertyFieldsFragment = PropertyFields_OptionProperty_Fragment | PropertyFields_TextProperty_Fragment;

type IPropertyFields_OptionProperty_Fragment = { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number };

type IPropertyFields_TextProperty_Fragment = { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number };

export type IPropertyFieldsFragment = IPropertyFields_OptionProperty_Fragment | IPropertyFields_TextProperty_Fragment;

export type TextPropertyFieldsFragment = { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number };

export type OptionPropertyFieldsFragment = { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> };

export type OptionFieldsFragment = { __typename?: 'Option', id: string, value: string, color?: Color | null };

type ChangeFields_CreateLanguageChange_Fragment = { __typename?: 'CreateLanguageChange', id: string, changedAt: string, type: ChangeType, createdLanguage: { __typename?: 'Language', id: string, name: string, addedAt: string } };

type ChangeFields_CreatePropertyChange_Fragment = { __typename?: 'CreatePropertyChange', id: string, changedAt: string, type: ChangeType, createdProperty: { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number } };

type ChangeFields_CreateWordChange_Fragment = { __typename?: 'CreateWordChange', id: string, changedAt: string, type: ChangeType, createdWord: { __typename?: 'WordCreate', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, mastery: number, nextExerciseAt: string, languageId: string, properties: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> } };

type ChangeFields_CreateWordLinkChange_Fragment = { __typename?: 'CreateWordLinkChange', id: string, changedAt: string, type: ChangeType, createdLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

type ChangeFields_DeleteLanguageChange_Fragment = { __typename?: 'DeleteLanguageChange', id: string, changedAt: string, type: ChangeType, deletedLanguage: string };

type ChangeFields_DeletePropertyChange_Fragment = { __typename?: 'DeletePropertyChange', id: string, changedAt: string, type: ChangeType, deletedProperty: string };

type ChangeFields_DeleteWordChange_Fragment = { __typename?: 'DeleteWordChange', id: string, changedAt: string, type: ChangeType, deletedWord: string };

type ChangeFields_DeleteWordLinkChange_Fragment = { __typename?: 'DeleteWordLinkChange', id: string, changedAt: string, type: ChangeType, deletedLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

type ChangeFields_ReorderPropertiesChange_Fragment = { __typename?: 'ReorderPropertiesChange', id: string, changedAt: string, type: ChangeType, reorderedProperties: { __typename?: 'PropertiesReorder', propertyIds: Array<string> } };

type ChangeFields_UpdateLanguageChange_Fragment = { __typename?: 'UpdateLanguageChange', id: string, changedAt: string, type: ChangeType, updatedLanguage: { __typename?: 'LanguageUpdate', id: string, name: string } };

type ChangeFields_UpdatePropertyChange_Fragment = { __typename?: 'UpdatePropertyChange', id: string, changedAt: string, type: ChangeType, updatedProperty: { __typename?: 'OptionPropertyUpdate', id: string, name?: string | null, type: PropertyType, options?: Array<{ __typename?: 'OptionUpdate', id: string, value?: string | null, color?: Color | null }> | null } | { __typename?: 'TextPropertyUpdate', id: string, name?: string | null, type: PropertyType } };

type ChangeFields_UpdateWordChange_Fragment = { __typename?: 'UpdateWordChange', id: string, changedAt: string, type: ChangeType, updatedWord: { __typename?: 'WordUpdate', id: string, original?: string | null, translation?: string | null, mastery?: number | null, nextExerciseAt?: string | null, properties?: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> | null } };

export type ChangeFieldsFragment = ChangeFields_CreateLanguageChange_Fragment | ChangeFields_CreatePropertyChange_Fragment | ChangeFields_CreateWordChange_Fragment | ChangeFields_CreateWordLinkChange_Fragment | ChangeFields_DeleteLanguageChange_Fragment | ChangeFields_DeletePropertyChange_Fragment | ChangeFields_DeleteWordChange_Fragment | ChangeFields_DeleteWordLinkChange_Fragment | ChangeFields_ReorderPropertiesChange_Fragment | ChangeFields_UpdateLanguageChange_Fragment | ChangeFields_UpdatePropertyChange_Fragment | ChangeFields_UpdateWordChange_Fragment;

export type CreateLanguageChangeFieldsFragment = { __typename?: 'CreateLanguageChange', createdLanguage: { __typename?: 'Language', id: string, name: string, addedAt: string } };

export type UpdateLanguageChangeFieldsFragment = { __typename?: 'UpdateLanguageChange', updatedLanguage: { __typename?: 'LanguageUpdate', id: string, name: string } };

export type DeleteLanguageChangeFieldsFragment = { __typename?: 'DeleteLanguageChange', deletedLanguage: string };

export type CreatePropertyChangeFieldsFragment = { __typename?: 'CreatePropertyChange', createdProperty: { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number } };

export type UpdatePropertyChangeFieldsFragment = { __typename?: 'UpdatePropertyChange', updatedProperty: { __typename?: 'OptionPropertyUpdate', id: string, name?: string | null, type: PropertyType, options?: Array<{ __typename?: 'OptionUpdate', id: string, value?: string | null, color?: Color | null }> | null } | { __typename?: 'TextPropertyUpdate', id: string, name?: string | null, type: PropertyType } };

export type ReorderPropertiesChangeFieldsFragment = { __typename?: 'ReorderPropertiesChange', reorderedProperties: { __typename?: 'PropertiesReorder', propertyIds: Array<string> } };

export type DeletePropertyChangeFieldsFragment = { __typename?: 'DeletePropertyChange', deletedProperty: string };

export type CreateWordChangeFieldsFragment = { __typename?: 'CreateWordChange', createdWord: { __typename?: 'WordCreate', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, mastery: number, nextExerciseAt: string, languageId: string, properties: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> } };

export type UpdateWordChangeFieldsFragment = { __typename?: 'UpdateWordChange', updatedWord: { __typename?: 'WordUpdate', id: string, original?: string | null, translation?: string | null, mastery?: number | null, nextExerciseAt?: string | null, properties?: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> | null } };

export type DeleteWordChangeFieldsFragment = { __typename?: 'DeleteWordChange', deletedWord: string };

type PropertyValueSaveFields_OptionPropertyValueSave_Fragment = { __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null };

type PropertyValueSaveFields_TextPropertyValueSave_Fragment = { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null };

export type PropertyValueSaveFieldsFragment = PropertyValueSaveFields_OptionPropertyValueSave_Fragment | PropertyValueSaveFields_TextPropertyValueSave_Fragment;

export type CreateWordLinkChangeFieldsFragment = { __typename?: 'CreateWordLinkChange', createdLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

export type DeleteWordLinkChangeFieldsFragment = { __typename?: 'DeleteWordLinkChange', deletedLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

export type GoalFieldsFragment = { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number };

export type ProgressInstanceFieldsFragment = { __typename?: 'ProgressInstance', date: string, points: number };

export type ProgressFieldsFragment = { __typename?: 'Progress', type: ProgressType, cadence: ProgressCadence, goal: { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }, current: { __typename?: 'ProgressInstance', date: string, points: number } };

export type ProgressHistoryFieldsFragment = { __typename?: 'ProgressHistory', cadence: ProgressCadence, from: string, until: string, instances: Array<{ __typename?: 'ProgressInstance', date: string, points: number }> };

export type WordsStatsFieldsFragment = { __typename?: 'WordsStats', total: number, mastery: Array<{ __typename?: 'WordsStatsMastery', total: number, mastery: number }>, partsOfSpeech: Array<{ __typename?: 'WordsStatsPartOfSpeech', total: number, partOfSpeech: PartOfSpeech }> };

export type CreateLanguageMutationVariables = Exact<{
  input: CreateLanguageInput;
}>;


export type CreateLanguageMutation = { __typename?: 'Mutation', createLanguage: { __typename?: 'Language', id: string, name: string, addedAt: string } };

export type UpdateLanguageMutationVariables = Exact<{
  input: UpdateLanguageInput;
}>;


export type UpdateLanguageMutation = { __typename?: 'Mutation', updateLanguage: { __typename?: 'Language', id: string, name: string } };

export type DeleteLanguageMutationVariables = Exact<{
  input: DeleteLanguageInput;
}>;


export type DeleteLanguageMutation = { __typename?: 'Mutation', deleteLanguage: { __typename?: 'Language', id: string } };

export type CreatePropertyMutationVariables = Exact<{
  input: CreatePropertyInput;
}>;


export type CreatePropertyMutation = { __typename?: 'Mutation', createProperty: { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number } };

export type UpdatePropertyMutationVariables = Exact<{
  input: UpdatePropertyInput;
}>;


export type UpdatePropertyMutation = { __typename?: 'Mutation', updateProperty: { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number } };

export type ReorderPropertiesMutationVariables = Exact<{
  input: ReorderPropertiesInput;
}>;


export type ReorderPropertiesMutation = { __typename?: 'Mutation', reorderProperties: Array<{ __typename?: 'OptionProperty', id: string, order: number } | { __typename?: 'TextProperty', id: string, order: number }> };

export type DeletePropertyMutationVariables = Exact<{
  input: DeletePropertyInput;
}>;


export type DeletePropertyMutation = { __typename?: 'Mutation', deleteProperty: { __typename?: 'OptionProperty', id: string, languageId: string, partOfSpeech: PartOfSpeech } | { __typename?: 'TextProperty', id: string, languageId: string, partOfSpeech: PartOfSpeech } };

export type CreateWordMutationVariables = Exact<{
  input: CreateWordInput;
}>;


export type CreateWordMutation = { __typename?: 'Mutation', createWord: { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string, properties: Array<{ __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null } | { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } }> } };

export type UpdateWordMutationVariables = Exact<{
  input: UpdateWordInput;
}>;


export type UpdateWordMutation = { __typename?: 'Mutation', updateWord: { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string, properties: Array<{ __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null } | { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } }> } };

export type DeleteWordMutationVariables = Exact<{
  input: DeleteWordInput;
}>;


export type DeleteWordMutation = { __typename?: 'Mutation', deleteWord: { __typename?: 'Word', id: string, languageId: string } };

export type CreateLinkMutationVariables = Exact<{
  input: CreateWordLinkInput;
}>;


export type CreateLinkMutation = { __typename?: 'Mutation', createLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

export type DeleteLinkMutationVariables = Exact<{
  input: DeleteWordLinkInput;
}>;


export type DeleteLinkMutation = { __typename?: 'Mutation', deleteLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } };

export type AttemptWordMasteryMutationVariables = Exact<{
  wordId: Scalars['ID']['input'];
  success: Scalars['Boolean']['input'];
}>;


export type AttemptWordMasteryMutation = { __typename?: 'Mutation', attemptMastery: { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string } };

export type SetGoalsMutationVariables = Exact<{
  input: SetGoalsInput;
}>;


export type SetGoalsMutation = { __typename?: 'Mutation', setGoals: Array<{ __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }> };

export type ApplyChangesMutationVariables = Exact<{
  changes: Array<ApplyChangeInput> | ApplyChangeInput;
}>;


export type ApplyChangesMutation = { __typename?: 'Mutation', applyChanges: boolean };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: string | null };

export type UpdateSettingsMutationVariables = Exact<{
  input: UpdateUserSettingsInput;
}>;


export type UpdateSettingsMutation = { __typename?: 'Mutation', updateSettings: { __typename?: 'UserSettings', selectedLanguageId?: string | null, selectedLocale?: string | null, selectedFont?: string | null, includeMastered?: boolean | null } };

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = { __typename?: 'Query', languages: Array<{ __typename?: 'Language', id: string, name: string, addedAt: string }> };

export type GetWordsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech> | PartOfSpeech>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WordOrder>;
}>;


export type GetWordsQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, words: { __typename?: 'WordPage', nextCursor?: string | null, items: Array<{ __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string }> } } | null };

export type GetWordQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWordQuery = { __typename?: 'Query', word?: { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string, properties: Array<{ __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null } | { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } }>, similarLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }>, distinctLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }> } | null };

export type GetWordByOriginalQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  original: Scalars['String']['input'];
}>;


export type GetWordByOriginalQuery = { __typename?: 'Query', language?: { __typename?: 'Language', word?: { __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string } | null } | null };

export type GetPropertiesQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  partOfSpeech?: InputMaybe<PartOfSpeech>;
}>;


export type GetPropertiesQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, properties: Array<{ __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number }> } | null };

export type GetPropertyUsageQueryVariables = Exact<{
  propertyId: Scalars['ID']['input'];
}>;


export type GetPropertyUsageQuery = { __typename?: 'Query', property?: { __typename?: 'OptionProperty', id: string, usage: number } | { __typename?: 'TextProperty', id: string, usage: number } | null };

export type GetPropertyOptionsUsageQueryVariables = Exact<{
  propertyId: Scalars['ID']['input'];
}>;


export type GetPropertyOptionsUsageQuery = { __typename?: 'Query', property?: { __typename?: 'OptionProperty', id: string, optionsUsage: Array<{ __typename?: 'OptionUsage', id: string, count: number }> } | { __typename?: 'TextProperty' } | null };

export type GetExerciseWordsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;


export type GetExerciseWordsQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, exerciseWords: Array<{ __typename?: 'Word', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, languageId: string, mastery: number, nextExerciseAt: string, properties: Array<{ __typename?: 'OptionPropertyValue', property: { __typename?: 'OptionProperty', id: string }, option?: { __typename?: 'OptionValue', id?: string | null, value: string, color?: Color | null } | null } | { __typename?: 'TextPropertyValue', text: string, property: { __typename?: 'TextProperty', id: string } }>, similarLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }>, distinctLinks: Array<{ __typename?: 'Word', id: string, original: string, translation: string }> }> } | null };

export type GetExerciseCountQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;


export type GetExerciseCountQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, exerciseCount: number } | null };

export type GetAllProgressQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;


export type GetAllProgressQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, wordsProgress: { __typename?: 'Progress', type: ProgressType, cadence: ProgressCadence, goal: { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }, current: { __typename?: 'ProgressInstance', date: string, points: number } }, masteryProgress: { __typename?: 'Progress', type: ProgressType, cadence: ProgressCadence, goal: { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }, current: { __typename?: 'ProgressInstance', date: string, points: number } } } | null };

export type GetProgressQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  type: ProgressType;
}>;


export type GetProgressQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, progress: { __typename?: 'Progress', type: ProgressType, cadence: ProgressCadence, goal: { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }, current: { __typename?: 'ProgressInstance', date: string, points: number } } } | null };

export type GetProgressHistoryQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
  type: ProgressType;
}>;


export type GetProgressHistoryQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, progress: { __typename?: 'Progress', type: ProgressType, cadence: ProgressCadence, streak: number, goal: { __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }, dailyHistory: { __typename?: 'ProgressHistory', cadence: ProgressCadence, from: string, until: string, instances: Array<{ __typename?: 'ProgressInstance', date: string, points: number }> }, weeklyHistory: { __typename?: 'ProgressHistory', cadence: ProgressCadence, from: string, until: string, instances: Array<{ __typename?: 'ProgressInstance', date: string, points: number }> } } } | null };

export type GetGoalsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;


export type GetGoalsQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, goals: Array<{ __typename?: 'Goal', type: ProgressType, cadence: ProgressCadence, points: number }> } | null };

export type GetStatsQueryVariables = Exact<{
  languageId: Scalars['ID']['input'];
}>;


export type GetStatsQuery = { __typename?: 'Query', language?: { __typename?: 'Language', id: string, stats: { __typename?: 'WordsStats', total: number, mastery: Array<{ __typename?: 'WordsStatsMastery', total: number, mastery: number }>, partsOfSpeech: Array<{ __typename?: 'WordsStatsPartOfSpeech', total: number, partOfSpeech: PartOfSpeech }> } } | null };

export type GetUserSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserSettingsQuery = { __typename?: 'Query', settings: { __typename?: 'UserSettings', selectedLanguageId?: string | null, selectedLocale?: string | null, selectedFont?: string | null, includeMastered?: boolean | null } };

export type GetChangesQueryVariables = Exact<{
  syncType: SyncType;
  cursor?: InputMaybe<Scalars['String']['input']>;
  changedAt?: InputMaybe<Scalars['Timestamp']['input']>;
}>;


export type GetChangesQuery = { __typename?: 'Query', changes: { __typename?: 'ChangePage', syncType: SyncType, nextCursor?: string | null, items: Array<{ __typename?: 'CreateLanguageChange', id: string, changedAt: string, type: ChangeType, createdLanguage: { __typename?: 'Language', id: string, name: string, addedAt: string } } | { __typename?: 'CreatePropertyChange', id: string, changedAt: string, type: ChangeType, createdProperty: { __typename?: 'OptionProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number, options: Array<{ __typename?: 'Option', id: string, value: string, color?: Color | null }> } | { __typename?: 'TextProperty', id: string, name: string, type: PropertyType, partOfSpeech: PartOfSpeech, languageId: string, addedAt: string, order: number } } | { __typename?: 'CreateWordChange', id: string, changedAt: string, type: ChangeType, createdWord: { __typename?: 'WordCreate', id: string, original: string, translation: string, partOfSpeech: PartOfSpeech, addedAt: string, mastery: number, nextExerciseAt: string, languageId: string, properties: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> } } | { __typename?: 'CreateWordLinkChange', id: string, changedAt: string, type: ChangeType, createdLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } } | { __typename?: 'DeleteLanguageChange', id: string, changedAt: string, type: ChangeType, deletedLanguage: string } | { __typename?: 'DeletePropertyChange', id: string, changedAt: string, type: ChangeType, deletedProperty: string } | { __typename?: 'DeleteWordChange', id: string, changedAt: string, type: ChangeType, deletedWord: string } | { __typename?: 'DeleteWordLinkChange', id: string, changedAt: string, type: ChangeType, deletedLink: { __typename?: 'WordLink', word1Id: string, word2Id: string, type: WordLinkType } } | { __typename?: 'ReorderPropertiesChange', id: string, changedAt: string, type: ChangeType, reorderedProperties: { __typename?: 'PropertiesReorder', propertyIds: Array<string> } } | { __typename?: 'UpdateLanguageChange', id: string, changedAt: string, type: ChangeType, updatedLanguage: { __typename?: 'LanguageUpdate', id: string, name: string } } | { __typename?: 'UpdatePropertyChange', id: string, changedAt: string, type: ChangeType, updatedProperty: { __typename?: 'OptionPropertyUpdate', id: string, name?: string | null, type: PropertyType, options?: Array<{ __typename?: 'OptionUpdate', id: string, value?: string | null, color?: Color | null }> | null } | { __typename?: 'TextPropertyUpdate', id: string, name?: string | null, type: PropertyType } } | { __typename?: 'UpdateWordChange', id: string, changedAt: string, type: ChangeType, updatedWord: { __typename?: 'WordUpdate', id: string, original?: string | null, translation?: string | null, mastery?: number | null, nextExerciseAt?: string | null, properties?: Array<{ __typename?: 'OptionPropertyValueSave', propertyId: string, type: PropertyType, optionId?: string | null, value?: string | null, color?: Color | null } | { __typename?: 'TextPropertyValueSave', propertyId: string, type: PropertyType, text?: string | null }> | null } }> } };

export const LanguageWordsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageWords"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"words"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]} as unknown as DocumentNode<LanguageWordsFragment, unknown>;
export const IPropertyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]} as unknown as DocumentNode<IPropertyFieldsFragment, unknown>;
export const TextPropertyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]} as unknown as DocumentNode<TextPropertyFieldsFragment, unknown>;
export const OptionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<OptionFieldsFragment, unknown>;
export const OptionPropertyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]} as unknown as DocumentNode<OptionPropertyFieldsFragment, unknown>;
export const PropertyFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}}]} as unknown as DocumentNode<PropertyFieldsFragment, unknown>;
export const LanguagePropertiesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageProperties"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"properties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partOfSpeech"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partOfSpeech"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}}]} as unknown as DocumentNode<LanguagePropertiesFragment, unknown>;
export const WordFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}}]} as unknown as DocumentNode<WordFieldsFragment, unknown>;
export const TextPropertyValueFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}}]} as unknown as DocumentNode<TextPropertyValueFieldsFragment, unknown>;
export const OptionPropertyValueFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<OptionPropertyValueFieldsFragment, unknown>;
export const PropertyValueFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<PropertyValueFieldsFragment, unknown>;
export const WordFieldsFullFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}}]} as unknown as DocumentNode<WordFieldsFullFragment, unknown>;
export const LinkedWordFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LinkedWordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}}]}}]} as unknown as DocumentNode<LinkedWordFieldsFragment, unknown>;
export const WordFieldsLinksFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"similarLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Similar"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"distinctLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Distinct"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LinkedWordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}}]}}]} as unknown as DocumentNode<WordFieldsLinksFragment, unknown>;
export const LanguageFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}}]} as unknown as DocumentNode<LanguageFieldsFragment, unknown>;
export const CreateLanguageChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLanguage"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LanguageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}}]} as unknown as DocumentNode<CreateLanguageChangeFieldsFragment, unknown>;
export const UpdateLanguageChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedLanguage"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateLanguageChangeFieldsFragment, unknown>;
export const DeleteLanguageChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLanguage"},"name":{"kind":"Name","value":"deleted"}}]}}]} as unknown as DocumentNode<DeleteLanguageChangeFieldsFragment, unknown>;
export const CreatePropertyChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdProperty"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}}]} as unknown as DocumentNode<CreatePropertyChangeFieldsFragment, unknown>;
export const UpdatePropertyChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedProperty"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePropertyChangeFieldsFragment, unknown>;
export const ReorderPropertiesChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReorderPropertiesChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderPropertiesChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"reorderedProperties"},"name":{"kind":"Name","value":"reordered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyIds"}}]}}]}}]} as unknown as DocumentNode<ReorderPropertiesChangeFieldsFragment, unknown>;
export const DeletePropertyChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeletePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedProperty"},"name":{"kind":"Name","value":"deleted"}}]}}]} as unknown as DocumentNode<DeletePropertyChangeFieldsFragment, unknown>;
export const PropertyValueSaveFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueSaveFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<PropertyValueSaveFieldsFragment, unknown>;
export const CreateWordChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdWord"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueSaveFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<CreateWordChangeFieldsFragment, unknown>;
export const UpdateWordChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedWord"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueSaveFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]} as unknown as DocumentNode<UpdateWordChangeFieldsFragment, unknown>;
export const DeleteWordChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedWord"},"name":{"kind":"Name","value":"deleted"}}]}}]} as unknown as DocumentNode<DeleteWordChangeFieldsFragment, unknown>;
export const WordLinkFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<WordLinkFieldsFragment, unknown>;
export const CreateWordLinkChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLink"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<CreateWordLinkChangeFieldsFragment, unknown>;
export const DeleteWordLinkChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLink"},"name":{"kind":"Name","value":"deleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<DeleteWordLinkChangeFieldsFragment, unknown>;
export const ChangeFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Change"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdateLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreatePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdatePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReorderPropertiesChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeletePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdateWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateWordLinkChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteWordLinkChangeFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueSaveFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLanguage"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LanguageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedLanguage"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLanguage"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdProperty"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedProperty"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReorderPropertiesChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderPropertiesChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"reorderedProperties"},"name":{"kind":"Name","value":"reordered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyIds"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeletePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedProperty"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdWord"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedWord"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedWord"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLink"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLink"},"name":{"kind":"Name","value":"deleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}}]} as unknown as DocumentNode<ChangeFieldsFragment, unknown>;
export const GoalFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<GoalFieldsFragment, unknown>;
export const ProgressInstanceFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<ProgressInstanceFieldsFragment, unknown>;
export const ProgressFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInstanceFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<ProgressFieldsFragment, unknown>;
export const ProgressHistoryFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressHistory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"until"}},{"kind":"Field","name":{"kind":"Name","value":"instances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInstanceFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<ProgressHistoryFieldsFragment, unknown>;
export const WordsStatsFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordsStatsFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordsStats"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partsOfSpeech"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}}]}}]}}]} as unknown as DocumentNode<WordsStatsFieldsFragment, unknown>;
export const CreateLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LanguageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}}]} as unknown as DocumentNode<CreateLanguageMutation, CreateLanguageMutationVariables>;
export const UpdateLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateLanguageMutation, UpdateLanguageMutationVariables>;
export const DeleteLanguageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLanguage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLanguageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLanguage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteLanguageMutation, DeleteLanguageMutationVariables>;
export const CreatePropertyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProperty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePropertyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProperty"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}}]} as unknown as DocumentNode<CreatePropertyMutation, CreatePropertyMutationVariables>;
export const UpdatePropertyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProperty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePropertyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProperty"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}}]} as unknown as DocumentNode<UpdatePropertyMutation, UpdatePropertyMutationVariables>;
export const ReorderPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReorderProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderPropertiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reorderProperties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<ReorderPropertiesMutation, ReorderPropertiesMutationVariables>;
export const DeletePropertyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProperty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePropertyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProperty"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}}]}}]}}]}}]} as unknown as DocumentNode<DeletePropertyMutation, DeletePropertyMutationVariables>;
export const CreateWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueFields"}}]}}]}}]} as unknown as DocumentNode<CreateWordMutation, CreateWordMutationVariables>;
export const UpdateWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsFull"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueFields"}}]}}]}}]} as unknown as DocumentNode<UpdateWordMutation, UpdateWordMutationVariables>;
export const DeleteWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}}]}}]}}]} as unknown as DocumentNode<DeleteWordMutation, DeleteWordMutationVariables>;
export const CreateLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<CreateLinkMutation, CreateLinkMutationVariables>;
export const DeleteLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordLinkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLink"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<DeleteLinkMutation, DeleteLinkMutationVariables>;
export const AttemptWordMasteryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AttemptWordMastery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"wordId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"success"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attemptMastery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"wordId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"wordId"}}},{"kind":"Argument","name":{"kind":"Name","value":"success"},"value":{"kind":"Variable","name":{"kind":"Name","value":"success"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}}]} as unknown as DocumentNode<AttemptWordMasteryMutation, AttemptWordMasteryMutationVariables>;
export const SetGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetGoals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetGoalsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setGoals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<SetGoalsMutation, SetGoalsMutationVariables>;
export const ApplyChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changes"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApplyChangeInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyChanges"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"changes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changes"}}}]}]}}]} as unknown as DocumentNode<ApplyChangesMutation, ApplyChangesMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const UpdateSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedLanguageId"}},{"kind":"Field","name":{"kind":"Name","value":"selectedLocale"}},{"kind":"Field","name":{"kind":"Name","value":"selectedFont"}},{"kind":"Field","name":{"kind":"Name","value":"includeMastered"}}]}}]}}]} as unknown as DocumentNode<UpdateSettingsMutation, UpdateSettingsMutationVariables>;
export const GetLanguagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLanguages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"languages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LanguageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}}]} as unknown as DocumentNode<GetLanguagesQuery, GetLanguagesQueryVariables>;
export const GetWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"query"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partsOfSpeech"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PartOfSpeech"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WordOrder"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"words"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"partsOfSpeech"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partsOfSpeech"}}},{"kind":"Argument","name":{"kind":"Name","value":"query"},"value":{"kind":"Variable","name":{"kind":"Name","value":"query"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}}]} as unknown as DocumentNode<GetWordsQuery, GetWordsQueryVariables>;
export const GetWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsFull"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsLinks"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LinkedWordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"similarLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Similar"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"distinctLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Distinct"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}}]}}]} as unknown as DocumentNode<GetWordQuery, GetWordQueryVariables>;
export const GetWordByOriginalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordByOriginal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"original"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"original"},"value":{"kind":"Variable","name":{"kind":"Name","value":"original"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}}]} as unknown as DocumentNode<GetWordByOriginalQuery, GetWordByOriginalQueryVariables>;
export const GetPropertiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProperties"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"partOfSpeech"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PartOfSpeech"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"partOfSpeech"},"value":{"kind":"Variable","name":{"kind":"Name","value":"partOfSpeech"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}}]} as unknown as DocumentNode<GetPropertiesQuery, GetPropertiesQueryVariables>;
export const GetPropertyUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPropertyUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPropertyUsageQuery, GetPropertyUsageQueryVariables>;
export const GetPropertyOptionsUsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPropertyOptionsUsage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"propertyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"optionsUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetPropertyOptionsUsageQuery, GetPropertyOptionsUsageQueryVariables>;
export const GetExerciseWordsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExerciseWords"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsFull"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFieldsLinks"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"property"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"option"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyValueFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LinkedWordFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsFull"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordFields"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordFieldsLinks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Word"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"similarLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Similar"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"distinctLinks"},"name":{"kind":"Name","value":"links"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Distinct"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LinkedWordFields"}}]}}]}}]} as unknown as DocumentNode<GetExerciseWordsQuery, GetExerciseWordsQueryVariables>;
export const GetExerciseCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExerciseCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"exerciseCount"}}]}}]}}]} as unknown as DocumentNode<GetExerciseCountQuery, GetExerciseCountQueryVariables>;
export const GetAllProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"wordsProgress"},"name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Words"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"masteryProgress"},"name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"Mastery"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInstanceFields"}}]}}]}}]} as unknown as DocumentNode<GetAllProgressQuery, GetAllProgressQueryVariables>;
export const GetProgressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProgress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Progress"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInstanceFields"}}]}}]}}]} as unknown as DocumentNode<GetProgressQuery, GetProgressQueryVariables>;
export const GetProgressHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProgressHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"progress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"streak"}},{"kind":"Field","alias":{"kind":"Name","value":"dailyHistory"},"name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cadence"},"value":{"kind":"EnumValue","value":"Daily"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressHistoryFields"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"weeklyHistory"},"name":{"kind":"Name","value":"history"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cadence"},"value":{"kind":"EnumValue","value":"Weekly"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressHistoryFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"streak"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressInstanceFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInstance"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProgressHistoryFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressHistory"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"until"}},{"kind":"Field","name":{"kind":"Name","value":"instances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProgressInstanceFields"}}]}}]}}]} as unknown as DocumentNode<GetProgressHistoryQuery, GetProgressHistoryQueryVariables>;
export const GetGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGoals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GoalFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Goal"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"cadence"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]} as unknown as DocumentNode<GetGoalsQuery, GetGoalsQueryVariables>;
export const GetStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"languageId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordsStatsFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordsStatsFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordsStats"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}}]}},{"kind":"Field","name":{"kind":"Name","value":"partsOfSpeech"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}}]}}]}}]} as unknown as DocumentNode<GetStatsQuery, GetStatsQueryVariables>;
export const GetUserSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"settings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"selectedLanguageId"}},{"kind":"Field","name":{"kind":"Name","value":"selectedLocale"}},{"kind":"Field","name":{"kind":"Name","value":"selectedFont"}},{"kind":"Field","name":{"kind":"Name","value":"includeMastered"}}]}}]}}]} as unknown as DocumentNode<GetUserSettingsQuery, GetUserSettingsQueryVariables>;
export const GetChangesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChanges"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"syncType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"changedAt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Timestamp"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"syncType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"syncType"}}},{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"changedAt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"changedAt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ChangeFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"syncType"}},{"kind":"Field","name":{"kind":"Name","value":"nextCursor"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LanguageFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Language"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLanguage"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LanguageFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedLanguage"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteLanguageChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLanguageChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLanguage"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"IPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Option"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"OptionPropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"IPropertyFields"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Property"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TextPropertyFields"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionProperty"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"OptionPropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdProperty"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdatePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedProperty"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReorderPropertiesChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ReorderPropertiesChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"reorderedProperties"},"name":{"kind":"Name","value":"reordered"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyIds"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeletePropertyChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePropertyChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedProperty"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PropertyValueSaveFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertyId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TextPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"OptionPropertyValueSave"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdWord"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"partOfSpeech"}},{"kind":"Field","name":{"kind":"Name","value":"addedAt"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"languageId"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UpdateWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"updatedWord"},"name":{"kind":"Name","value":"updated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"original"}},{"kind":"Field","name":{"kind":"Name","value":"translation"}},{"kind":"Field","name":{"kind":"Name","value":"mastery"}},{"kind":"Field","name":{"kind":"Name","value":"nextExerciseAt"}},{"kind":"Field","name":{"kind":"Name","value":"properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PropertyValueSaveFields"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedWord"},"name":{"kind":"Name","value":"deleted"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WordLinkFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WordLink"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"word1Id"}},{"kind":"Field","name":{"kind":"Name","value":"word2Id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CreateWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"createdLink"},"name":{"kind":"Name","value":"created"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteWordLinkChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteWordLinkChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"deletedLink"},"name":{"kind":"Name","value":"deleted"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WordLinkFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ChangeFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Change"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IChange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"changedAt"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdateLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteLanguageChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreatePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdatePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReorderPropertiesChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeletePropertyChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UpdateWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteWordChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CreateWordLinkChangeFields"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteWordLinkChangeFields"}}]}}]} as unknown as DocumentNode<GetChangesQuery, GetChangesQueryVariables>;