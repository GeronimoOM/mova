import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { useUserContext } from '../context/UserContext';
import { ButtonIcon } from './common/ButtonIcon';
import { Input } from './common/Input';
import * as styles from './LoginForm.css';

export const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const { isLoginLoading, isLoginError, login } = useUserContext();
  const { t } = useTranslation();

  const handleLogin = async () => {
    const authToken = await login(name, password);
    if (!authToken) {
      setName('');
      setPassword('');
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.label}>{t('login.user')}</div>
      <div className={error ? styles.error : ''}>
        <Input value={name} onChange={setName} dataTestId="login-user" />
      </div>

      <div className={styles.label}>{t('login.password')}</div>
      <div className={error ? styles.error : ''}>
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          dataTestId="login-password"
        />
      </div>

      <div className={styles.button}>
        <ButtonIcon
          icon={FaCheck}
          onClick={handleLogin}
          color={isLoginError ? 'negative' : 'primary'}
          highlighted={true}
          loading={isLoginLoading}
          dataTestId="login-submit-btn"
        />
      </div>
    </div>
  );
};
