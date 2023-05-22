import { Component, For, createEffect, createSignal } from 'solid-js';
import { FaSolidGripLines } from 'solid-icons/fa';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
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
import PropertyListItem from './PropertiesListItem';

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
        <div class="w-full p-2 gap-y-2 flex flex-col items-center">
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

type PropertyListItemOverlayProps = {
  property?: TextPropertyFieldsFragment | OptionPropertyFieldsFragment;
};

const PropertyListItemOverlay: Component<PropertyListItemOverlayProps> = (
  props,
) => {
  return (
    <div class="flex flex-row">
      <div class="flex-1 p-2 bg-coolgray-300 font-bold">
        {props.property?.name ?? ''}
      </div>
      <div class="bg-spacecadet text-coolgray-300 cursor-move">
        <FaSolidGripLines size="2rem" class="m-2" />
      </div>
    </div>
  );
};

export default PropertiesList;
