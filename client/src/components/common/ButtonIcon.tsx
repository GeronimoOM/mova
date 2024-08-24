import classNames from 'classnames';
import React from 'react';
import { IconType } from 'react-icons';
import { FaSyncAlt } from 'react-icons/fa';
import { Color } from '../../index.css';
import * as styles from './ButtonIcon.css';
import { Icon, IconProps } from './Icon';

export type ButtonIconProps = IconProps & {
  icon?: IconType;
  onClick: () => void;
  type?: 'default' | Color;
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
  empty?: boolean;
  wrapped?: boolean;
};

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  icon,
  onClick,
  type,
  disabled,
  loading,
  hidden,
  empty,
  wrapped,
}) => {
  const button = (
    <div
      className={classNames(
        styles.button({ type, disabled, hidden, loading }),
        { empty },
      )}
      onClick={onClick}
    >
      <Icon icon={!loading ? icon : FaSyncAlt} />
    </div>
  );

  return wrapped ? <div className={styles.wrapper}>{button}</div> : button;
};
