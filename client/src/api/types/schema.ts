export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
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
  __typename: 'ChangePage';
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
  __typename: 'CreateLanguageChange';
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
  __typename: 'CreatePropertyChange';
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
  __typename: 'CreateWordChange';
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
  __typename: 'CreateWordLinkChange';
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
  __typename: 'DeleteLanguageChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeleteLanguageInput = {
  id: Scalars['ID']['input'];
};

export type DeletePropertyChange = IChange & {
  __typename: 'DeletePropertyChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeletePropertyInput = {
  id: Scalars['ID']['input'];
};

export type DeleteWordChange = IChange & {
  __typename: 'DeleteWordChange';
  changedAt: Scalars['Timestamp']['output'];
  deleted: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  type: ChangeType;
};

export type DeleteWordInput = {
  id: Scalars['ID']['input'];
};

export type DeleteWordLinkChange = IChange & {
  __typename: 'DeleteWordLinkChange';
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
  __typename: 'Goal';
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
  __typename: 'Language';
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
  lowConfidence?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<WordOrder>;
  partsOfSpeech?: InputMaybe<Array<PartOfSpeech>>;
  query?: InputMaybe<Scalars['String']['input']>;
};

export type LanguageUpdate = {
  __typename: 'LanguageUpdate';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type LoginInput = {
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename: 'Mutation';
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
  resetConfidence: Word;
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


export type MutationResetConfidenceArgs = {
  wordId: Scalars['ID']['input'];
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
  __typename: 'Option';
  color?: Maybe<Color>;
  id: Scalars['ID']['output'];
  value: Scalars['String']['output'];
};

export type OptionProperty = IProperty & {
  __typename: 'OptionProperty';
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
  __typename: 'OptionPropertyUpdate';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<OptionUpdate>>;
  type: PropertyType;
};

export type OptionPropertyValue = {
  __typename: 'OptionPropertyValue';
  option?: Maybe<OptionValue>;
  property: OptionProperty;
};

export type OptionPropertyValueSave = IPropertyValueSave & {
  __typename: 'OptionPropertyValueSave';
  color?: Maybe<Color>;
  optionId?: Maybe<Scalars['ID']['output']>;
  propertyId: Scalars['ID']['output'];
  type: PropertyType;
  value?: Maybe<Scalars['String']['output']>;
};

export type OptionUpdate = {
  __typename: 'OptionUpdate';
  color?: Maybe<Color>;
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type OptionUsage = {
  __typename: 'OptionUsage';
  count: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
};

export type OptionValue = {
  __typename: 'OptionValue';
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
  __typename: 'Progress';
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
  __typename: 'ProgressHistory';
  cadence: ProgressCadence;
  from: Scalars['Timestamp']['output'];
  instances: Array<ProgressInstance>;
  until: Scalars['Timestamp']['output'];
};

export type ProgressInstance = {
  __typename: 'ProgressInstance';
  date: Scalars['Timestamp']['output'];
  points: Scalars['Int']['output'];
};

export enum ProgressType {
  Mastery = 'Mastery',
  Words = 'Words'
}

export type PropertiesReorder = {
  __typename: 'PropertiesReorder';
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
  __typename: 'Query';
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
  __typename: 'ReorderPropertiesChange';
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
  __typename: 'TextProperty';
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
  __typename: 'TextPropertyUpdate';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  type: PropertyType;
};

export type TextPropertyValue = {
  __typename: 'TextPropertyValue';
  property: TextProperty;
  text: Scalars['String']['output'];
};

export type TextPropertyValueSave = IPropertyValueSave & {
  __typename: 'TextPropertyValueSave';
  propertyId: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  type: PropertyType;
};

export type UpdateLanguageChange = IChange & {
  __typename: 'UpdateLanguageChange';
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
  __typename: 'UpdatePropertyChange';
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
  selectedFont?: InputMaybe<Scalars['String']['input']>;
  selectedLanguageId?: InputMaybe<Scalars['ID']['input']>;
  selectedLocale?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWordChange = IChange & {
  __typename: 'UpdateWordChange';
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
  __typename: 'UserSettings';
  selectedFont?: Maybe<Scalars['String']['output']>;
  selectedLanguageId?: Maybe<Scalars['ID']['output']>;
  selectedLocale?: Maybe<Scalars['String']['output']>;
};

export type Word = {
  __typename: 'Word';
  addedAt: Scalars['Timestamp']['output'];
  confidence: Scalars['Int']['output'];
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
  __typename: 'WordCreate';
  addedAt: Scalars['Timestamp']['output'];
  confidence: Scalars['Int']['output'];
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
  __typename: 'WordLink';
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
  Confidence = 'Confidence'
}

export type WordPage = {
  __typename: 'WordPage';
  items: Array<Word>;
  nextCursor?: Maybe<Scalars['String']['output']>;
};

export type WordUpdate = {
  __typename: 'WordUpdate';
  confidence?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mastery?: Maybe<Scalars['Int']['output']>;
  nextExerciseAt?: Maybe<Scalars['Timestamp']['output']>;
  original?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Array<PropertyValueSave>>;
  translation?: Maybe<Scalars['String']['output']>;
};

export type WordsStats = {
  __typename: 'WordsStats';
  confidence: Array<WordsStatsConfidence>;
  mastery: Array<WordsStatsMastery>;
  partsOfSpeech: Array<WordsStatsPartOfSpeech>;
  total: Scalars['Int']['output'];
};

export type WordsStatsConfidence = {
  __typename: 'WordsStatsConfidence';
  confidence: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type WordsStatsMastery = {
  __typename: 'WordsStatsMastery';
  mastery: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type WordsStatsPartOfSpeech = {
  __typename: 'WordsStatsPartOfSpeech';
  partOfSpeech: PartOfSpeech;
  total: Scalars['Int']['output'];
};
