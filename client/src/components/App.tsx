import { Component, Show, createEffect } from 'solid-js';
import { Main } from './Main';
import { NavBar } from './NavBar/NavBar';
import { useAuthContext } from './AuthContext';
import { LoginForm } from './LoginForm';
import { initServiceWorker } from '../sw/client/register';

const App: Component = () => {
  const [token] = useAuthContext();

  createEffect(() => {
    if (token()) {
      initServiceWorker(token()!);
    }
  });

  return (
    <Show when={token()} fallback={<LoginForm />}>
      <div class="flex h-full w-full flex-row justify-center">
        <NavBar />
        <Main />
      </div>
    </Show>
  );
};

export default App;
