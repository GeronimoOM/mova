import { Component } from 'solid-js';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';

const App: Component = () => {
  return (
    <div class="flex h-full w-full flex-row justify-center">
      <NavBar />
      <Main />
    </div>
  );
};

export default App;
