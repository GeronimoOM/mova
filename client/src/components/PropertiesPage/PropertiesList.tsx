import { Component, For, createEffect, createSignal } from 'solid-js';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  createSortable,
  useDragDropContext,
  DragEvent,
  DragOverlay,
} from '@thisbeyond/solid-dnd';
import { useLanguageContext } from '../LanguageContext';
import {
  GetPropertiesDocument,
  PartOfSpeech,
  ReorderPropertiesDocument,
} from '../../api/types/graphql';
import { TextPropertyFieldsFragment } from '../../api/types/graphql';
import { OptionPropertyFieldsFragment } from '../../api/types/graphql';
import { updateCacheOnReorderProperties } from '../../api/mutations';

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      sortable: any;
    }
  }
}

export type PropertiesListProps = {
  partOfSpeech: PartOfSpeech;
  selectedProperty: string | null;
  onPropertySelect: (selectedProperty: string | null) => void;
};

const PropertiesList: Component<PropertiesListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [fetchProperies, propertiesQuery] = createLazyQuery(
    GetPropertiesDocument,
  );
  const properties = () => propertiesQuery()?.language?.properties;
  const propertyIds = () => properties()?.map((property) => property.id) || [];

  const [draggedPropertyId, setDraggedPropertyId] = createSignal<string | null>(
    null,
  );
  const draggedProperty = () =>
    properties()?.find((property) => property.id === draggedPropertyId());

  const [reorderProperties] = createMutation(ReorderPropertiesDocument);

  createEffect(() => {
    if (selectedLanguageId()) {
      fetchProperies({
        variables: {
          languageId: selectedLanguageId()!,
          partOfSpeech: props.partOfSpeech,
        },
      });
    }
  });

  const onDragStart = ({ draggable }: DragEvent) =>
    setDraggedPropertyId(draggable.id as string);

  const onDragEnd = ({ draggable, droppable }: DragEvent) => {
    if (draggable && droppable) {
      const currentPropertyIds = propertyIds()!;
      const fromIndex = currentPropertyIds.indexOf(draggable.id as string);
      const toIndex = currentPropertyIds.indexOf(droppable.id as string);
      if (fromIndex !== toIndex) {
        const reorderedPropertyIds = currentPropertyIds.slice();
        reorderedPropertyIds.splice(
          toIndex,
          0,
          ...reorderedPropertyIds.splice(fromIndex, 1),
        );
        const currentProperties = properties()!;
        const reorderedProperties = reorderedPropertyIds.map(
          (id) => currentProperties.find((p) => p.id === id)!,
        );

        reorderProperties({
          variables: {
            input: {
              languageId: selectedLanguageId()!,
              partOfSpeech: props.partOfSpeech,
              propertyIds: reorderedPropertyIds,
            },
          },
          optimisticResponse: { reorderProperties: reorderedProperties },
          update: updateCacheOnReorderProperties,
        });
      }
    }
  };

  return (
    <DragDropProvider
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      collisionDetector={closestCenter}
    >
      <DragDropSensors>
        <div class="relative flex flex-col font-mono font-bold">
          <SortableProvider ids={propertyIds()}>
            <For each={properties()} fallback={'loading...'}>
              {(property) => (
                <PropertyListItem
                  property={property}
                  selectedProperty={props.selectedProperty}
                  onPropertySelect={props.onPropertySelect}
                />
              )}
            </For>
          </SortableProvider>
        </div>
      </DragDropSensors>
      <DragOverlay>
        <PropertyListItemOverlay property={draggedProperty()} />
      </DragOverlay>
    </DragDropProvider>
  );
};

type PropertyListItemProps = {
  property: TextPropertyFieldsFragment | OptionPropertyFieldsFragment;
  selectedProperty: string | null;
  onPropertySelect: (selectedProperty: string | null) => void;
};

const PropertyListItem: Component<PropertyListItemProps> = (props) => {
  const sortable = createSortable(props.property.id);

  const [state] = useDragDropContext()!;

  return (
    <div
      use:sortable
      class="p-1 bg-blue-300 border border-black hover:underline cursor-move"
      onClick={() => props.onPropertySelect(props.property.id)}
      classList={{
        'opacity-25': sortable.isActiveDraggable,
        'transition-transform': !!state.active.draggable,
      }}
    >
      {props.property.name}
    </div>
  );
};

type PropertyListItemOverlayProps = {
  property?: TextPropertyFieldsFragment | OptionPropertyFieldsFragment;
};

const PropertyListItemOverlay: Component<PropertyListItemOverlayProps> = (
  props,
) => {
  return (
    <div class="p-1 bg-blue-300 border border-black">
      {props.property?.name ?? ''}
    </div>
  );
};

export default PropertiesList;
