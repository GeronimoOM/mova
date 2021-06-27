export interface Entry {
  id: string;
  original: string;
  translation: string;
  partOfSpeech: PartOfSpeech;
}

export interface EntryFull extends Entry {
  customValues: Record<string, PropertyValue>;
}

export function isEntryFull(entry: Entry | EntryFull): entry is EntryFull {
  return 'customValues' in entry;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  partOfSpeech: PartOfSpeech;
  options?: Record<string, string>;
  table?: Record<string, string>;
}

export interface Language {
  id: string;
  name: string;
}

export enum PropertyType {
  Text = 'text',
  SingleOption = 'single',
  MultiOption = 'multi',
  Table = 'table',
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.Text]: 'Text',
  [PropertyType.SingleOption]: 'Single Option',
  [PropertyType.MultiOption]: 'Multiple Option',
  [PropertyType.Table]: 'Table',
};

export enum PartOfSpeech {
  Noun = 'noun',
  Verb = 'verb',
  Adjective = 'adj',
  Adverb = 'adv',
  Pronoun = 'pron',
  Misc = 'misc',
}

export const partOfSpeechLabels: Record<PartOfSpeech, string> = {
  [PartOfSpeech.Noun]: 'Noun',
  [PartOfSpeech.Verb]: 'Verb',
  [PartOfSpeech.Adjective]: 'Adjective',
  [PartOfSpeech.Adverb]: 'Adverb',
  [PartOfSpeech.Pronoun]: 'Pronoun',
  [PartOfSpeech.Misc]: 'Misc',
};

export interface Option {
  id: string;
  name: string;
}

export interface TableCell {
  id: string;
  name: string;
}
export interface PropertyValue {
  definition: Property;
  text?: string;
  option?: string;
  options?: string[];
  table: Record<string, string>;
}

export interface Page<T> {
  items: T[];
  hasMore: boolean;
}

export const EMPTY_PAGE: Page<any> = {
  items: [],
  hasMore: false,
};
