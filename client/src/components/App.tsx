import { Component } from 'solid-js';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

window.addEventListener('offline', () => {
  console.log('offline');
});

window.addEventListener('online', () => {
  console.log('online');
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
