export enum SyncStatus {
  Desynced = 'Desynced',
  Synced = 'Synced',
  Syncing = 'Syncing',
}

// TODO: Implement sync status
export async function getSyncStatus(): Promise<SyncStatus> {
  return SyncStatus.Synced;
}
