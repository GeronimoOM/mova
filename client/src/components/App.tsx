import React from 'react';

import './App.css';
import Menu from './Menu';
import AppSwitch from './AppSwitch';
import { useLangSelector } from '../store';

const App = () => {
  const selectedLang = useLangSelector();

  return (
    <div>
      <Menu />
      {selectedLang && (
        <main>
          <AppSwitch />
        </main>
      )}
    </div>
  );
};

export default App;
