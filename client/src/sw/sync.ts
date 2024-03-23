import { GraphQLClient } from 'graphql-request';
import {
  ApplyChangeInput,
  ApplyChangesDocument,
  ChangeFieldsFragment,
  ChangeType,
  CreateLanguageChangeFieldsFragment,
  CreatePropertyChangeFieldsFragment,
  CreateWordChangeFieldsFragment,
  DeleteLanguageChangeFieldsFragment,
  DeletePropertyChangeFieldsFragment,
  DeleteWordChangeFieldsFragment,
  GetChangesDocument,
  GetChangesQuery,
  ReorderPropertiesChangeFieldsFragment,
  SyncType,
  UpdateLanguageChangeFieldsFragment,
  UpdatePropertyChangeFieldsFragment,
  UpdateWordChangeFieldsFragment,
} from '../api/types/graphql';
import * as cache from './cache';
import { ServiceWorkerMessageType, produceMessage } from './messages';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from '../utils/constants';

export const SYNC_CLIENT_ID_HEADER = 'Sync-Client-ID';

const SYNC_STALE_THRESHOLD = 2 * 24 * 60 * 60; // 2 days
const PUSH_CHANGES_BATCH = 20;

export type SyncState = {
  id: 1;
  clientId: string;
  currentSyncStartedAt: number | null;
  currentSyncCursor: string | null;
  lastSyncedAt: number | null;
};

export enum SyncStatus {
  Empty = 'empty',
  Stale = 'stale',
  Synced = 'synced',
}

let isSyncing = false;

const gqlClient = new GraphQLClient('/api/graphql', { fetch });

export async function getSyncStatus(state?: SyncState): Promise<SyncStatus> {
  const { lastSyncedAt } = state ?? (await cache.getState());
  if (!lastSyncedAt) {
    return SyncStatus.Empty;
  } else if (isSyncStale(lastSyncedAt)) {
    return SyncStatus.Stale;
  } else {
    return SyncStatus.Synced;
  }
}

function isSyncStale(timestamp: number): boolean {
  return DateTime.utc().toUnixInteger() > timestamp + SYNC_STALE_THRESHOLD;
}

async function reserveSyncing(): Promise<void> {
  isSyncing = true;
  await produceMessage({
    type: ServiceWorkerMessageType.Syncing,
  });
}

async function releaseSyncing(): Promise<void> {
  isSyncing = false;
  await produceMessage({
    type: ServiceWorkerMessageType.SyncingOver,
  });
}

export async function sync(): Promise<void> {
  if (isSyncing) {
    return;
  }

  await reserveSyncing();
  try {
    await pushChanges();
    await pullChanges();
    console.log('Sync success');
  } catch (err) {
    console.error('Sync failure');
  } finally {
    await releaseSyncing();
  }
}

async function pushChanges(): Promise<void> {
  const { clientId } = await cache.getState();
  let changes: Array<ApplyChangeInput & { id: number }>;
  let nChanges = 0;
  do {
    changes = await cache.getChanges(PUSH_CHANGES_BATCH);
    nChanges += changes.length;
    if (changes.length) {
      await reserveSyncing();
      await pushApplyChanges(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        changes.map(({ id, ...change }) => change),
        clientId,
      );
      await cache.deleteChanges(changes.map((change) => change.id));
    }
  } while (changes.length);
  console.log(`Pushed changes: ${nChanges}`);
}

async function pullChanges(): Promise<void> {
  const state = await cache.getState();
  const syncStatus = await getSyncStatus(state);
  const { clientId, lastSyncedAt } = state;
  let { currentSyncCursor, currentSyncStartedAt } = state;
  let syncType = lastSyncedAt ? SyncType.Delta : SyncType.Full;

  if (!currentSyncCursor) {
    currentSyncStartedAt = DateTime.utc().toUnixInteger();
    await cache.updateState({ currentSyncStartedAt });
  }

  let nChanges = 0;
  do {
    await reserveSyncing();
    const changesPage = await fetchChangesPage(
      syncType,
      currentSyncCursor,
      currentSyncCursor ? null : lastSyncedAt,
      clientId,
    );
    const { items, nextCursor } = changesPage.changes;
    syncType = changesPage.changes.syncType;

    if (syncType === SyncType.Full && syncStatus === SyncStatus.Synced) {
      break;
    }

    const isSyncStart = !currentSyncCursor;
    await applyChanges(items, syncType, isSyncStart);
    nChanges += items.length;

    currentSyncCursor = nextCursor ?? null;
    await cache.updateState({ currentSyncCursor });
  } while (currentSyncCursor);

  await cache.updateState({
    lastSyncedAt: currentSyncStartedAt,
    currentSyncStartedAt: null,
  });

  console.log(`Pulled changes: ${nChanges} (${syncType} sync)`);
}

async function applyChanges(
  changes: ChangeFieldsFragment[],
  syncType: SyncType,
  isSyncStart: boolean,
): Promise<void> {
  if (!changes.length) {
    return;
  }

  await cache.transactionally(async () => {
    if (syncType === SyncType.Full && isSyncStart) {
      // TODO improve logic
      await cache.deleteLanguages();
      await cache.deleteProperties();
      await cache.deleteWords();
    }

    for (const change of changes) {
      switch (change.type) {
        case ChangeType.CreateLanguage:
          await cache.saveLanguage(
            (change as CreateLanguageChangeFieldsFragment).createdLanguage,
          );
          break;
        case ChangeType.UpdateLanguage:
          await cache.updateLanguage(
            (change as UpdateLanguageChangeFieldsFragment).updatedLanguage,
          );
          break;
        case ChangeType.DeleteLanguage:
          await cache.deleteLanguage(
            (change as DeleteLanguageChangeFieldsFragment).deletedLanguage,
          );
          break;
        case ChangeType.CreateProperty:
          await cache.saveProperty(
            (change as CreatePropertyChangeFieldsFragment).createdProperty,
          );
          break;
        case ChangeType.UpdateProperty:
          await cache.updateProperty(
            (change as UpdatePropertyChangeFieldsFragment).updatedProperty,
          );
          break;
        case ChangeType.ReorderProperties:
          await cache.reorderProperties(
            (change as ReorderPropertiesChangeFieldsFragment)
              .reorderedProperties.propertyIds,
          );
          break;
        case ChangeType.DeleteProperty:
          await cache.deleteProperty(
            (change as DeletePropertyChangeFieldsFragment).deletedProperty,
          );
          break;
        case ChangeType.CreateWord: {
          await cache.saveWord(
            (change as CreateWordChangeFieldsFragment).createdWord,
          );
          break;
        }
        case ChangeType.UpdateWord:
          await cache.updateWord(
            (change as UpdateWordChangeFieldsFragment).updatedWord,
          );
          break;
        case ChangeType.DeleteWord:
          await cache.deleteWord(
            (change as DeleteWordChangeFieldsFragment).deletedWord,
          );
          break;
      }
    }
  });
}

async function fetchChangesPage(
  syncType: SyncType,
  cursor: string | null,
  changedAt: number | null,
  clientId: string,
): Promise<GetChangesQuery> {
  return await gqlClient.request({
    document: GetChangesDocument,
    variables: {
      syncType,
      cursor,
      changedAt: changedAt
        ? DateTime.fromSeconds(changedAt, { zone: 'UTC' }).toFormat(
            DATETIME_FORMAT,
          )
        : null,
    },
    requestHeaders: {
      [SYNC_CLIENT_ID_HEADER]: clientId,
    },
  });
}

async function pushApplyChanges(
  changes: ApplyChangeInput[],
  clientId: string,
): Promise<void> {
  await gqlClient.request({
    document: ApplyChangesDocument,
    variables: {
      changes,
    },
    requestHeaders: {
      [SYNC_CLIENT_ID_HEADER]: clientId,
    },
  });
}
