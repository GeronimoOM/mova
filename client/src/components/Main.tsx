import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from '../routes';
import { ExercisesPage } from './ExercisesPage/ExercisesPage';
import { LanguagesPage } from './LanguagesPage/LanguagesPage';
import * as styles from './Main.css';
import { ProgressPage } from './ProgressPage/ProgressPage';
import { PropertiesPage } from './PropertiesPage/PropertiesPage';
import { UserPage } from './UserPage/UserPage';
import { WordsPage } from './WordsPage/WordsPage';

export const Main: React.FC = () => {
  return (
    <main className={styles.main}>
      <Routes>
        <Route path={AppRoute.Words} Component={WordsPage} />
        <Route path={AppRoute.Properties} Component={PropertiesPage} />
        <Route path={AppRoute.Exercises} Component={ExercisesPage} />
        <Route path={AppRoute.Progress} Component={ProgressPage} />
        <Route path={AppRoute.Languages} Component={LanguagesPage} />
        <Route path={AppRoute.User} Component={UserPage} />
      </Routes>
    </main>
  );
};
