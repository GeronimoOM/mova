import React from 'react';
import { BsTranslate } from 'react-icons/bs';
import { FaBrain, FaEarthEurope } from 'react-icons/fa6';
import { IoStatsChart } from 'react-icons/io5';
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
      <NavBarItem href={AppRoute.Words} icon={BsTranslate} text="Words" />
      <NavBarItem
        href={AppRoute.Properties}
        icon={PiGraphBold}
        text="Properties"
      />
      <NavBarItem href={AppRoute.Exercises} icon={FaBrain} text="Exercises" />
      <NavBarItem
        href={AppRoute.Statistics}
        icon={IoStatsChart}
        text="Statistics"
      />
      <NavBarItem
        href={AppRoute.Languages}
        icon={FaEarthEurope}
        text="Language"
      />
    </nav>
  );
};
