import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { IoReorderThree } from 'react-icons/io5';
import { PartOfSpeech, PropertyFieldsFragment } from '../../api/types/graphql';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
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

export const PropertyListItem: React.FC<PropertyListItemProps> = ({
  partOfSpeech,
  property: currentProperty,
  selected,
  onSelect,
  onPropertyCreated,
  onSwapPreview,
  onReorder,
}) => {
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
          <ButtonIcon
            icon={IoReorderThree}
            onClick={() => {}}
            disabled={!canDragProperty}
          />
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
            onClick={deleteProperty}
            color="negative"
            disabled={!canDeleteProperty}
            loading={propertyDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export const PropertyListItemOverlay: React.FC = () => {
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
        <ButtonIcon
          icon={FaFeatherPointed}
          onClick={() => {}}
          disabled={true}
        />
        <ButtonIcon icon={IoReorderThree} onClick={() => {}} />
      </div>

      <div className={styles.content}>
        <Input
          value={property?.name ?? ''}
          text={'translation'}
          size={'large'}
        />
        <ButtonIcon icon={FaFire} onClick={() => {}} disabled={true} />
      </div>
    </div>
  );
};
