import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import { v1 as uuid } from 'uuid';
import {
  useCreateProperty,
  useDeleteProperty,
  useUpdateProperty,
} from '../../api/mutations';
import {
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyType,
} from '../../api/types/graphql';
import { DATETIME_FORMAT } from '../../utils/constants';
import { useLanguageContext } from '../LanguageContext';

const MIN_PROPERTY_NAME_LENGTH = 3;

export type PropertyReturn = {
  isNewProperty: boolean;
  property: Partial<PropertyFieldsFragment>;
  setName: (name: string) => void;

  canCreateProperty: boolean;
  createProperty: () => void;
  propertyCreating: boolean;
  createdProperty: PropertyFieldsFragment | undefined;

  canUpdateProperty: boolean;
  updateProperty: () => void;
  propertyUpdating: boolean;
  updatedProperty: PropertyFieldsFragment | undefined;

  propertyDeleting: boolean;
  deleteProperty: () => void;
  canDeleteProperty: boolean;
  deletedProperty: { id: string } | undefined;
};

export function useProperty(
  partOfSpeech: PartOfSpeech,
  property: PropertyFieldsFragment | null,
): PropertyReturn {
  const [selectedLanguageId] = useLanguageContext();
  const [nameInput, setNameInput] = useState(property?.name ?? '');
  const [typeInput] = useState(PropertyType.Text);

  const [
    createPropertyMutate,
    { data: createPropertyResult, loading: propertyCreating },
  ] = useCreateProperty();
  const [
    updatePropertyMutate,
    { data: updatePropertyResult, loading: propertyUpdating },
  ] = useUpdateProperty();
  const [
    deletePropertyMutate,
    { data: deletePropertyResult, loading: propertyDeleting },
  ] = useDeleteProperty();

  const isNewProperty = !property;
  const createdProperty = createPropertyResult?.createProperty;
  const updatedProperty = updatePropertyResult?.updateProperty;
  const deletedProperty = deletePropertyResult?.deleteProperty;

  const canCreateProperty = Boolean(
    selectedLanguageId &&
      isNewProperty &&
      nameInput.length >= MIN_PROPERTY_NAME_LENGTH,
  );
  const canUpdateProperty = Boolean(
    selectedLanguageId &&
      !isNewProperty &&
      nameInput.length >= MIN_PROPERTY_NAME_LENGTH &&
      nameInput !== property.name,
  );
  const canDeleteProperty = Boolean(selectedLanguageId && !isNewProperty);

  const createProperty = useCallback(() => {
    if (canCreateProperty) {
      createPropertyMutate({
        variables: {
          input: {
            id: uuid(),
            languageId: selectedLanguageId!,
            name: nameInput,
            type: PropertyType.Text, // TODO add support for other types
            partOfSpeech,
            addedAt: DateTime.utc().toFormat(DATETIME_FORMAT),
          },
        },
      });
    }
  }, [
    selectedLanguageId,
    partOfSpeech,
    nameInput,
    canCreateProperty,
    createPropertyMutate,
  ]);

  const updateProperty = useCallback(() => {
    if (canUpdateProperty) {
      updatePropertyMutate({
        variables: {
          input: {
            id: property!.id,
            name: nameInput,
          },
        },
      });
    }
  }, [property, nameInput, canUpdateProperty, updatePropertyMutate]);

  const deleteProperty = useCallback(() => {
    if (canDeleteProperty) {
      deletePropertyMutate({
        variables: {
          input: {
            id: property!.id,
          },
        },
      });
    }
  }, [property, canDeleteProperty, deletePropertyMutate]);

  return useMemo<PropertyReturn>(
    () => ({
      isNewProperty,
      property: {
        ...property,
        name: nameInput,
        type: typeInput,
      },
      setName: setNameInput,

      canCreateProperty,
      createProperty,
      propertyCreating,
      createdProperty,

      canUpdateProperty,
      updateProperty,
      propertyUpdating,
      updatedProperty,

      canDeleteProperty,
      deleteProperty,
      propertyDeleting,
      deletedProperty,
    }),
    [
      isNewProperty,
      property,
      nameInput,
      typeInput,
      canCreateProperty,
      createProperty,
      propertyCreating,
      createdProperty,
      canUpdateProperty,
      updateProperty,
      propertyUpdating,
      updatedProperty,
      canDeleteProperty,
      deleteProperty,
      propertyDeleting,
      deletedProperty,
    ],
  );
}
