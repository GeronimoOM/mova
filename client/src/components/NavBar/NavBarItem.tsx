import classNames from 'classnames';
import { useMemo } from 'react';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import { useLanguageContext } from '../../context/LanguageContext';
import { useRouterContext } from '../../context/RouterContext';
import { allowedNoLanguageRoutes, AppRoute } from '../../routes';
import { Icon } from '../common/Icon';
import * as styles from './NavBarItem.css';

type NavBarItemProps = {
  route: AppRoute;
  icon: IconType;
  text: string;
  activeRoutes?: AppRoute[];
};

export const NavBarItem = ({
  route,
  icon,
  text,
  activeRoutes,
}: NavBarItemProps) => {
  const [selectedLanguageId] = useLanguageContext();
  const { activeRoute } = useRouterContext();
  const active = useMemo(
    () => activeRoute && (activeRoutes ?? [route]).includes(activeRoute),
    [activeRoute, route],
  );

  const disabled =
    !selectedLanguageId && !allowedNoLanguageRoutes.includes(route as AppRoute);

  return (
    <NavLink
      to={route}
      className={classNames(styles.link, { active, disabled })}
    >
      <div
        className={styles.item}
        data-testid={`navbar-link-${text.toLowerCase()}`}
      >
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
        <div className={styles.label}>{text}</div>
      </div>
    </NavLink>
  );
};
