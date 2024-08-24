import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { IconType } from 'react-icons';
import { BsUiChecksGrid } from 'react-icons/bs';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';
import { IoReorderThree } from 'react-icons/io5';
import { PiChatCenteredTextFill } from 'react-icons/pi';
import {
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyType,
} from '../../api/types/graphql';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import * as styles from './PropertyListItem.css';
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

const typeToIcon: Record<PropertyType, IconType> = {
  [PropertyType.Text]: PiChatCenteredTextFill,
  [PropertyType.Option]: BsUiChecksGrid,
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
              <span className={styles.typeLabel}>{property?.type}</span>
            </>
          )}
        </div>
        <ButtonIcon
          icon={FaFeatherPointed}
          onClick={isNewProperty ? createProperty : updateProperty}
          type="primary"
          disabled={!canCreateProperty && !canUpdateProperty}
          loading={isNewProperty ? propertyCreating : propertyUpdating}
          hidden={!selected}
        />
        <ButtonIcon
          icon={FaFire}
          onClick={deleteProperty}
          type="negative"
          disabled={!canDeleteProperty}
          loading={propertyDeleting}
          hidden={!selected}
        />
      </div>

      <div className={styles.content}>
        <Input
          value={property.name ?? ''}
          onChange={setName}
          text={'translation'}
          size={'large'}
        />

        <div ref={dragRef}>
          <ButtonIcon
            icon={IoReorderThree}
            onClick={() => {}}
            disabled={!canDragProperty}
            hidden={!selected}
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
          type="primary"
          disabled={true}
        />
        <ButtonIcon
          icon={FaFire}
          onClick={() => {}}
          type="negative"
          disabled={true}
        />
      </div>

      <div className={styles.content}>
        <Input
          value={property?.name ?? ''}
          onChange={() => {}}
          text={'translation'}
          size={'large'}
        />
        <ButtonIcon icon={IoReorderThree} onClick={() => {}} />
      </div>
    </div>
  );
};
