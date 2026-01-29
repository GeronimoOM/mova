import { Static, Type } from '@sinclair/typebox';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT_REGEX } from 'utils/constants';
import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';
import { StartCursor } from './Page';
import { PropertyId } from './Property';
import { PropertyValue, PropertyValueSave } from './PropertyValue';

export type WordId = Flavor<string, 'Word'>;

export interface Word {
  id: WordId;
  original: string;
  translation: string;
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  addedAt: DateTime;
  mastery: number;
  confidence: number;
  masteryAttemptAt?: DateTime;
  properties?: Record<PropertyId, PropertyValue>;
}

export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adj = 'adj',
  Adv = 'adv',
  Pron = 'pron',
  Misc = 'misc',
}

export enum WordOrder {
  Alphabetical = 'alphabetical',
  Chronological = 'chronological',
  Confidence = 'confidence',
}

export enum WordMastery {
  None = 0,
  Basic = 1,
  Intermediate = 2,
  Advanced = 3,
}
export const WordMasteries = [
  WordMastery.None,
  WordMastery.Basic,
  WordMastery.Intermediate,
  WordMastery.Advanced,
];

export enum WordConfidence {
  Lowest = -2,
  Low = -1,
  Normal = 0,
  High = 1,
  Higher = 2,
  Highest = 3,
}

export interface WordCreate extends Omit<Word, 'properties'> {
  properties?: Record<PropertyId, PropertyValueSave>;
}

export interface WordUpdate {
  id: WordId;
  original?: string;
  translation?: string;
  properties?: Record<PropertyId, PropertyValueSave>;
  mastery?: WordMastery;
  confidence?: WordConfidence;
  nextExerciseAt?: DateTime;
}

export type ChronologicalCursor = Static<typeof ChronologicalCursor>;
export const ChronologicalCursor = Type.Object({
  addedAt: Type.RegExp(DATETIME_FORMAT_REGEX),
  id: Type.String(),
});

export type AlphabeticalCursor = Static<typeof AlphabeticalCursor>;
export const AlphabeticalCursor = Type.Object({
  original: Type.String(),
  id: Type.String(),
});

export type WordSortedCursor = Static<typeof WordSortedCursor>;
export const WordSortedCursor = Type.Union([
  ChronologicalCursor,
  AlphabeticalCursor,
]);

export type WordCursor = Static<typeof WordCursor>;
export const WordCursor = Type.Union([
  ChronologicalCursor,
  AlphabeticalCursor,
  StartCursor,
]);

export interface WordLink {
  word1Id: WordId;
  word2Id: WordId;
  type: WordLinkType;
  languageId: LanguageId;
}

export enum WordLinkType {
  Similar = 'similar',
  Distinct = 'distinct',
}
