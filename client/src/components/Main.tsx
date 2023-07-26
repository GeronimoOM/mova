import { Routes, Route } from '@solidjs/router'
import { FaSolidEarthEurope } from 'solid-icons/fa';
import { AppRoute } from '../routes'
import { Component, Show, lazy } from 'solid-js'
import { useLanguageContext } from './LanguageContext'
import { Icon } from './utils/Icon'
import { WordsPage } from './WordsPage/WordsPage';
import { PropertiesPage } from './PropertiesPage/PropertiesPage';
import { ExercisesPage } from './ExercisesPage/ExercisesPage';

export const Main: Component = () => {
  const [selectedLanguage] = useLanguageContext();

  return (
    <main class="w-full max-w-[72rem] pb-12 md:pb-0 overflow-hidden bg-alabaster">
      <Show when={selectedLanguage()} fallback={<NoLanguagePage />}>
        <Routes>
          <Route path={AppRoute.Words} component={WordsPage} />
          <Route path={AppRoute.Properties} component={PropertiesPage} />
          <Route path={AppRoute.Exercises} component={ExercisesPage} />
        </Routes>
      </Show>
    </main>
  )
}

const NoLanguagePage: Component = () => {
  return (
    <div class='w-full h-full flex flex-col items-center justify-center text-spacecadet-300'>
      <Icon icon={FaSolidEarthEurope} />
      <p class='text-lg'>Select or Create Language</p>
    </div>
  );
}
