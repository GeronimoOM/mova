import { EE, FlagComponent, GB, UA } from 'country-flag-icons/react/1x1';
import React from 'react';
import { MdLogout } from 'react-icons/md';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../../routes';
import { useAuthContext } from '../AuthContext';
import { Locale, useLocaleContext } from '../LocaleContext';
import { Font, useStyleContext } from '../StyleContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './UserPage.css';

const translationLanguageToFlag: Record<Locale, FlagComponent> = {
  en: GB,
  uk: UA,
  et: EE,
};

export const UserPage: React.FC = () => {
  const { t } = useTranslation();
  const [locale, setLocale] = useLocaleContext();
  const [font, setFont] = useStyleContext();
  const navigate = useNavigate();
  const { clearAuthToken } = useAuthContext();

  const logout = () => {
    clearAuthToken();
    navigate(AppRoute.Words);
  };

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
          <ButtonIcon icon={MdLogout} onClick={logout} color="negative" />
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

const FlagButton: React.FC<FlagButtonProps> = ({
  language,
  selected,
  onSelect,
}) => {
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

const FontButton: React.FC<FontButtonProps> = ({
  font,
  selected,
  onSelect,
}) => {
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

//AaБб
