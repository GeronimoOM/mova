import classNames from 'classnames';
import { IconType } from 'react-icons';
import { FaSyncAlt } from 'react-icons/fa';
import { AccentColor } from '../../index.css';
import { OptionColor } from '../../utils/options';
import * as styles from './ButtonIcon.css';
import { Icon, IconProps } from './Icon';

export type ButtonIconProps = IconProps & {
  icon?: IconType;
  onClick?: () => void;
  color?: AccentColor | OptionColor;
  size?: 'tiny' | 'small' | 'medium';
  highlighted?: boolean;
  highlightedAlt?: boolean;
  disabled?: boolean;
  loading?: boolean;
  toggled?: boolean;
  empty?: boolean;
  wrapped?: boolean;
  borderless?: boolean;
};

export const ButtonIcon = ({
  icon,
  onClick,
  color,
  highlighted,
  highlightedAlt,
  disabled,
  loading,
  toggled,
  empty,
  wrapped,
  size,
  borderless,
}: ButtonIconProps) => {
  const button = (
    <div
      className={classNames(styles.button({ color, disabled, loading }), {
        highlighted,
        highlightedAlt,
        toggled,
        empty,
        borderless,
      })}
      onClick={onClick}
    >
      <Icon icon={!loading ? icon : FaSyncAlt} size={size} />
    </div>
  );

  return wrapped ? <div className={styles.wrapper}>{button}</div> : button;
};
