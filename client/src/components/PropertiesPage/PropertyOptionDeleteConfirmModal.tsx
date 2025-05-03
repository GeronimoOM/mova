import { FaFeatherPointed } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { Modal } from '../common/Modal';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, OptionUsage } from '../../api/types/graphql';
import { ButtonIcon } from '../common/ButtonIcon';
import { OptionPill } from '../common/OptionPill';
import * as styles from './PropertyOptionDeleteConfirmModal.css';
import { Property } from './useProperty';

export type PropertyOptionDeleteConfirmModalProps = {
  property: Property;
  deletedOptions: Option[];
  propertyOptionsUsage: OptionUsage[] | undefined;
  propertyUpdating: boolean;
  onUpdate: () => void;
  onClose: () => void;
};

export const PropertyOptionDeleteConfirmModal = ({
  property,
  deletedOptions,
  propertyOptionsUsage,
  propertyUpdating,
  onUpdate,
  onClose,
}: PropertyOptionDeleteConfirmModalProps) => {
  const { t } = useTranslation();

  const deletedOptionsWithUsage = useMemo<Array<[Option, number]>>(() => {
    return deletedOptions.map((option) => {
      const usage =
        propertyOptionsUsage?.find(({ id }) => id === option.id)?.count ?? 0;

      return [option, usage];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyOptionsUsage]);

  return (
    <Modal onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.title}>
          {t('properties.deleteOptions')}
          <div className={styles.property}>{property.name}</div>
        </div>

        {propertyOptionsUsage !== undefined && (
          <div className={styles.usageTitle}>{t('properties.usage')}</div>
        )}

        <div className={styles.usageRows}>
          {deletedOptionsWithUsage.map(([option, usage]) => (
            <div key={option.id} className={styles.usageRow}>
              <OptionPill option={option} disabled />
              <div className={styles.usageNumber}>{usage}</div>
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <ButtonIcon
            icon={FaFeatherPointed}
            onClick={onUpdate}
            color="primary"
            loading={propertyUpdating}
            dataTestId="properties-list-item-delete-option-confirm-btn"
          />

          <ButtonIcon
            icon={HiMiniXMark}
            onClick={onClose}
            dataTestId="properties-list-item-delete-option-cancel-btn"
          />
        </div>
      </div>
    </Modal>
  );
};
