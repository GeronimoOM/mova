interface ServiceWorkerRegistration {
  periodicSync: PeriodicSyncManager;
}

interface PeriodicSyncManager {
  register(
    tag: string,
    options?: {
      minInterval: number;
    },
  ): Promise<undefined>;
}
