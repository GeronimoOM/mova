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
  masteryIncAt?: DateTime;
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
  Random = 'random',
}

export const WordMasteries = [0, 1, 2, 3] as const;
export type WordMastery = (typeof WordMasteries)[number];

export const MaxWordMastery = Math.max(...WordMasteries);

export interface WordCreate extends Omit<Word, 'properties'> {
  properties?: Record<PropertyId, PropertyValueSave>;
}

export interface WordUpdate {
  id: WordId;
  original?: string;
  translation?: string;
  properties?: Record<PropertyId, PropertyValueSave>;
  mastery?: number;
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
