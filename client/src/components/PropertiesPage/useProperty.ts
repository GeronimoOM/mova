import { useLazyQuery } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import { v1 as uuid } from 'uuid';
import {
  useCreateProperty,
  useDeleteProperty,
  useUpdateProperty,
} from '../../api/mutations';
import {
  CreateOptionInput,
  GetPropertyOptionsUsageDocument,
  GetPropertyUsageDocument,
  Option,
  OptionFieldsFragment,
  OptionPropertyFieldsFragment,
  OptionUsage,
  PartOfSpeech,
  PropertyFieldsFragment,
  PropertyType,
  UpdateOptionInput,
} from '../../api/types/graphql';
import { toRecord } from '../../utils/arrays';
import { toTimestamp } from '../../utils/datetime';
import { useLanguageContext } from '../LanguageContext';

const MIN_PROPERTY_NAME_LENGTH = 3;

export type Property = Pick<
  PropertyFieldsFragment,
  'name' | 'type' | 'partOfSpeech'
> &
  Partial<Pick<PropertyFieldsFragment, 'id'>> & {
    options: Record<string, PropertyOption>;
  };

export type PropertyOption = OptionFieldsFragment & { isDeleted?: boolean };

export type UsePropertyReturn = {
  isNewProperty: boolean;
  property: Property;
  setName: (name: string) => void;
  setType: (type: PropertyType) => void;
  addOption: (option: UpdateOptionInput) => void;
  editOption: (id: string, option: UpdateOptionInput) => void;
  removeOption: (id: string) => void;
  restoreOption: (id: string) => void;

  canCreateProperty: boolean;
  createProperty: () => Promise<void>;
  propertyCreating: boolean;
  createdProperty: PropertyFieldsFragment | undefined;

  canUpdateProperty: boolean;
  updateProperty: () => Promise<void>;
  propertyUpdating: boolean;
  updatedProperty: PropertyFieldsFragment | undefined;

  propertyDeleting: boolean;
  deleteProperty: () => Promise<void>;
  canDeleteProperty: boolean;

  propertyUsageLoading: boolean;
  fetchPropertyUsage: () => Promise<void>;
  propertyUsage: number | undefined;

  deletedOptions: Option[];
  propertyOptionsUsageLoading: boolean;
  fetchPropertyOptionsUsage: () => Promise<void>;
  propertyOptionsUsage: OptionUsage[] | undefined;
};

export function useProperty(
  partOfSpeech: PartOfSpeech,
  property: PropertyFieldsFragment | null,
  newPropertyId?: string,
): UsePropertyReturn {
  const [selectedLanguageId] = useLanguageContext();
  const [name, setName] = useState(property?.name ?? '');
  const [type, setType] = useState(property?.type ?? PropertyType.Text);
  // OptionProperty details
  const [optionChanges, setOptionChanges] = useState<
    Record<string, UpdateOptionInput>
  >({});

  const [
    createPropertyMutate,
    { data: createPropertyResult, loading: propertyCreating },
  ] = useCreateProperty();
  const [
    updatePropertyMutate,
    { data: updatePropertyResult, loading: propertyUpdating },
  ] = useUpdateProperty();
  const [deletePropertyMutate, { loading: propertyDeleting }] =
    useDeleteProperty();

  const [
    queryPropertyUsage,
    { data: propertyUsageQuery, loading: propertyUsageLoading },
  ] = useLazyQuery(GetPropertyUsageDocument, {
    fetchPolicy: 'no-cache',
  });
  const [
    queryPropertyOptionsUsage,
    { data: propertyOptionsUsageQuery, loading: propertyOptionsUsageLoading },
  ] = useLazyQuery(GetPropertyOptionsUsageDocument, {
    fetchPolicy: 'no-cache',
  });

  const isNewProperty = !property;
  const createdProperty = createPropertyResult?.createProperty;
  const updatedProperty = updatePropertyResult?.updateProperty;
  const propertyUsage = propertyUsageQuery?.property?.usage;
  const propertyOptionsUsage =
    propertyOptionsUsageQuery?.property &&
    'optionsUsage' in propertyOptionsUsageQuery.property
      ? propertyOptionsUsageQuery?.property.optionsUsage
      : undefined;

  const options = useMemo(() => {
    if (type !== PropertyType.Option) {
      return {};
    }

    const optionProperty = property as OptionPropertyFieldsFragment | null;
    const options: Record<string, PropertyOption> = optionProperty?.options
      ? toRecord(optionProperty.options, (opt) => opt.id)
      : {};
    for (const optionChange of Object.values(optionChanges)) {
      if (!optionChange.value && optionChange.value !== '') {
        options[optionChange.id!] = {
          ...options[optionChange.id!],
          isDeleted: true,
        };
      } else {
        options[optionChange.id!] = {
          id: optionChange.id!,
          value: optionChange.value,
          color: optionChange.color,
        };
      }
    }

    return options;
  }, [type, property, optionChanges]);

  const deletedOptions = useMemo(() => {
    return Object.entries(optionChanges)
      .filter(([, optionChange]) => optionChange.value === null)
      .map(
        ([optionId]) =>
          (property as OptionPropertyFieldsFragment).options.find(
            (opt) => opt.id === optionId,
          )!,
      );
  }, [optionChanges, property]);

  const isNameValid = name.length >= MIN_PROPERTY_NAME_LENGTH;
  const areOptionsValid = useMemo(
    () => Object.values(options).every((option) => option.value.length),
    [options],
  );
  const isPropertyValid = isNameValid && areOptionsValid;

  const canCreateProperty = Boolean(
    selectedLanguageId && isNewProperty && isPropertyValid,
  );
  const canUpdateProperty = Boolean(
    selectedLanguageId &&
      !isNewProperty &&
      isPropertyValid &&
      (name !== property.name || Object.keys(optionChanges).length),
  );
  const canDeleteProperty = Boolean(selectedLanguageId && !isNewProperty);

  const addOption = useCallback(
    (option: UpdateOptionInput) => {
      const id = uuid();
      setOptionChanges({
        ...optionChanges,
        [id]: {
          id,
          value: option.value,
          color: option.color,
        },
      });
    },
    [optionChanges],
  );

  const editOption = useCallback(
    (id: string, option: UpdateOptionInput) => {
      const editedOptionChanges = {
        ...optionChanges,
        [id]: {
          id: option.id,
          value: option.value,
          color: option.color,
        },
      };

      const currentOption = (
        property as OptionPropertyFieldsFragment
      )?.options?.find((opt) => opt.id === id);
      if (
        currentOption &&
        currentOption.value === option.value &&
        currentOption.color === option.color
      ) {
        delete editedOptionChanges[id];
      }

      setOptionChanges(editedOptionChanges);
    },
    [optionChanges, property],
  );

  const removeOption = useCallback(
    (id: string) => {
      const editedOptionChanges = { ...optionChanges };

      const currentOption = (
        property as OptionPropertyFieldsFragment
      )?.options?.find((opt) => opt.id === id);

      if (currentOption) {
        editedOptionChanges[id] = {
          id,
          value: null,
        };
      } else {
        delete editedOptionChanges[id];
      }

      setOptionChanges(editedOptionChanges);
    },
    [optionChanges, property],
  );

  const restoreOption = useCallback(
    (id: string) => {
      const editedOptionChanges = { ...optionChanges };
      delete editedOptionChanges[id];

      setOptionChanges(editedOptionChanges);
    },
    [optionChanges],
  );

  const createProperty = useCallback(async () => {
    if (canCreateProperty) {
      setOptionChanges({});
      await createPropertyMutate({
        variables: {
          input: {
            id: newPropertyId,
            languageId: selectedLanguageId!,
            name,
            type,
            partOfSpeech,
            addedAt: toTimestamp(DateTime.utc()),
            options: Object.values(optionChanges) as CreateOptionInput[],
          },
        },
      });
    }
  }, [
    canCreateProperty,
    createPropertyMutate,
    newPropertyId,
    selectedLanguageId,
    name,
    type,
    partOfSpeech,
    optionChanges,
  ]);

  const updateProperty = useCallback(async () => {
    if (canUpdateProperty) {
      setOptionChanges({});
      await updatePropertyMutate({
        variables: {
          input: {
            id: property!.id,
            ...(name !== property?.name && { name }),
            options: Object.values(optionChanges),
          },
        },
      });
    }
  }, [canUpdateProperty, updatePropertyMutate, property, name, optionChanges]);

  const deleteProperty = useCallback(async () => {
    if (canDeleteProperty) {
      await deletePropertyMutate({
        variables: {
          input: {
            id: property!.id,
          },
        },
      });
    }
  }, [property, canDeleteProperty, deletePropertyMutate]);

  const fetchPropertyUsage = useCallback(async () => {
    await queryPropertyUsage({
      variables: {
        propertyId: property!.id,
      },
    });
  }, [property, queryPropertyUsage]);

  const fetchPropertyOptionsUsage = useCallback(async () => {
    await queryPropertyOptionsUsage({
      variables: {
        propertyId: property!.id,
      },
    });
  }, [property, queryPropertyOptionsUsage]);

  return useMemo<UsePropertyReturn>(
    () => ({
      isNewProperty,
      property: {
        ...property,
        name,
        type,
        partOfSpeech,
        options,
      },
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
      updatedProperty,

      canDeleteProperty,
      deleteProperty,
      propertyDeleting,

      fetchPropertyUsage,
      propertyUsageLoading,
      propertyUsage,

      deletedOptions,
      fetchPropertyOptionsUsage,
      propertyOptionsUsageLoading,
      propertyOptionsUsage,
    }),
    [
      isNewProperty,
      property,
      name,
      type,
      partOfSpeech,
      options,
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
      updatedProperty,
      canDeleteProperty,
      deleteProperty,
      propertyDeleting,
      fetchPropertyUsage,
      propertyUsageLoading,
      propertyUsage,
      deletedOptions,
      fetchPropertyOptionsUsage,
      propertyOptionsUsageLoading,
      propertyOptionsUsage,
    ],
  );
}
