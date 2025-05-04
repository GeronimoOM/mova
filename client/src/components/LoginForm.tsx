import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { ButtonIcon } from './common/ButtonIcon';
import { Input } from './common/Input';
import * as styles from './LoginForm.css';
import { useUserContext } from './UserContext';

export const LoginForm = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const { isLoginLoading, isLoginError, login } = useUserContext();
  const { t } = useTranslation();

  const handleLogin = async () => {
    const authToken = await login(name, password);
    if (!authToken) {
      setName('');
      setPassword('');
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.label}>{t('login.user')}</div>
      <div>
        <Input value={name} onChange={setName} dataTestId="login-user" />
      </div>

      <div className={styles.label}>{t('login.password')}</div>
      <div>
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
