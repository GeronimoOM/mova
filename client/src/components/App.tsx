import React from 'react';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

import { useAuthContext } from '../components/AuthContext';
import * as styles from './App.css';
import { LoginForm } from './LoginForm';

export const App: React.FC = () => {
  const { authToken } = useAuthContext();

  return authToken ? (
    <div className={styles.app}>
      <NavBar />
      <Main />
    </div>
  ) : (
    <LoginForm />
  );
};
