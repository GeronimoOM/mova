import { IconType } from 'react-icons';
import * as styles from './Icon.css';

export type IconProps = {
  icon: IconType;
  size?: 'tiny' | 'small' | 'medium' | 'large';
};

export const Icon = ({ icon: IconComponent, size }: IconProps) => {
  return <IconComponent className={styles.icon({ size })} />;
};
