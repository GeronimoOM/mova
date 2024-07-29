import { useDrag, useDragLayer, useDrop } from 'react-dnd';
import { PropertyFieldsFragment } from '../../api/types/graphql';

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
  onReorderPreview: (property1Id: string, property2Id: string) => void,
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

      onReorderPreview(item.property.id!, propertyId!);
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
