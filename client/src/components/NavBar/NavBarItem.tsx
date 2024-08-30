import classNames from 'classnames';
import React from 'react';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import { AppRoute } from '../../routes';
import { useLanguageContext } from '../LanguageContext';
import { Icon } from '../common/Icon';
import * as styles from './NavBarItem.css';

type NavBarItemProps = {
  href: string;
  icon: IconType;
  text: string;
};

export const NavBarItem: React.FC<NavBarItemProps> = ({ href, icon, text }) => {
  const [selectedLanguageId] = useLanguageContext();
  const disabled = !selectedLanguageId && href !== AppRoute.Languages;

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
