import { createMutation } from '@merged/solid-apollo';
import { Component, createEffect, createSignal } from 'solid-js';
import { LoginDocument } from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

export const LoginForm: Component = () => {
  const [name, setName] = createSignal('');
  const [password, setPassword] = createSignal('');

  const [loginMutation, loginResult] = createMutation(LoginDocument);

  const [, setToken] = useAuthContext();

  const login = () => {
    loginMutation({
      variables: {
        input: {
          name: name(),
          password: password(),
        },
      },
    });
  };

  createEffect(() => {
    if (loginResult()) {
      setToken(loginResult()?.token as string);
    }
  });

  return (
    <div class="mx-auto flex h-full max-w-[72rem] flex-col justify-center text-spacecadet-300">
      <div class="flex flex-row justify-center p-2">
        <input
          class="p-2"
          type="text"
          placeholder={'Name'}
          value={name()}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-row justify-center p-2">
        <input
          class="p-2"
          type="password"
          placeholder={'Password'}
          value={password()}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>

      <div class="flex flex-row justify-center p-2">
        <button
          class="rounded bg-spacecadet-300 p-2 text-white hover:bg-spacecadet-200"
          onClick={() => login()}
        >
          Login
        </button>
      </div>
    </div>
  );
};
