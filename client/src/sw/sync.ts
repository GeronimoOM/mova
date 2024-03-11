import { GraphQLClient } from 'graphql-request';
import {
  ChangeFieldsFragment,
  ChangeType,
  CreateLanguageChangeFieldsFragment,
  DeleteLanguageChangeFieldsFragment,
  GetChangesDocument,
  GetChangesQuery,
  SyncType,
  UpdateLanguageChangeFieldsFragment,
} from '../api/types/graphql';
import {
  deleteLanguage,
  deleteLanguages,
  deleteProperties,
  deleteWords,
  fetchState,
  saveLanguage,
  transactionally,
  updateLanguage,
  updateState,
} from './cache';
import { ServiceWorkerMessageType, produceMessage } from './messages';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from '../utils/constants';

const SYNC_STALE_THRESHOLD = 2 * 24 * 60 * 60; // 2 days

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
  const { lastSyncedAt } = state ?? (await fetchState());
  if (!lastSyncedAt) {
    return SyncStatus.Empty;
  } else if (isSyncStale(lastSyncedAt)) {
    return SyncStatus.Stale;
  } else {
    return SyncStatus.Synced;
  }
}

function isSyncStale(timestamp: number): boolean {
  return DateTime.utc().toSeconds() > timestamp + SYNC_STALE_THRESHOLD;
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

  try {
    await downloadChanges();
    console.log('sync succeeded');
  } catch (err) {
    console.error('sync failed', err);
  } finally {
    await releaseSyncing();
  }
}

// async function uploadChanges(): Promise<void> {}

async function downloadChanges(): Promise<void> {
  const state = await fetchState();
  const syncStatus = await getSyncStatus(state);
  const { clientId, lastSyncedAt } = state;
  let { currentSyncCursor, currentSyncStartedAt } = state;
  let syncType = lastSyncedAt ? SyncType.Delta : SyncType.Full;

  if (!currentSyncCursor) {
    currentSyncStartedAt = DateTime.utc().toSeconds();
    await updateState({ currentSyncStartedAt });
  }

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

    currentSyncCursor = nextCursor ?? null;
    await updateState({ currentSyncCursor });
  } while (currentSyncCursor);

  await updateState({
    lastSyncedAt: currentSyncStartedAt,
    currentSyncStartedAt: null,
  });
}

async function applyChanges(
  changes: ChangeFieldsFragment[],
  syncType: SyncType,
  isSyncStart: boolean,
): Promise<void> {
  if (!changes.length) {
    return;
  }

  console.log(syncType, changes.length);

  await transactionally(async () => {
    if (syncType === SyncType.Full && isSyncStart) {
      // TODO improve logic
      await deleteLanguages();
      await deleteProperties();
      await deleteWords();
    }

    for (const change of changes) {
      switch (change.type) {
        case ChangeType.CreateLanguage:
          await saveLanguage(
            (change as CreateLanguageChangeFieldsFragment).createdLanguage,
          );
          break;
        case ChangeType.UpdateLanguage:
          await updateLanguage(
            (change as UpdateLanguageChangeFieldsFragment).updatedLanguage,
          );
          break;
        case ChangeType.DeleteLanguage:
          await deleteLanguage(
            (change as DeleteLanguageChangeFieldsFragment).deletedLanguage,
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
      'Sync-Client-ID': clientId,
    },
  });
}
