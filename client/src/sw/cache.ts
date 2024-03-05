import Dexie from 'dexie';
import type {
  Language,
  LanguageFieldsFragment,
  PartOfSpeech,
  Property,
  PropertyFieldsFragment,
  WordFieldsFragment,
  WordFieldsFullFragment,
} from '../api/types/graphql';
import { SwState } from './sync';

export class MovaDb extends Dexie {
  state!: Dexie.Table<SwState>;
  languages!: Dexie.Table<LanguageFieldsFragment & Partial<Language>>;
  properties!: Dexie.Table<PropertyFieldsFragment>;
  words!: Dexie.Table<WordFieldsFragment | WordFieldsFullFragment>;
}

const DB_VERSION = 1;

const db = new Dexie('mova') as MovaDb;

db.version(DB_VERSION).stores({
  state: 'id',
  languages: 'id,addedAt',
  properties: 'id,[languageId+partOfSpeech]',
  words: 'id,[languageId+addedAt+id],[languageId+original+id]',
});

export async function fetchState(): Promise<SwState | null> {
  return (await db.state.get(1)) ?? null;
}

export async function saveState(state: SwState): Promise<void> {
  await db.state.put(state);
}

export async function fetchLanguages(): Promise<LanguageFieldsFragment[]> {
  return await db.languages.orderBy('addedAt').toArray();
}

export async function saveLanguages(
  languages: LanguageFieldsFragment[],
): Promise<void> {
  await db.languages.bulkPut(languages);
}

export async function deleteLanguages(): Promise<void> {
  await db.languages.clear();
}

export async function fetchProperties(
  languageId: string,
  partOfSpeech?: PartOfSpeech,
): Promise<Property[]> {
  return db.properties
    .where(partOfSpeech ? { languageId, partOfSpeech } : { languageId })
    .sortBy('order');
}

export async function saveProperties(properties: Property[]): Promise<void> {
  await db.properties.bulkPut(properties);
}

export async function deleteProperties(languageId: string): Promise<void> {
  await db.properties.where({ languageId }).delete();
}

export async function fetchWords(
  languageId: string,
  limit: number,
  before?: number,
  beforeId?: string,
): Promise<WordFieldsFragment[]> {
  return await db.words
    .where('[languageId+addedAt+id]')
    .belowOrEqual([
      languageId,
      before ?? Dexie.maxKey,
      beforeId ?? Dexie.maxKey,
    ])
    .reverse()
    .limit(limit)
    .toArray();
}

export async function searchWords(
  languageId: string,
  query: string,
  limit: number,
  start?: number,
): Promise<WordFieldsFragment[]> {
  const words = db.words
    .where('[languageId+original+id]')
    .aboveOrEqual([languageId, query])
    .limit(limit);
  if (start) {
    words.offset(start);
  }
  return words.toArray();
}

export async function fetchWord(
  id: string,
): Promise<WordFieldsFullFragment | undefined> {
  return (await db.words.get(id)) as WordFieldsFullFragment;
}

export async function saveWords(words: WordFieldsFragment[]): Promise<void> {
  await db.words.bulkPut(words);
}

export async function saveWord(word: WordFieldsFullFragment): Promise<void> {
  await db.words.put(word);
}
