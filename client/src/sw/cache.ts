import Dexie from 'dexie';
import { v1 as uuid } from 'uuid';
import type {
  Language,
  LanguageFieldsFragment,
  LanguageUpdate,
  PartOfSpeech,
  Property,
  PropertyFieldsFragment,
  WordFieldsFragment,
  WordFieldsFullFragment,
} from '../api/types/graphql';
import { SyncState } from './sync';

export class MovaDb extends Dexie {
  state!: Dexie.Table<SyncState>;
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
db.on('ready', () => {
  return initState();
});

export async function fetchState(): Promise<SyncState> {
  return (await db.state.get(1))!;
}

export async function updateState(state: Partial<SyncState>): Promise<void> {
  await db.state.update(1, state);
}

async function initState(): Promise<void> {
  await db.transaction('rw', 'state', async () => {
    const state = await db.state.get(1);
    if (state) {
      return;
    }

    db.state.put({
      id: 1,
      clientId: uuid(),
      currentSyncStartedAt: null,
      currentSyncCursor: null,
      lastSyncedAt: null,
    });
  });
}

export async function fetchLanguages(): Promise<LanguageFieldsFragment[]> {
  return await db.languages.orderBy('addedAt').toArray();
}

export async function saveLanguage(
  language: LanguageFieldsFragment,
): Promise<void> {
  await db.languages.put(language);
}

export async function saveLanguages(
  languages: LanguageFieldsFragment[],
): Promise<void> {
  await db.languages.bulkPut(languages);
}

export async function updateLanguage(language: LanguageUpdate): Promise<void> {
  await db.languages.update(language.id, language);
}

export async function deleteLanguages(): Promise<void> {
  await db.languages.clear();
}

export async function deleteLanguage(id: string): Promise<void> {
  await db.languages.delete(id);
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

export async function deleteProperties(languageId?: string): Promise<void> {
  (await languageId)
    ? db.properties.where({ languageId }).delete()
    : db.properties.clear();
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

export async function deleteWords(): Promise<void> {
  await db.words.clear();
}

export async function transactionally<T>(fn: () => Promise<T>): Promise<T> {
  return await db.transaction('rw', ['languages', 'properties', 'words'], fn);
}
