import Dexie from 'dexie';
import type {
  Language,
  LanguageFieldsFragment,
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyUnion,
  WordFieldsFragment,
  WordFieldsFullFragment,
} from '../api/types/graphql';

export class MovaDb extends Dexie {
  languages!: Dexie.Table<LanguageFieldsFragment & Partial<Language>>;
  properties!: Dexie.Table<PropertyFieldsFragment>;
  words!: Dexie.Table<WordFieldsFragment | WordFieldsFullFragment>;
}

const DB_VERSION = 1;

const db = new Dexie('mova') as MovaDb;

db.version(DB_VERSION).stores({
  languages: 'id,addedAt',
  properties: 'id,[languageId+partOfSpeech]',
  words: 'id,[languageId+addedAt],[languageId+original]',
});

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
): Promise<PropertyUnion[]> {
  return partOfSpeech
    ? db.properties.where({ languageId, partOfSpeech }).toArray()
    : db.properties.where({ languageId }).toArray();
}

export async function saveProperties(
  properties: PropertyUnion[],
): Promise<void> {
  await db.properties.bulkPut(properties);
}

export async function deleteProperties(languageId: string): Promise<void> {
  await db.properties.where({ languageId }).delete();
}

export async function fetchWords(
  languageId: string,
  limit: number,
  before?: number,
): Promise<WordFieldsFragment[]> {
  return await db.words
    .where('[languageId+addedAt]')
    .belowOrEqual([languageId, before ?? Dexie.maxKey])
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
    .where('[languageId+original]')
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
