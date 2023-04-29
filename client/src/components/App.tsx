import { Component } from 'solid-js';
import { Route, Routes } from '@solidjs/router';
import NavBar from './NavBar/NavBar';
import WordsPage from './WordsPage/WordsPage';
import PropertiesPage from './PropertiesPage/PropertiesPage';
import { AppRoute } from '../routes';
import { LanguageProvider } from './LanguageContext';

const App: Component = () => {
  return (
    <LanguageProvider>
      <div class="flex flex-row w-screen h-screen justify-center">
        <NavBar />
        <main class="min-w-[32rem] w-[72rem] p-2">
          <Routes>
            <Route path={AppRoute.Words} component={WordsPage} />
            <Route path={AppRoute.Properties} component={PropertiesPage} />
          </Routes>
        </main>
      </div>
    </LanguageProvider>
  );
};

export default App;
