import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';

import { LoginDocument } from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

export const LoginForm: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation, { data: loginResult }] = useMutation(LoginDocument);

  const [, setToken] = useAuthContext();

  const login = useCallback(async () => {
    loginMutation({
      variables: {
        input: {
          name,
          password,
        },
      },
    });
  }, [name, password, loginMutation]);

  useEffect(() => {
    if (loginResult?.token) {
      setToken(loginResult.token);
    }
  });

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder={'Name'}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder={'Password'}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </div>

      <div>
        <button onClick={() => login()}>Login</button>
      </div>
    </div>
  );
};
