import { IconType } from 'react-icons';
import { AccentColor } from '../../index.css';
import { OptionColor } from '../../utils/options';
import * as styles from './Icon.css';

export type IconProps = {
  icon: IconType;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  color?: AccentColor | OptionColor;
};

export const Icon = ({ icon: IconComponent, size, color }: IconProps) => {
  return <IconComponent className={styles.icon({ size, color })} />;
};
