import {
  Component,
  For,
  Show,
  batch,
  createEffect,
  createSignal,
} from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import {
  DragDropProvider,
  DragDropSensors,
  SortableProvider,
  closestCenter,
  DragEvent,
  DragOverlay,
} from '@thisbeyond/solid-dnd';
import { useLanguageContext } from '../LanguageContext';
import { GetPropertiesDocument, PartOfSpeech } from '../../api/types/graphql';
import { reorderPropertiesMutation } from '../../api/mutations';
import {
  PropertyListItem,
  PropertyListItemOverlay,
} from './PropertiesListItem';
import { ActionBar, Action } from '../common/ActionBar';
import { ColorContextType, ColorProvider } from '../common/ColorContext';

export type PropertiesListProps = {
  partOfSpeech: PartOfSpeech;
};

export const PropertiesList: Component<PropertiesListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();
  const [selectedAction, setSelectedAction] = createSignal<Action | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = createSignal<
    string | null
  >(null);
  const isCreateOpen = () => selectedAction() === Action.Create;

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

  const [reorderProperties] = reorderPropertiesMutation();

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

  const onActionSelect = (
    newAction: Action | null,
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

        reorderProperties({
          variables: {
            input: {
              languageId: selectedLanguageId()!,
              partOfSpeech: props.partOfSpeech,
              propertyIds: reorderedPropertyIds,
            },
          },
        });
      }
    }
  };

  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-spacecadet-300',
      backgroundColor: 'bg-coolgray-300',
      hoverBackgroundColor: 'hover:bg-coolgray-200',
    },
    active: {
      textColor: 'text-spacecadet-300',
      backgroundColor: 'bg-coolgray-200',
    },
    selected: {
      textColor: 'text-coolgray-200',
      backgroundColor: 'bg-spacecadet-300',
      hoverTextColor: 'hover:text-spacecadet-300',
    },
    disabled: {
      textColor: 'text-spacecadet-100',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
      <div class="mx-auto flex w-full max-w-[60rem] flex-col items-center gap-y-2 p-2">
        <DragDropProvider
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetector={closestCenter}
        >
          <DragDropSensors />
          <SortableProvider ids={propertyIds()}>
            <For each={properties()}>
              {(property) => (
                <PropertyListItem
                  property={property}
                  partOfSpeech={props.partOfSpeech}
                  selectedAction={
                    property.id === selectedPropertyId()
                      ? selectedAction()
                      : null
                  }
                  onActionSelect={(action) =>
                    onActionSelect(action, property.id)
                  }
                  isSortable={true}
                />
              )}
            </For>
          </SortableProvider>
          <DragOverlay>
            <Show when={draggedProperty()}>
              <PropertyListItemOverlay property={draggedProperty()!} />
            </Show>
          </DragOverlay>
        </DragDropProvider>
        <Show
          when={isCreateOpen()}
          fallback={
            <div
              class={`sticky bottom-0 flex w-full flex-row justify-center p-2
            outline outline-8 outline-alabaster ${colorContext.base!
              .backgroundColor!}`}
            >
              <ActionBar
                actions={[Action.Create]}
                selectedAction={null}
                onActionSelect={onActionSelect}
              />
            </div>
          }
        >
          <PropertyListItem
            property={null}
            partOfSpeech={props.partOfSpeech}
            selectedAction={Action.Create}
            onActionSelect={onActionSelect}
            isSortable={false}
          />
        </Show>
      </div>
    </ColorProvider>
  );
};
