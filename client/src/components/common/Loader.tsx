import { FaSyncAlt } from 'react-icons/fa';
import { ButtonIcon } from './ButtonIcon';

import * as styles from './Loader.css';

export const Loader = () => {
  return (
    <div className={styles.centered}>
      <ButtonIcon
        icon={FaSyncAlt}
        color="primary"
        highlighted={true}
        loading={true}
        size="large"
      />
    </div>
  );
};
