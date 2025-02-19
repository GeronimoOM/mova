import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { HiMiniXMark } from 'react-icons/hi2';
import { IoReorderThree } from 'react-icons/io5';
import { PartOfSpeech, PropertyFieldsFragment } from '../../api/types/graphql';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import * as styles from './PropertyListItem.css';
import { typeToIcon, typeToLabel } from './properties';
import {
  usePropertyDrag,
  usePropertyDragLayer,
  usePropertyDrop,
} from './reorderProperties';
import { useProperty } from './useProperty';

export type PropertyListItemProps = {
  partOfSpeech: PartOfSpeech;
  property: PropertyFieldsFragment | null;
  selected: boolean;
  onSelect: () => void;
  onPropertyCreated?: () => void;
  onSwapPreview: (property1Id: string, property2Id: string) => void;
  onReorder: () => void;
};

export const PropertyListItem = ({
  partOfSpeech,
  property: currentProperty,
  selected,
  onSelect,
  onPropertyCreated,
  onSwapPreview,
  onReorder,
}: PropertyListItemProps) => {
  const {
    isNewProperty,
    property,
    setName,

    canCreateProperty,
    createProperty,
    propertyCreating,
    createdProperty,

    canUpdateProperty,
    updateProperty,
    propertyUpdating,

    canDeleteProperty,
    deleteProperty,
    propertyDeleting,
  } = useProperty(partOfSpeech, currentProperty);

  const { t } = useTranslation();

  const canDragProperty = !isNewProperty;

  const [{ canDrop }, dropRef] = usePropertyDrop(
    property.id ?? null,
    onSwapPreview,
    onReorder,
  );

  const ref = useRef<HTMLDivElement | null>(null);
  dropRef(ref);

  const [{ isDragging }, dragRef, dragPreviewRef] = usePropertyDrag(
    property?.id ? property : null,
    ref.current ?? null,
  );

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  useEffect(() => {
    if (createdProperty) {
      onPropertyCreated?.();
    }
  }, [createdProperty, onPropertyCreated]);

  return (
    <div
      className={classNames(styles.item, {
        selected,
        droppable: canDrop,
        dragging: isDragging,
      })}
      onClick={onSelect}
      ref={ref}
    >
      <div className={styles.header}>
        <div className={styles.typeIcon}>
          {property.type && (
            <>
              <Icon icon={typeToIcon[property.type]} size="medium" />
              <span className={styles.typeLabel}>
                {property.type ? t(typeToLabel[property.type]) : ''}
              </span>
            </>
          )}
        </div>
        <div className={classNames(styles.button, { hidden: !selected })}>
          <ButtonIcon
            icon={FaFeatherPointed}
            onClick={isNewProperty ? createProperty : updateProperty}
            color="primary"
            highlighted={true}
            disabled={!canCreateProperty && !canUpdateProperty}
            loading={isNewProperty ? propertyCreating : propertyUpdating}
          />
        </div>
        <div
          ref={dragRef}
          className={classNames(styles.button, { hidden: !selected })}
        >
          <ButtonIcon icon={IoReorderThree} disabled={!canDragProperty} />
        </div>
      </div>

      <div className={styles.content}>
        <Input
          value={property.name ?? ''}
          onChange={setName}
          text={'translation'}
          size={'large'}
          placeholder={t('properties.name')}
        />
        <div className={classNames(styles.button, { hidden: !selected })}>
          <ButtonIcon
            icon={FaFire}
            onClick={() => setDeleteConfirmOpen(true)}
            color="negative"
            disabled={!canDeleteProperty}
          />
        </div>
      </div>
      {isDeleteConfirmOpen && (
        <Modal onClose={() => setDeleteConfirmOpen(false)}>
          <div className={styles.deleteConfirm}>
            <div className={styles.deleteConfirmText}>
              {t('properties.delete')}
              <div className={styles.deleteConfirmProperty}>
                {property.name}
              </div>
            </div>

            <div className={styles.deleteConfirmButtons}>
              <ButtonIcon
                icon={FaFire}
                onClick={deleteProperty}
                color="negative"
                loading={propertyDeleting}
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

export const PropertyListItemOverlay = () => {
  const { isDragging, property, position } = usePropertyDragLayer();

  if (!isDragging || !position) {
    return null;
  }

  return (
    <div
      className={classNames(styles.overlay, { selected: true })}
      style={{ width: position.width, left: position.x, top: position.y }}
    >
      <div className={styles.header}>
        <div className={styles.typeIcon}>
          {property?.type && (
            <>
              <Icon icon={typeToIcon[property.type]} size="medium" />
              <span className={styles.typeLabel}>{property?.type}</span>
            </>
          )}
        </div>
        <ButtonIcon icon={FaFeatherPointed} disabled={true} />
        <ButtonIcon icon={IoReorderThree} />
      </div>

      <div className={styles.content}>
        <Input
          value={property?.name ?? ''}
          text={'translation'}
          size={'large'}
        />
        <ButtonIcon icon={FaFire} disabled={true} />
      </div>
    </div>
  );
};
