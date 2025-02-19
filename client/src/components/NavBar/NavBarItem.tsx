import classNames from 'classnames';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import { allowedNoLanguageRoutes, AppRoute } from '../../routes';
import { Icon } from '../common/Icon';
import { useLanguageContext } from '../LanguageContext';
import * as styles from './NavBarItem.css';

type NavBarItemProps = {
  href: string;
  icon: IconType;
  text: string;
};

export const NavBarItem = ({ href, icon, text }: NavBarItemProps) => {
  const [selectedLanguageId] = useLanguageContext();
  const disabled =
    !selectedLanguageId && !allowedNoLanguageRoutes.includes(href as AppRoute);

  return (
    <NavLink to={href} className={classNames(styles.link, { disabled })}>
      <div className={styles.item}>
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
        <div className={styles.label}>{text}</div>
      </div>
    </NavLink>
  );
};
