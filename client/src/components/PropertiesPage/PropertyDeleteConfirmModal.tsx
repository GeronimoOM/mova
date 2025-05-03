import { FaFire } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { Modal } from '../common/Modal';

import { useTranslation } from 'react-i18next';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './PropertyDeleteConfirmModal.css';
import { Property } from './useProperty';

export type PropertyDeleteConfirmModalProps = {
  property: Property;
  propertyUsage: number | undefined;
  propertyDeleting: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export const PropertyDeleteConfirmModal = ({
  property,
  propertyUsage,
  propertyDeleting,
  onDelete,
  onClose,
}: PropertyDeleteConfirmModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.title}>
          {t('properties.delete')}
          <div className={styles.property}>{property.name}</div>
        </div>

        {propertyUsage !== undefined && (
          <div className={styles.usage}>
            {t('properties.usage')}
            <div className={styles.usageNumber}>{propertyUsage}</div>
          </div>
        )}

        <div className={styles.buttons}>
          <ButtonIcon
            icon={FaFire}
            onClick={onDelete}
            color="negative"
            loading={propertyDeleting}
            dataTestId="properties-list-item-delete-confirm-btn"
          />

          <ButtonIcon
            icon={HiMiniXMark}
            onClick={onClose}
            dataTestId="properties-list-item-delete-cancel-btn"
          />
        </div>
      </div>
    </Modal>
  );
};
