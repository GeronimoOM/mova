import React, { useEffect } from 'react';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

import { useAuthContext } from '../components/AuthContext';
import { LoginForm } from './LoginForm';
import { initServiceWorker } from '../sw/client/register';
import * as styles from './App.css';

export const App: React.FC = () => {
  const [authToken] = useAuthContext();

  useEffect(() => {
    if (authToken) {
      initServiceWorker(authToken);
    }
  }, [authToken]);

  return authToken ? (
    <div className={styles.app}>
      <NavBar />
      <Main />
    </div>
  ) : (
    <LoginForm />
  );
};
