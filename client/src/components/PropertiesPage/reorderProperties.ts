import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDrag, useDragLayer, useDrop } from 'react-dnd';
import { useReorderProperties } from '../../api/mutations';
import {
  GetPropertiesDocument,
  PartOfSpeech,
  PropertyFieldsFragment,
} from '../../api/types/graphql';
import { areEqual, toRecord } from '../../utils/arrays';

export const PropertyDndType = 'property';

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PropertyDragObject = {
  property: Partial<PropertyFieldsFragment>;
  initialPosition: Position;
};

export type PropertyDragCollected = {
  isDragging: boolean;
};

export const usePropertyDrag = (
  property: Partial<PropertyFieldsFragment> | null,
  ref: HTMLDivElement | null,
) =>
  useDrag<PropertyDragObject, PropertyDragObject, PropertyDragCollected>({
    type: PropertyDndType,
    item: () =>
      property && ref
        ? {
            property,
            initialPosition: getPosition(ref),
          }
        : null,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

const getPosition: (node: HTMLDivElement) => Position = (node) => {
  const rect = node.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

export type PropertyDropCollected = {
  canDrop: boolean;
  isOver: boolean;
};

export const usePropertyDrop = (
  propertyId: string | null,
  onSwapPreview: (property1Id: string, property2Id: string) => void,
  onReorder: () => void,
) =>
  useDrop<PropertyDragObject, PropertyDragObject, PropertyDropCollected>({
    accept: PropertyDndType,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }),
    canDrop: () => {
      return Boolean(propertyId);
    },
    hover: (item) => {
      if (item.property.id === propertyId) {
        return;
      }

      onSwapPreview(item.property.id!, propertyId!);
    },
    drop: (item) => {
      onReorder();
      return item;
    },
  });

export type PropertyDragLayerCollected = {
  isDragging: boolean;
  property: Partial<PropertyFieldsFragment> | null;
  position: Position | null;
};

export const usePropertyDragLayer = () =>
  useDragLayer<PropertyDragLayerCollected, PropertyDragObject>((monitor) => {
    const item = monitor.getItem();
    const diffFromInit = monitor.getDifferenceFromInitialOffset();

    let position: Position | null = null;
    if (item && diffFromInit) {
      position = {
        ...item.initialPosition,
        y: item.initialPosition.y + diffFromInit.y,
      };
    }

    return {
      isDragging: monitor.isDragging(),
      property: item?.property ?? null,
      position,
    };
  });

export const useOrderedProperties = (
  languageId: string | null,
  partOfSpeech: PartOfSpeech,
) => {
  const [
    fetchProperties,
    { data: propertiesQuery, loading: propertiesLoading },
  ] = useLazyQuery(GetPropertiesDocument);
  const properties = propertiesLoading
    ? undefined
    : propertiesQuery?.language?.properties;

  const [orderedPropertyIds, setOrderedPropertyIds] = useState<string[]>([]);

  const orderedProperties = useMemo(() => {
    if (!properties) {
      return undefined;
    }

    const propertiesById = toRecord(properties, (property) => property.id);

    return orderedPropertyIds.map((id) => propertiesById[id]);
  }, [properties, orderedPropertyIds]);

  const [reorderPropertiesMutate] = useReorderProperties();

  const swapPropertiesPreview = useCallback(
    (property1Id: string, property2Id: string) => {
      const property1Index = orderedPropertyIds.indexOf(property1Id);
      const property2Index = orderedPropertyIds.indexOf(property2Id);

      const reorderedPropertyIds = [...orderedPropertyIds];
      reorderedPropertyIds[property1Index] = property2Id;
      reorderedPropertyIds[property2Index] = property1Id;

      setOrderedPropertyIds(reorderedPropertyIds);
    },
    [orderedPropertyIds],
  );

  const reorderProperties = useCallback(() => {
    const propertyIds = properties?.map((property) => property.id);
    if (!languageId || !propertyIds || !orderedPropertyIds) {
      return;
    }

    if (areEqual(propertyIds, orderedPropertyIds)) {
      return;
    }

    reorderPropertiesMutate({
      variables: {
        input: {
          languageId,
          partOfSpeech,
          propertyIds: orderedPropertyIds,
        },
      },
    });
  }, [
    languageId,
    partOfSpeech,
    orderedPropertyIds,
    properties,
    reorderPropertiesMutate,
  ]);

  useEffect(() => {
    setOrderedPropertyIds([]);

    if (languageId) {
      fetchProperties({
        variables: {
          languageId,
          partOfSpeech,
        },
      });
    }
  }, [languageId, partOfSpeech, fetchProperties]);

  useEffect(() => {
    if (properties) {
      setOrderedPropertyIds(properties.map((property) => property.id));
    }
  }, [properties]);

  return useMemo(
    () => ({
      propertiesLoading,
      orderedProperties,
      swapPropertiesPreview,
      reorderProperties,
    }),
    [
      propertiesLoading,
      orderedProperties,
      reorderProperties,
      swapPropertiesPreview,
    ],
  );
};
