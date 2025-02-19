import { NetworkStatus, useLazyQuery } from '@apollo/client';
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
    { data: propertiesQuery, networkStatus: fetchingPropertiesStatus },
  ] = useLazyQuery(GetPropertiesDocument, {
    notifyOnNetworkStatusChange: true,
  });
  const propertiesLoading = [
    NetworkStatus.loading,
    NetworkStatus.refetch,
  ].includes(fetchingPropertiesStatus);

  const properties = propertiesLoading
    ? undefined
    : propertiesQuery?.language?.properties;

  const [orderedPropertyIds, setOrderedPropertyIds] = useState<string[] | null>(
    null,
  );

  const orderedProperties = useMemo(() => {
    if (!properties) {
      return undefined;
    }

    if (!orderedPropertyIds) {
      return properties;
    }

    const propertiesById = toRecord(properties, (property) => property.id);
    return orderedPropertyIds.map((id) => propertiesById[id]);
  }, [properties, orderedPropertyIds]);

  const [reorderPropertiesMutate] = useReorderProperties();

  const swapPropertiesPreview = useCallback(
    (property1Id: string, property2Id: string) => {
      if (!properties) {
        return;
      }

      const oldOrderedPropertyIds =
        orderedPropertyIds ?? properties.map((property) => property.id);

      const property1Index = oldOrderedPropertyIds.indexOf(property1Id);
      const property2Index = oldOrderedPropertyIds.indexOf(property2Id);

      const reorderedPropertyIds = [...oldOrderedPropertyIds];
      reorderedPropertyIds[property1Index] = property2Id;
      reorderedPropertyIds[property2Index] = property1Id;

      setOrderedPropertyIds(reorderedPropertyIds);
    },
    [properties, orderedPropertyIds],
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
    if (languageId) {
      setOrderedPropertyIds(null);
      fetchProperties({
        variables: {
          languageId,
          partOfSpeech,
        },
      });
    }
  }, [languageId, partOfSpeech, fetchProperties]);

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
