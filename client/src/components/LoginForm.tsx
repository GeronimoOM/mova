import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';

import { LoginDocument } from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

import { FaCheck } from 'react-icons/fa';
import * as styles from './LoginForm.css';
import { ButtonIcon } from './common/ButtonIcon';
import { Input } from './common/Input';

export const LoginForm: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation, { data: loginResult, loading }] =
    useMutation(LoginDocument);

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
    } else {
      setName('');
      setPassword('');
    }
  }, [loginResult, setToken]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.label}>name</div>
        <div>
          <Input value={name} onChange={setName} />
        </div>

        <div className={styles.label}>password</div>
        <div>
          <Input value={password} onChange={setPassword} type="password" />
        </div>

        <div className={styles.button}>
          <ButtonIcon
            icon={FaCheck}
            onClick={login}
            color="primary"
            highlighted={true}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
