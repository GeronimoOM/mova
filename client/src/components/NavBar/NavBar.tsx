import React from 'react';
import { BsFillBarChartFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { FaBook, FaBrain, FaEarthEurope } from 'react-icons/fa6';

import { useTranslation } from 'react-i18next';
import { PiGraphBold } from 'react-icons/pi';
import { AppRoute } from '../../routes';
import * as styles from './NavBar.css';
import { NavBarItem } from './NavBarItem';

export const NavBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <div className={styles.title}>
        <p>Mova</p>
      </div>
      <NavBarItem href={AppRoute.Words} icon={FaBook} text={t('nav.words')} />
      <NavBarItem
        href={AppRoute.Exercises}
        icon={FaBrain}
        text={t('nav.exercises')}
      />
      <NavBarItem
        href={AppRoute.Progress}
        icon={BsFillBarChartFill}
        text={t('nav.progress')}
      />
      <NavBarItem
        href={AppRoute.Properties}
        icon={PiGraphBold}
        text={t('nav.properties')}
      />
      <NavBarItem
        href={AppRoute.Languages}
        icon={FaEarthEurope}
        text={t('nav.language')}
      />

      <NavBarItem href={AppRoute.User} icon={FaUser} text={t('nav.user')} />
    </nav>
  );
};
