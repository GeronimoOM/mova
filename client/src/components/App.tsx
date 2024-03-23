import { Component } from 'solid-js';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';
import { startPeriodicSync, stopPeriodicSync } from '../register-sw';

window.addEventListener('offline', () => {
  stopPeriodicSync();
});

window.addEventListener('online', () => {
  startPeriodicSync();
});

const App: Component = () => {
  return (
    <div class="flex h-full w-full flex-row justify-center">
      <NavBar />
      <Main />
    </div>
  );
};

export default App;
