import React, { useEffect } from 'react';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

import classNames from 'classnames';
import { useAuthContext } from '../components/AuthContext';
import { classicFontTheme, defaultFontTheme } from '../index.css';
import * as styles from './App.css';
import { useLanguageContext } from './LanguageContext';
import { LoginForm } from './LoginForm';
import { useStyleContext } from './StyleContext';

export const App: React.FC = () => {
  const { authToken } = useAuthContext();
  const [, setLanguage] = useLanguageContext();
  const [font] = useStyleContext();

  useEffect(() => {
    if (!authToken) {
      setLanguage(null);
    }
  }, [authToken, setLanguage]);

  return authToken ? (
    <div
      className={classNames(
        styles.app,
        font === 'default' ? defaultFontTheme : classicFontTheme,
      )}
    >
      <NavBar />
      <Main />
    </div>
  ) : (
    <LoginForm />
  );
};
