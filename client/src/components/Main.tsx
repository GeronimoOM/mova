import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRoute } from '../routes';
import { ExercisesPage } from './ExercisesPage/ExercisesPage';
import { useLanguageContext } from './LanguageContext';
import { LanguagesPage } from './LanguagesPage/LanguagesPage';
import * as styles from './Main.css';
import { NoLanguagePage } from './NoLanguagePage';
import { ProgressPage } from './ProgressPage/ProgressPage';
import { PropertiesPage } from './PropertiesPage/PropertiesPage';
import { WordsPage } from './WordsPage/WordsPage';

export const Main: React.FC = () => {
  const [selectedLanguage] = useLanguageContext();

  return (
    <main className={styles.main}>
      {selectedLanguage ? (
        <Routes>
          <Route path={AppRoute.Words} Component={WordsPage} />
          <Route path={AppRoute.Properties} Component={PropertiesPage} />
          <Route path={AppRoute.Exercises} Component={ExercisesPage} />
          <Route path={AppRoute.Progress} Component={ProgressPage} />
          <Route path={AppRoute.Languages} Component={LanguagesPage} />
        </Routes>
      ) : (
        <NoLanguagePage />
      )}
    </main>
  );
};
