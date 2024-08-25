import React from 'react';
import { BsFillBarChartFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { FaBook, FaBrain, FaEarthEurope } from 'react-icons/fa6';

import { PiGraphBold } from 'react-icons/pi';
import { AppRoute } from '../../routes';
import * as styles from './NavBar.css';
import { NavBarItem } from './NavBarItem';

export const NavBar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.title}>
        <p>Mova</p>
      </div>
      <NavBarItem href={AppRoute.Words} icon={FaBook} text="Words" />
      <NavBarItem href={AppRoute.Exercises} icon={FaBrain} text="Exercises" />
      <NavBarItem
        href={AppRoute.Progress}
        icon={BsFillBarChartFill}
        text="Progress"
      />
      <NavBarItem
        href={AppRoute.Properties}
        icon={PiGraphBold}
        text="Properties"
      />
      <NavBarItem
        href={AppRoute.Languages}
        icon={FaEarthEurope}
        text="Language"
      />

      <NavBarItem href={'/login'} icon={FaUser} text="Log out" />
    </nav>
  );
};
