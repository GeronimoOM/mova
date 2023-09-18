import {
  createSortable,
  transformStyle,
  useDragDropContext,
} from '@thisbeyond/solid-dnd';
import { FaSolidGripLines } from 'solid-icons/fa';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import {
  TextPropertyFieldsFragment,
  OptionPropertyFieldsFragment,
  CreatePropertyDocument,
  UpdatePropertyDocument,
  DeletePropertyDocument,
  PartOfSpeech,
  PropertyType,
} from '../../api/types/graphql';
import { createMutation } from '@merged/solid-apollo';
import { useLanguageContext } from '../LanguageContext';
import {
  updateCacheOnCreateProperty,
  updateCacheOnDeleteProperty,
} from '../../api/mutations';
import { Icon } from '../utils/Icon';
import { PropertyTypeSelect, PropertyTypeIcon } from './PropertyTypeSelect';
import { ActionBar, Action } from '../utils/ActionBar';
import { asClasses, useColorContext } from '../utils/ColorContext';

const MIN_PROPERTY_NAME_LENGTH = 3;

type PropertyListItemProps = {
  property: TextPropertyFieldsFragment | OptionPropertyFieldsFragment | null;
  partOfSpeech: PartOfSpeech;
  selectedAction: Action | null;
  onActionSelect: (action: Action | null) => void;
  isSortable: boolean;
};

export const PropertyListItem: Component<PropertyListItemProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [propertyName, setPropertyName] = createSignal(
    props.property?.name ?? '',
  );
  const isPropertyNameValid = () =>
    propertyName().trim().length >= MIN_PROPERTY_NAME_LENGTH;
  const [propertyType, setPropertyType] = createSignal(
    props.property?.type ?? PropertyType.Text,
  );

  const sortable = props.isSortable ? createSortable(props.property!.id) : null;
  const sortableRef = sortable?.ref ?? (() => {});
  const [dragDropState] = props.isSortable ? useDragDropContext()! : [];

  const [createProperty] = createMutation(CreatePropertyDocument);
  const [updateProperty] = createMutation(UpdatePropertyDocument);
  const [deleteProperty] = createMutation(DeletePropertyDocument);

  const onActionSelect = (newAction: Action | null) => {
    if (newAction && newAction === props.selectedAction) {
      executeAction(newAction);
    }

    props.onActionSelect(newAction);
  };

  const executeAction = (action: Action) => {
    switch (action) {
      case Action.Create:
        return executeCreate();
      case Action.Update:
        return executeUpdate();
      case Action.Delete:
        return executeDelete();
    }
  };

  const executeCreate = () => {
    createProperty({
      variables: {
        input: {
          languageId: selectedLanguageId()!,
          partOfSpeech: props.partOfSpeech,
          type: propertyType(),
          name: propertyName().trim(),
        },
      },
      update: updateCacheOnCreateProperty,
    });
  };

  const executeUpdate = () => {
    updateProperty({
      variables: {
        input: {
          id: props.property!.id,
          name: propertyName().trim(),
        },
      },
    });
  };

  const executeDelete = () => {
    deleteProperty({
      variables: {
        id: props.property!.id,
      },
      update: updateCacheOnDeleteProperty,
    });
  };

  createEffect(() => {
    if (!props.selectedAction) {
      setPropertyName(props.property?.name ?? '');
    }
  });

  const { base: baseColors } = useColorContext()!;

  return (
    <div
      ref={sortableRef}
      class={`group w-full max-w-[60rem] min-h-[6rem] p-2 flex flex-row
      ${baseColors?.textColor} ${baseColors?.backgroundColor} transition-colors`}
      classList={{
        'opacity-75': sortable?.isActiveDraggable,
        'transition-transform': !!dragDropState?.active.draggable,
      }}
      style={sortable ? transformStyle(sortable.transform) : undefined}
    >
      <PropertyTypeSelect
        selectedType={propertyType()}
        onSelectType={setPropertyType}
        isDisabled={!!props.property}
      />
      <div class="flex-1">
        <PropertyNameInput
          propertyName={propertyName()}
          onPropertyName={setPropertyName}
          isDisabled={
            props.selectedAction !== Action.Create &&
            props.selectedAction !== Action.Update
          }
        />
      </div>
      <div>
        <div
          class="flex flex-row items-end transition-opacity"
          classList={{
            'opacity-0 group-hover:opacity-100': !props.selectedAction,
          }}
        >
          <ActionBar
            actions={
              props.property ? [Action.Update, Action.Delete] : [Action.Create]
            }
            selectedAction={props.selectedAction}
            onActionSelect={onActionSelect}
            isSaveDisabled={!isPropertyNameValid()}
          />
          <Show when={props.isSortable}>
            <div
              class={`${baseColors?.hoverBackgroundColor} cursor-move`}
              {...sortable?.dragActivators}
            >
              <Icon icon={FaSolidGripLines} />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

type PropertyListItemOverlayProps = {
  property: TextPropertyFieldsFragment | OptionPropertyFieldsFragment;
};

export const PropertyListItemOverlay: Component<
  PropertyListItemOverlayProps
> = (props) => {
  const { base: baseColors, selected: selectedColors } = useColorContext()!;

  return (
    <div
      class={`flex flex-row p-2 ${baseColors?.textColor} ${baseColors?.backgroundColor}`}
    >
      <PropertyTypeIcon type={props.property.type} />
      <div class="flex-1 p-3 font-bold">{props.property.name}</div>
      <Icon
        icon={FaSolidGripLines}
        class={`${selectedColors?.textColor} ${selectedColors?.backgroundColor} cursor-move`}
      />
    </div>
  );
};

type PropertyNameInputProps = {
  propertyName: string;
  onPropertyName: (name: string) => void;
  isDisabled: boolean;
};

const PropertyNameInput: Component<PropertyNameInputProps> = (props) => {
  const { base: baseColors, active: activeColors } = useColorContext()!;
  const disabledClasses = asClasses(
    baseColors?.textColor,
    baseColors?.backgroundColor,
  );
  const enabledClasses = asClasses(
    activeColors?.textColor,
    activeColors?.backgroundColor,
  );

  return (
    <input
      class="p-3 w-full outline-none"
      classList={{
        [disabledClasses]: props.isDisabled,
        [enabledClasses]: !props.isDisabled,
      }}
      value={props.propertyName}
      onInput={(e) => props.onPropertyName(e.currentTarget.value)}
      disabled={props.isDisabled}
      spellcheck={false}
      autoCapitalize="off"
    />
  );
};
