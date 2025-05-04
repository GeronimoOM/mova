import classNames from 'classnames';
import { classicFontTheme, defaultFontTheme, theme } from '../index.css';
import * as styles from './App.css';
import { AppContent } from './AppContent';
import { LoginForm } from './LoginForm';
import { useUserContext } from './UserContext';

export const App = () => {
  const { authToken, settings } = useUserContext();

  const fontTheme =
    settings.selectedFont === 'default' ? defaultFontTheme : classicFontTheme;

  return (
    <div className={classNames(styles.app, theme, fontTheme)}>
      {authToken ? <AppContent authToken={authToken} /> : <LoginForm />}
    </div>
  );
};
