import Dexie from 'dexie';
import { v1 as uuid } from 'uuid';
import type {
  ApplyChangeInput,
  Language,
  LanguageFieldsFragment,
  LanguageUpdate,
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyUpdate,
  TextPropertyValue,
  TextPropertyValueSave,
  UpdateLanguageMutation,
  UpdatePropertyMutation,
  UpdateWordMutation,
  WordCreate,
  WordFieldsFragment,
  WordFieldsFullFragment,
  WordUpdate,
} from '../api/types/graphql';
import { SyncState } from './sync';

export class MovaDb extends Dexie {
  state!: Dexie.Table<SyncState>;
  languages!: Dexie.Table<LanguageFieldsFragment & Partial<Language>>;
  properties!: Dexie.Table<PropertyFieldsFragment>;
  words!: Dexie.Table<WordFieldsFragment | WordFieldsFullFragment>;
  changes!: Dexie.Table<ApplyChangeInput & { id: number }>;
}

const DB_VERSION = 1;

const db = new Dexie('mova') as MovaDb;

db.version(DB_VERSION).stores({
  state: 'id',
  languages: 'id,addedAt',
  properties: 'id,[languageId+partOfSpeech]',
  words: 'id,[languageId+addedAt+id],[languageId+original+id]',
  changes: 'id',
});
db.on('ready', () => {
  return initState();
});

export async function getState(): Promise<SyncState> {
  const state = await db.state.get(1);
  if (!state) {
    await initState();
  }

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

export async function getLanguages(): Promise<LanguageFieldsFragment[]> {
  return await db.languages.orderBy('addedAt').toArray();
}

export async function saveLanguage(
  language: LanguageFieldsFragment,
): Promise<void> {
  await db.languages.put({
    ...language,
    __typename: 'Language',
  });
}

export async function saveLanguages(
  languages: LanguageFieldsFragment[],
): Promise<void> {
  await db.languages.bulkPut(languages);
}

export async function updateLanguage(
  languageUpdate: UpdateLanguageMutation['updateLanguage'] | LanguageUpdate,
): Promise<void> {
  await db.languages.update(languageUpdate.id, { name: languageUpdate.name });
}

export async function deleteLanguages(): Promise<void> {
  await db.languages.clear();
}

export async function deleteLanguage(id: string): Promise<void> {
  await db.languages.delete(id);
}

export async function getProperties(
  languageId: string,
  partOfSpeech?: PartOfSpeech,
): Promise<PropertyFieldsFragment[]> {
  return db.properties
    .where(partOfSpeech ? { languageId, partOfSpeech } : { languageId })
    .sortBy('order');
}

export async function getProperty(
  propertyId: string,
): Promise<PropertyFieldsFragment | undefined> {
  return db.properties.get(propertyId);
}

export async function saveProperties(
  properties: PropertyFieldsFragment[],
): Promise<void> {
  await db.properties.bulkPut(properties);
}

export async function saveProperty(
  property: PropertyFieldsFragment,
): Promise<void> {
  await db.properties.put({
    ...property,
    __typename: 'TextProperty',
  });
}

export async function updateProperty(
  propertyUpdate: UpdatePropertyMutation['updateProperty'] | PropertyUpdate,
): Promise<void> {
  await db.properties.update(propertyUpdate.id, {
    ...(propertyUpdate.name && { name: propertyUpdate.name }),
    // TODO options
  });
}

export async function reorderProperties(propertyIds: string[]): Promise<void> {
  await db.transaction('rw', 'properties', async () => {
    let order = 1;
    for (const propertyId of propertyIds) {
      db.properties.update(propertyId, { order });
      order++;
    }
  });
}

export async function deleteProperties(languageId?: string): Promise<void> {
  await (languageId
    ? db.properties.where({ languageId }).delete()
    : db.properties.clear());
}

export async function deleteProperty(propertyId: string): Promise<void> {
  await db.properties.delete(propertyId);
}

export async function getWords(
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

export async function getWord(
  id: string,
): Promise<WordFieldsFullFragment | undefined> {
  return (await db.words.get(id)) as WordFieldsFullFragment;
}

export async function updateWords(words: WordFieldsFragment[]): Promise<void> {
  await db.transaction('rw', 'words', async () => {
    await Promise.all(words.map((word) => db.words.update(word.id, word)));
  });
}

export async function saveWord(
  word: WordFieldsFullFragment | WordCreate,
): Promise<void> {
  await db.words.put(
    word.__typename === 'Word'
      ? word
      : {
          ...word,
          properties: (word.properties as WordCreate['properties']).map(
            (propertyValue) => ({
              property: {
                id: propertyValue.propertyId,
                __typename: 'TextProperty',
              },
              text: (propertyValue as TextPropertyValueSave).text!,
              __typename: 'TextPropertyValue',
            }),
          ),
          __typename: 'Word',
        },
  );
}

export async function updateWord(
  wordUpdate: UpdateWordMutation['updateWord'] | WordUpdate,
): Promise<void> {
  if (wordUpdate.__typename === 'Word') {
    await db.words.update(wordUpdate.id, wordUpdate);
  } else {
    await db.transaction('rw', 'words', async () => {
      const word = await getWord(wordUpdate.id);
      let properties: WordFieldsFullFragment['properties'] | undefined;
      if (wordUpdate.__typename === 'WordUpdate' && wordUpdate.properties) {
        properties = [...word!.properties];
        for (const propertyValueSave of wordUpdate.properties) {
          const textPropertyValueSave =
            propertyValueSave as TextPropertyValueSave;

          if (textPropertyValueSave.text) {
            (
              properties.find(
                (propertValue) =>
                  propertValue.property.id !== propertyValueSave.propertyId,
              ) as TextPropertyValue
            ).text = textPropertyValueSave.text;
          } else {
            properties = properties?.filter(
              (propertValue) =>
                propertValue.property.id !== propertyValueSave.propertyId,
            );
          }
        }
      }
      await db.words.update(wordUpdate.id, {
        ...(wordUpdate.original && { original: wordUpdate.original }),
        ...(wordUpdate.translation && { translation: wordUpdate.translation }),
        ...(properties && { properties }),
      });
    });
  }
}

export async function deleteWords(): Promise<void> {
  await db.words.clear();
}

export async function deleteWord(wordId: string): Promise<void> {
  await db.words.delete(wordId);
}

export async function getChanges(
  limit: number,
): Promise<Array<ApplyChangeInput & { id: number }>> {
  return await db.changes.orderBy('id').limit(limit).toArray();
}

export async function saveChange(change: ApplyChangeInput): Promise<void> {
  await db.changes.put({
    id: Date.now(),
    ...change,
  });
}

export async function deleteChanges(ids: number[]): Promise<void> {
  await db.changes.bulkDelete(ids);
}

export async function transactionally<T>(fn: () => Promise<T>): Promise<T> {
  return await db.transaction('rw', ['languages', 'properties', 'words'], fn);
}
