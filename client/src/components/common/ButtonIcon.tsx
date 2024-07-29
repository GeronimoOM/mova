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
  hidden?: boolean;
  loading?: boolean;
};

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  onClick,
  type,
  disabled,
  hidden,
  loading,
}) => {
  return (
    <div
      className={styles.button({ type, disabled, hidden, loading })}
      onClick={onClick}
    >
      <Icon icon={!loading ? icon : FaSyncAlt} />
    </div>
  );
};
