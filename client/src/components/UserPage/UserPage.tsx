import { EE, FlagComponent, GB, UA } from 'country-flag-icons/react/1x1';
import React from 'react';
import { MdLogout } from 'react-icons/md';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  TranslatorLanguage,
  useChangeTranslationLanguage,
  useTranslationLanguage,
} from '../../utils/translator';
import { useAuthContext } from '../AuthContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './UserPage.css';

const translationLanguageToFlag: Record<TranslatorLanguage, FlagComponent> = {
  en: GB,
  uk: UA,
  et: EE,
};

export const UserPage: React.FC = () => {
  const { t } = useTranslation();
  const translationLanguage = useTranslationLanguage();
  const setTranslationLanguage = useChangeTranslationLanguage();
  const { clearAuthToken } = useAuthContext();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.card}>
          <FlagButton
            language="en"
            selected={translationLanguage}
            onSelect={setTranslationLanguage}
          />

          <FlagButton
            language="uk"
            selected={translationLanguage}
            onSelect={setTranslationLanguage}
          />

          <FlagButton
            language="et"
            selected={translationLanguage}
            onSelect={setTranslationLanguage}
          />
        </div>

        <div className={styles.card}>
          <ButtonIcon
            icon={MdLogout}
            onClick={clearAuthToken}
            color="negative"
          />
          {t('users.logout')}
        </div>
      </div>
    </div>
  );
};

type FlagButtonProps = {
  language: TranslatorLanguage;
  selected: TranslatorLanguage;
  onSelect: (language: TranslatorLanguage) => void;
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
