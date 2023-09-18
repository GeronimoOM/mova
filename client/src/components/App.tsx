import { Component } from 'solid-js';
import { LanguageProvider } from './LanguageContext';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

const App: Component = () => {
  return (
    <LanguageProvider>
      <div class="flex flex-row w-full h-full justify-center">
        <NavBar />
        <Main />
      </div>
    </LanguageProvider>
  );
};

export default App;
