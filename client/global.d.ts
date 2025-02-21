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

interface ImportMetaEnv {
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
