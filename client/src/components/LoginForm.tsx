import { useMutation } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';

import { LoginDocument } from '../api/types/graphql';
import { useAuthContext } from './AuthContext';

import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../routes';
import * as styles from './LoginForm.css';
import { ButtonIcon } from './common/ButtonIcon';
import { Input } from './common/Input';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [loginMutation, { data: loginResult, loading }] =
    useMutation(LoginDocument);

  const { setAuthToken } = useAuthContext();
  const { t } = useTranslation();

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
    if (loginResult?.login) {
      setAuthToken(loginResult.login);
      navigate(AppRoute.Languages);
    } else {
      setName('');
      setPassword('');
    }
  }, [loginResult, setAuthToken, navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <div className={styles.label}>{t('login.user')}</div>
        <div>
          <Input value={name} onChange={setName} />
        </div>

        <div className={styles.label}>{t('login.password')}</div>
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
