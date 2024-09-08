import React from 'react';
import { MdLogout } from 'react-icons/md';

import { useAuthContext } from '../AuthContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './UserPage.css';

export const UserPage: React.FC = () => {
  const { clearAuthToken } = useAuthContext();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.card}>
          <ButtonIcon
            icon={MdLogout}
            onClick={clearAuthToken}
            color="negative"
          />
          Log out
        </div>
      </div>
    </div>
  );
};
