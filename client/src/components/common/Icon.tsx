import React from 'react';
import { IconType } from 'react-icons';
import * as styles from './Icon.css';

export type IconProps = {
  icon: IconType;
  size?: 'small' | 'medium';
};

export const Icon: React.FC<IconProps> = ({ icon: IconComponent, size }) => {
  return <IconComponent className={styles.icon({ size })} />;
};
