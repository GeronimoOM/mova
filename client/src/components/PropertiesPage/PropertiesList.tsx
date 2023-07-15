import {
  Component,
  For,
  Show,
  batch,
  createEffect,
  createSignal,
} from 'solid-js';
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
import { updateCacheOnReorderProperties } from '../../api/mutations';
import PropertyListItem, {
  PropertyListItemOverlay,
} from './PropertiesListItem';
import PropertyActionBar from './PropertyActionBar';
import { PropertyAction } from './propertyActions';

export type PropertiesListProps = {
  partOfSpeech: PartOfSpeech;
};

const PropertiesList: Component<PropertiesListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();
  const [selectedAction, setSelectedAction] =
    createSignal<PropertyAction | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = createSignal<
    string | null
  >(null);
  const isCreateOpen = () => selectedAction() === PropertyAction.Create;

  const [fetchProperies, propertiesQuery] = createLazyQuery(
    GetPropertiesDocument,
  );
  const properties = () => propertiesQuery()?.language?.properties;
  const propertyIds = () => properties()?.map((property) => property.id) ?? [];

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

      setSelectedAction(null);
      setSelectedPropertyId(null);
    }
  });

  const onAction = (
    newAction: PropertyAction | null,
    newActionPropertyId: string | null = null,
  ) => {
    if (
      newActionPropertyId === selectedPropertyId() &&
      newAction === selectedAction()
    ) {
      batch(() => {
        setSelectedAction(null);
        setSelectedPropertyId(null);
      });
    } else {
      batch(() => {
        setSelectedAction(newAction);
        setSelectedPropertyId(newActionPropertyId);
      });
    }
  };

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
    <div class="w-full p-2 gap-y-2 flex flex-col items-center">
      <DragDropProvider
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        collisionDetector={closestCenter}
      >
        <DragDropSensors />
        <SortableProvider ids={propertyIds()}>
          <For each={properties()} fallback={'loading...'}>
            {(property) => (
              <PropertyListItem
                property={property}
                partOfSpeech={props.partOfSpeech}
                selectedAction={
                  property.id === selectedPropertyId() ? selectedAction() : null
                }
                onSelectAction={(action) => onAction(action, property.id)}
                isSortable={true}
              />
            )}
          </For>
        </SortableProvider>
        <DragOverlay>
          <PropertyListItemOverlay property={draggedProperty()} />
        </DragOverlay>
      </DragDropProvider>
      <Show
        when={isCreateOpen()}
        fallback={
          <div class="sticky bottom-0 flex flex-row justify-center w-full max-w-[60rem] bg-coolgray-300 outline outline-8 outline-alabaster">
            <PropertyActionBar
              actions={[PropertyAction.Create]}
              selectedAction={null}
              onSelectAction={onAction}
            />
          </div>
        }
      >
        <PropertyListItem
          property={null}
          partOfSpeech={props.partOfSpeech}
          selectedAction={PropertyAction.Create}
          onSelectAction={onAction}
          isSortable={false}
        />
      </Show>
    </div>
  );
};

export default PropertiesList;
