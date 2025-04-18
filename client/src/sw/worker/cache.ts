import Dexie from 'dexie';
import { v1 as uuid } from 'uuid';
import {
  type ApplyChangeInput,
  type AttemptWordMasteryMutation,
  type Language,
  type LanguageFieldsFragment,
  type LanguageUpdate,
  type OptionFieldsFragment,
  type OptionPropertyFieldsFragment,
  type PartOfSpeech,
  type PropertyFieldsFragment,
  type PropertyUpdate,
  type UpdateLanguageMutation,
  type UpdateWordMutation,
  type WordCreate,
  type WordFieldsFragment,
  type WordFieldsFullFragment,
  type WordUpdate,
} from '../../api/types/graphql';
import { updatedOptions } from '../../utils/options';
import { updatedWordProperties } from '../../utils/properties';
import { SyncState } from './sync';

export class MovaDb extends Dexie {
  state!: Dexie.Table<SyncState>;
  languages!: Dexie.Table<LanguageFieldsFragment & Partial<Language>>;
  properties!: Dexie.Table<PropertyFieldsFragment>;
  words!: Dexie.Table<WordFieldsFragment | WordFieldsFullFragment>;
  changes!: Dexie.Table<ApplyChangeInput & { id: number }>;
  auth!: Dexie.Table<{ id: number; token: string }>;
}

const db = new Dexie('mova') as MovaDb;

const indices = {
  state: 'id',
  languages: 'id,addedAt',
  properties: 'id,[languageId+partOfSpeech]',
  words: 'id,[languageId+addedAt+id],[languageId+original+id]',
  changes: 'id',
};

db.version(1).stores(indices);

db.version(2)
  .stores(indices)
  .upgrade(async () => {
    await destroy();
  });

db.version(3)
  .stores(indices)
  .upgrade(async () => {
    await destroy();
  });

export async function getState(): Promise<SyncState> {
  return (await db.state.get(1))!;
}

export async function updateState(state: Partial<SyncState>): Promise<void> {
  await db.state.update(1, state);
}

export async function initState(token: string): Promise<void> {
  await db.transaction('rw', 'state', async () => {
    const state = await db.state.get(1);
    if (state) {
      return;
    }

    await db.state.put({
      id: 1,
      token,
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
  await db.languages.put(language);
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
  await db.properties.put(property);
}

export async function updateProperty(
  propertyUpdate: PropertyFieldsFragment | PropertyUpdate,
): Promise<void> {
  let options: OptionFieldsFragment[] | undefined;
  if (propertyUpdate.__typename === 'OptionProperty') {
    options = propertyUpdate.options;
  } else if (
    propertyUpdate.__typename === 'OptionPropertyUpdate' &&
    propertyUpdate.options
  ) {
    const currentProperty = (await getProperty(propertyUpdate.id))!;
    const currentOptions =
      (currentProperty as OptionPropertyFieldsFragment).options ?? [];
    options = updatedOptions(currentOptions, propertyUpdate.options);
  }

  await db.properties.update(propertyUpdate.id, {
    ...(propertyUpdate.name && { name: propertyUpdate.name }),
    ...(options && { options }),
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
    .between(
      [languageId, Dexie.minKey, Dexie.minKey],
      [languageId, before ?? Dexie.maxKey, beforeId ?? Dexie.maxKey],
      false,
      true,
    )
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
  const queryUpperBound = `${query.slice(
    0,
    query.length - 1,
  )}${String.fromCharCode(query.charCodeAt(query.length - 1) + 1)}`;
  const words = db.words
    .where('[languageId+original+id]')
    .between([languageId, query], [languageId, queryUpperBound])
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

export async function getWordByOriginal(
  languageId: string,
  original: string,
): Promise<WordFieldsFullFragment | undefined> {
  return (await db.words.get({
    languageId,
    original,
  })) as WordFieldsFullFragment;
}

export async function updateWords(words: WordFieldsFragment[]): Promise<void> {
  await db.transaction('rw', 'words', async () => {
    await Promise.all(words.map((word) => db.words.update(word.id, word)));
  });
}

export async function saveWord(
  word: WordFieldsFullFragment | WordCreate,
): Promise<void> {
  let properties: WordFieldsFullFragment['properties'];
  if (word.__typename === 'Word') {
    properties = word.properties;
  } else {
    const currentWord = (await getWord(word.id))!;
    properties = updatedWordProperties(
      currentWord.properties,
      word.properties as WordCreate['properties'],
    );
  }

  await db.words.put({
    ...word,
    properties,
    __typename: 'Word',
  });
}

export async function updateWord(
  wordUpdate:
    | UpdateWordMutation['updateWord']
    | AttemptWordMasteryMutation['attemptMastery']
    | WordUpdate,
): Promise<void> {
  if (wordUpdate.__typename === 'Word') {
    await db.words.update(wordUpdate.id, wordUpdate);
  } else if (wordUpdate.__typename === 'WordUpdate') {
    await db.transaction('rw', 'words', async () => {
      const currentWord = (await getWord(wordUpdate.id))!;
      let properties: WordFieldsFullFragment['properties'] | undefined;
      if (wordUpdate.properties) {
        properties = updatedWordProperties(
          currentWord.properties,
          wordUpdate.properties,
        );
      }

      await db.words.update(wordUpdate.id, {
        ...(wordUpdate.original && { original: wordUpdate.original }),
        ...(wordUpdate.translation && { translation: wordUpdate.translation }),
        ...(properties && { properties }),
        ...(wordUpdate.mastery && { mastery: wordUpdate.mastery }),
        ...(wordUpdate.nextExerciseAt && {
          nextExerciseAt: wordUpdate.nextExerciseAt,
        }),
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

export async function hasChanges(): Promise<boolean> {
  return !!(await db.changes.limit(1).toArray()).length;
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

export async function destroy(): Promise<void> {
  await Promise.all([
    db.languages.clear(),
    db.properties.clear(),
    db.words.clear(),
    db.changes.clear(),
    db.state.clear(),
  ]);
}

export async function transactionally<T>(fn: () => Promise<T>): Promise<T> {
  return await db.transaction('rw', ['languages', 'properties', 'words'], fn);
}
