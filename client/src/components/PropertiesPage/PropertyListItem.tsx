import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { FaFeatherPointed, FaFire } from 'react-icons/fa6';

import { IoReorderThree } from 'react-icons/io5';
import {
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyType,
} from '../../api/types/graphql';
import { ButtonIcon } from '../common/ButtonIcon';
import { Input } from '../common/Input';

import { waitAtLeast } from '../../utils/promises';
import { OptionPropertyDetails } from './OptionPropertyDetails';
import { PropertyDeleteConfirmModal } from './PropertyDeleteConfirmModal';
import * as styles from './PropertyListItem.css';
import { PropertyOptionDeleteConfirmModal } from './PropertyOptionDeleteConfirmModal';
import { PropertyTypeSelect } from './PropertyTypeSelect';
import {
  usePropertyDrag,
  usePropertyDragLayer,
  usePropertyDrop,
} from './reorderProperties';
import { useProperty } from './useProperty';

export type PropertyListItemProps = {
  partOfSpeech: PartOfSpeech;
  property: PropertyFieldsFragment | null;
  newPropertyId?: string;
  selected: boolean;
  onSelect: () => void;
  onPropertyCreated?: () => void;
  onSwapPreview: (property1Id: string, property2Id: string) => void;
  onReorder: () => void;
  onRef?: (ref: React.RefObject<HTMLDivElement | null>) => void;
};

export const PropertyListItem = ({
  partOfSpeech,
  property: currentProperty,
  newPropertyId,
  selected,
  onSelect,
  onPropertyCreated,
  onSwapPreview,
  onReorder,
  onRef,
}: PropertyListItemProps) => {
  const {
    isNewProperty,
    property,
    setName,
    setType,
    addOption,
    editOption,
    removeOption,
    restoreOption,

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

    fetchPropertyUsage,
    propertyUsage,

    deletedOptions,
    fetchPropertyOptionsUsage,
    propertyOptionsUsage,
  } = useProperty(partOfSpeech, currentProperty, newPropertyId);

  const { t } = useTranslation();

  const canDragProperty = !isNewProperty;

  const [{ canDrop }, dropRef] = usePropertyDrop(
    property.id ?? null,
    onSwapPreview,
    onReorder,
  );

  const ref = useRef<HTMLDivElement>(null);
  dropRef(ref);

  const [{ isDragging }, dragRef, dragPreviewRef] = usePropertyDrag(
    property?.id ? property : null,
    ref.current ?? null,
  );

  const [isOptionDeleteConfirmOpen, setOptionDeleteConfirmOpen] =
    useState(false);
  const [isLoadingUpdateConfirm, setIsLoadingUpdateConfirm] = useState(false);

  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoadingDeleteConfirm, setIsLoadingDeleteConfirm] = useState(false);

  useEffect(() => {
    dragPreviewRef(getEmptyImage(), { captureDraggingState: true });
  }, [dragPreviewRef]);

  useEffect(() => {
    if (createdProperty) {
      onPropertyCreated?.();
    }
  }, [createdProperty, onPropertyCreated]);

  const hasDeletedOptions = deletedOptions.length;
  const isUpdateLoading = hasDeletedOptions
    ? isLoadingUpdateConfirm
    : propertyUpdating;

  const handleUpdateProperty = useCallback(async () => {
    if (!hasDeletedOptions) {
      return updateProperty();
    }

    setIsLoadingUpdateConfirm(true);
    try {
      await waitAtLeast(fetchPropertyOptionsUsage(), 100);
    } finally {
      setIsLoadingUpdateConfirm(false);
      setOptionDeleteConfirmOpen(true);
    }
  }, [fetchPropertyOptionsUsage, hasDeletedOptions, updateProperty]);

  const handleDeleteProperty = useCallback(async () => {
    setIsLoadingDeleteConfirm(true);
    try {
      await waitAtLeast(fetchPropertyUsage(), 100);
    } finally {
      setIsLoadingDeleteConfirm(false);
      setDeleteConfirmOpen(true);
    }
  }, [fetchPropertyUsage]);

  const updateAndCloseModal = useCallback(async () => {
    await updateProperty();
    setOptionDeleteConfirmOpen(false);
  }, [updateProperty]);

  return (
    <div
      className={classNames(styles.item, {
        selected,
        new: isNewProperty,
        droppable: canDrop,
        dragging: isDragging,
      })}
      onClick={onSelect}
      ref={(elem) => {
        ref.current = elem;
        onRef?.(ref);
      }}
      data-testid="properties-list-item"
    >
      <div className={styles.section}>
        <PropertyTypeSelect
          propertyType={property?.type ?? PropertyType.Text}
          onPropertyTypeSelect={setType}
          disabled={!isNewProperty}
        />
        <div className={classNames(styles.button, { hidden: !selected })}>
          <ButtonIcon
            icon={FaFeatherPointed}
            onClick={isNewProperty ? createProperty : handleUpdateProperty}
            color="primary"
            highlighted={true}
            disabled={!canCreateProperty && !canUpdateProperty}
            loading={isNewProperty ? propertyCreating : isUpdateLoading}
            dataTestId="properties-list-item-save-btn"
          />
        </div>
        <div
          ref={(element) => {
            dragRef(element);
          }}
          className={classNames(styles.button, { hidden: !selected })}
        >
          <ButtonIcon
            icon={IoReorderThree}
            disabled={!canDragProperty}
            dataTestId="properties-list-item-reorder-btn"
          />
        </div>
      </div>

      <div className={styles.section}>
        <Input
          value={property.name ?? ''}
          onChange={setName}
          text={'translation'}
          size={'large'}
          placeholder={t('properties.name')}
          maxLength={30}
          dataTestId="property-name"
        />
        <div className={classNames(styles.button, { hidden: !selected })}>
          <ButtonIcon
            icon={FaFire}
            onClick={handleDeleteProperty}
            color={isLoadingDeleteConfirm ? undefined : 'negative'}
            disabled={!canDeleteProperty}
            loading={isLoadingDeleteConfirm}
            dataTestId="properties-list-item-delete-btn"
          />
        </div>
      </div>

      {property.type === PropertyType.Option && (
        <OptionPropertyDetails
          property={property}
          addOption={addOption}
          editOption={editOption}
          removeOption={removeOption}
          restoreOption={restoreOption}
        />
      )}

      {isOptionDeleteConfirmOpen && (
        <PropertyOptionDeleteConfirmModal
          property={property}
          deletedOptions={deletedOptions}
          propertyOptionsUsage={propertyOptionsUsage}
          propertyUpdating={propertyUpdating}
          onUpdate={updateAndCloseModal}
          onClose={() => setOptionDeleteConfirmOpen(false)}
        />
      )}

      {isDeleteConfirmOpen && (
        <PropertyDeleteConfirmModal
          property={property}
          propertyUsage={propertyUsage}
          propertyDeleting={propertyDeleting}
          onDelete={deleteProperty}
          onClose={() => setDeleteConfirmOpen(false)}
        />
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
      <div className={styles.section}>
        <PropertyTypeSelect
          propertyType={property?.type ?? PropertyType.Text}
          onPropertyTypeSelect={() => {}}
          disabled={true}
        />
        <ButtonIcon
          icon={FaFeatherPointed}
          onClick={() => {}}
          disabled={true}
        />
        <ButtonIcon icon={IoReorderThree} onClick={() => {}} />
      </div>

      <div className={styles.section}>
        <Input
          value={property?.name ?? ''}
          text={'translation'}
          size={'large'}
          disabled
        />
        <ButtonIcon icon={FaFire} disabled={true} />
      </div>
    </div>
  );
};
