import React, { useEffect } from 'react';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

import { useAuthContext } from '../components/AuthContext';
import * as styles from './App.css';
import { useLanguageContext } from './LanguageContext';
import { LoginForm } from './LoginForm';

export const App: React.FC = () => {
  const { authToken } = useAuthContext();
  const [, setLanguage] = useLanguageContext();

  useEffect(() => {
    if (!authToken) {
      setLanguage(null);
    }
  }, [authToken, setLanguage]);

  return authToken ? (
    <div className={styles.app}>
      <NavBar />
      <Main />
    </div>
  ) : (
    <LoginForm />
  );
};
