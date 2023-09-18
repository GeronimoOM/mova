import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';
import { PropertyId } from './Property';
import { PropertyValue } from './PropertyValue';
import { Topic } from './Topic';
import { DateTime } from 'luxon';

export type WordId = Flavor<string, 'Word'>;

export interface Word {
  id: WordId;
  original: string;
  translation: string;
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  properties?: Map<PropertyId, PropertyValue>;
  topics?: Topic[];
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
  Chronological = 'chronolocial',
  Random = 'random',
}

export type WordsStats = {
  total: WordsTotalStats;
  byDate: WordsByDateStats;
};

export interface WordsTotalStats {
  words: number;
}

export interface WordsByDateStats {
  from: DateTime;
  until: DateTime;
  dates: WordsDateStats[];
}

export interface WordsDateStats {
  date: DateTime;
  words: number;
}
