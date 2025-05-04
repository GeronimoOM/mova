import { useEffect, useState } from 'react';
import {
  initServiceWorker,
  isServiceWorkerRegistered,
  registerSwMessageHandler,
} from '../sw/client/register';
import { SwWorkerMessageType } from '../sw/worker/messages';
import * as styles from './AppContent.css';
import { Loader } from './common/Loader';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

const LOADING_TIMEOUT = 5000;

type AppContentProps = {
  authToken: string;
};

export const AppContent = ({ authToken }: AppContentProps) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isLoadingTimeout: NodeJS.Timeout | undefined;
    let unregisterMessageHandler: (() => void) | undefined;

    const initSw = async () => {
      const isRegistered = await isServiceWorkerRegistered();
      if (!isRegistered) {
        setLoading(false);
        return;
      }

      isLoadingTimeout = setTimeout(() => setLoading(false), LOADING_TIMEOUT);
      unregisterMessageHandler = registerSwMessageHandler((event) => {
        if (event.type === SwWorkerMessageType.SyncOver) {
          setLoading(false);
          clearTimeout(isLoadingTimeout);
        }
      });

      initServiceWorker(authToken);
    };

    setLoading(true);
    initSw();

    return () => {
      unregisterMessageHandler?.();
      clearTimeout(isLoadingTimeout);
    };
  }, [authToken]);

  return (
    <div className={styles.content}>
      <NavBar />
      {isLoading ? <AppLoader /> : <Main />}
    </div>
  );
};

const AppLoader = () => {
  return (
    <div className={styles.loader}>
      <Loader />
    </div>
  );
};
