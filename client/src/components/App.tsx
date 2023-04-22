import { Component } from 'solid-js';
import { Route, Routes } from '@solidjs/router';
import NavBar from './NavBar/NavBar';
import WordsPage from './WordsPage/WordsPage';
import PropertiesPage from './PropertiesPage/PropertiesPage';
import { AppRoute } from '../routes';
import { LanguageProvider } from '../store/LanguageContext';

const App: Component = () => {
  return (
    <LanguageProvider>
      <div class="flex flex-row w-full justify-center bg-yellow-500">
        <div class="min-w-60 w-60 shrink-0 grow-0 bg-cyan-500">
          <NavBar />
        </div>
        <main class="w-[900px] bg-purple-400">
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
