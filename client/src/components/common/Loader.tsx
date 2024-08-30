import { FaSyncAlt } from 'react-icons/fa';
import { ButtonIcon } from './ButtonIcon';

import * as styles from './Loader.css';

export const Loader: React.FC = () => {
  return (
    <div className={styles.centered}>
      <ButtonIcon
        icon={FaSyncAlt}
        color="primary"
        highlighted={true}
        onClick={() => {}}
        loading={true}
      />
    </div>
  );
};
