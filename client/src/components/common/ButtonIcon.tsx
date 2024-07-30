import React from 'react';
import { IconType } from 'react-icons';
import { FaSyncAlt } from 'react-icons/fa';
import * as styles from './ButtonIcon.css';
import { Icon, IconProps } from './Icon';

export type ButtonIconProps = IconProps & {
  icon: IconType;
  onClick: () => void;
  type?: 'primary' | 'secondary' | 'default';
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  wrapped?: boolean;
};

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  onClick,
  type,
  disabled,
  loading,
  hidden,
  wrapped,
}) => {
  const button = (
    <div
      className={styles.button({ type, disabled, hidden, loading })}
      onClick={onClick}
    >
      <Icon icon={!loading ? icon : FaSyncAlt} />
    </div>
  );

  return wrapped ? <div className={styles.wrapper}>{button}</div> : button;
};
