//const SYNC_INTERVAL_S = 60;

export type SwState = {
  id: 1;
  clientId: string;
  syncTimestamp?: string;
  syncCursor?: string;
};

export enum SyncStatus {
  Desynced = 'Desynced',
  Synced = 'Synced',
  Syncing = 'Syncing',
}

// TODO: Implement sync status
export async function getSyncStatus(): Promise<SyncStatus> {
  return SyncStatus.Desynced;
}
