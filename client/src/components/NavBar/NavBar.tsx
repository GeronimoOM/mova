import { BsFillBarChartFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { FaBook, FaBrain, FaEarthEurope } from 'react-icons/fa6';

import { useTranslation } from 'react-i18next';
import { PiGraphBold } from 'react-icons/pi';
import { AppRoute } from '../../routes';
import * as styles from './NavBar.css';
import { NavBarItem } from './NavBarItem';

export const NavBar = () => {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav}>
      <div className={styles.title}>
        <p>Mova</p>
      </div>
      <NavBarItem
        route={AppRoute.Default}
        icon={FaBook}
        text={t('nav.words')}
        activeRoutes={[AppRoute.Default, AppRoute.Words, AppRoute.WordNew]}
      />
      <NavBarItem
        route={AppRoute.Exercises}
        icon={FaBrain}
        text={t('nav.exercises')}
      />
      <NavBarItem
        route={AppRoute.Progress}
        icon={BsFillBarChartFill}
        text={t('nav.progress')}
      />
      <NavBarItem
        route={AppRoute.Properties}
        icon={PiGraphBold}
        text={t('nav.properties')}
      />
      <NavBarItem
        route={AppRoute.Languages}
        icon={FaEarthEurope}
        text={t('nav.language')}
      />

      <NavBarItem route={AppRoute.User} icon={FaUser} text={t('nav.user')} />
    </nav>
  );
};
