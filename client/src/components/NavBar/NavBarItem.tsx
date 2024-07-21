import React from 'react';
import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import { Icon } from '../common/Icon';
import * as styles from './NavBarItem.css';

type NavBarItemProps = {
  href: string;
  icon: IconType;
  text: string;
};

export const NavBarItem: React.FC<NavBarItemProps> = ({ href, icon, text }) => {
  return (
    <NavLink to={href} className={styles.link}>
      <div className={styles.item}>
        <div className={styles.icon}>
          <Icon icon={icon} />
        </div>
        <div className={styles.label}>{text}</div>
      </div>
    </NavLink>
  );
};
