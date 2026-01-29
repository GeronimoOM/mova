import { EE, FlagComponent, GB, UA } from 'country-flag-icons/react/1x1';
import { MdLogout } from 'react-icons/md';

import classNames from 'classnames';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Font } from '../../utils/fonts';
import { Locale } from '../../utils/translator';
import { ButtonIcon } from '../common/ButtonIcon';
import { useUserContext } from '../UserContext';
import * as styles from './UserPage.css';

const translationLanguageToFlag: Record<Locale, FlagComponent> = {
  en: GB,
  uk: UA,
  et: EE,
};

export const UserPage = () => {
  const { t } = useTranslation();
  const { settings, setSettings, logout } = useUserContext();

  const locale = settings.selectedLocale as Locale;
  const font = settings.selectedFont as Font;

  const setLocale = useCallback(
    (locale: Locale) => setSettings({ selectedLocale: locale }),
    [setSettings],
  );
  const setFont = useCallback(
    (font: Font) => setSettings({ selectedFont: font }),
    [setSettings],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.card}>
          <FlagButton language="en" selected={locale} onSelect={setLocale} />

          <FlagButton language="uk" selected={locale} onSelect={setLocale} />

          <FlagButton language="et" selected={locale} onSelect={setLocale} />
        </div>

        <div className={styles.card}>
          <FontButton font="default" selected={font} onSelect={setFont} />

          <FontButton font="classic" selected={font} onSelect={setFont} />
        </div>

        <div className={styles.card}>
          <ButtonIcon
            icon={MdLogout}
            onClick={logout}
            color="negative"
            dataTestId="user-logout-btn"
          />
          {t('users.logout')}
        </div>
      </div>
    </div>
  );
};

type FlagButtonProps = {
  language: Locale;
  selected: Locale;
  onSelect: (language: Locale) => void;
};

const FlagButton = ({ language, selected, onSelect }: FlagButtonProps) => {
  const Flag = translationLanguageToFlag[language];

  return (
    <div
      className={classNames(styles.flag, { selected: language === selected })}
      onClick={() => onSelect(language)}
    >
      <Flag />
    </div>
  );
};

type FontButtonProps = {
  font: Font;
  selected: Font;
  onSelect: (font: Font) => void;
};

const FontButton = ({ font, selected, onSelect }: FontButtonProps) => {
  return (
    <div
      className={classNames(styles.font, {
        selected: font === selected,
      })}
      onClick={() => onSelect(font)}
    >
      <div className={styles.fontBase({ font })}>AaБб</div>
      <div className={styles.fontMono({ font })}>AaBb</div>
    </div>
  );
};
