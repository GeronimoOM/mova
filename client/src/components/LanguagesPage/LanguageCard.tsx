import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';

import { LanguageFieldsFragment } from '../../api/types/graphql';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { ButtonIcon } from '../common/ButtonIcon';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import * as styles from './LanguageCard.css';
import { useLanguage } from './useLanguage';

export type LanguageCardProps = {
  language: LanguageFieldsFragment | null;
  selected: boolean;
  onSelect: (languageId: string) => void;
  onLanguageCreated: () => void;
};

export const LanguageCard = ({
  language: currentLanguage,
  selected,
  onSelect,
  onLanguageCreated,
}: LanguageCardProps) => {
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

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
          maxLength={20}
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
          onClick={() => setDeleteConfirmOpen(true)}
          color="negative"
          disabled={!canDeleteLanguage}
        />
      </div>

      {isDeleteConfirmOpen && (
        <Modal onClose={() => setDeleteConfirmOpen(false)}>
          <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmText}>
              {t('languages.delete')}
              <div className={styles.deleteConfirmLanguage}>
                {language.name}
              </div>
            </div>

            <div className={styles.deleteConfirmButtons}>
              <ButtonIcon
                icon={FaFire}
                onClick={deleteLanguage}
                color="negative"
                loading={languageDeleting}
              />

              <ButtonIcon
                icon={HiMiniXMark}
                onClick={() => setDeleteConfirmOpen(false)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
