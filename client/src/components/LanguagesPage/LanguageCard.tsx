import React, { useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';

import { LanguageFieldsFragment } from '../../api/types/graphql';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { ButtonIcon } from '../common/ButtonIcon';
import { Input } from '../common/Input';
import * as styles from './LanguageCard.css';
import { useLanguage } from './useLanguage';

export type LanguageCardProps = {
  language: LanguageFieldsFragment | null;
  selected: boolean;
  onSelect: (languageId: string) => void;
  onLanguageCreated: () => void;
};

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language: currentLanguage,
  selected,
  onSelect,
  onLanguageCreated,
}) => {
  const {
    isNewLanguage,
    language,
    setName,
    canCreateLanguage,
    createLanguage,
    languageCreating,
    canUpdateLanguage,
    updateLanguage,
    languageUpdating,
    canDeleteLanguage,
    deleteLanguage,
    languageDeleting,
    createdLanguage,
  } = useLanguage(currentLanguage);

  const { t } = useTranslation();

  useEffect(() => {
    if (createdLanguage) {
      onLanguageCreated?.();
    }
  }, [createdLanguage, onLanguageCreated]);

  return (
    <div className={classNames(styles.card, { selected })}>
      <div className={styles.main}>
        <Input
          value={language.name ?? ''}
          onChange={setName}
          size="large"
          placeholder={t('languages.name')}
        />
      </div>
      <div className={styles.buttons}>
        <ButtonIcon
          icon={FaCircle}
          empty={!selected}
          disabled={isNewLanguage}
          onClick={() => onSelect(language.id!)}
        />

        <ButtonIcon
          icon={FaFeatherPointed}
          onClick={isNewLanguage ? createLanguage : updateLanguage}
          color="primary"
          highlighted={true}
          disabled={!canCreateLanguage && !canUpdateLanguage}
          loading={isNewLanguage ? languageCreating : languageUpdating}
        />
        <ButtonIcon
          icon={FaFire}
          onClick={deleteLanguage}
          color="negative"
          disabled={!canDeleteLanguage}
          loading={languageDeleting}
        />
      </div>
    </div>
  );
};
