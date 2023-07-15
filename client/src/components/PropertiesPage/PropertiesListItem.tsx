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
import { PropertyAction } from './propertyActions';
import { Icon } from '../utils/Icon';
import PropertyActionBar from './PropertyActionBar';
import PropertyTypeSelect from './PropertyTypeSelect';

const MIN_PROPERTY_NAME_LENGTH = 3;

type PropertyListItemProps = {
  property: TextPropertyFieldsFragment | OptionPropertyFieldsFragment | null;
  partOfSpeech: PartOfSpeech;
  selectedAction: PropertyAction | null;
  onSelectAction: (action: PropertyAction | null) => void;
  isSortable: boolean;
};

const PropertyListItem: Component<PropertyListItemProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [propertyName, setPropertyName] = createSignal(
    props.property?.name ?? '',
  );
  const isPropertyNameValid = () =>
    propertyName().length >= MIN_PROPERTY_NAME_LENGTH;
  const [propertyType, setPropertyType] = createSignal(
    props.property?.type ?? PropertyType.Text,
  );

  const sortable = props.isSortable ? createSortable(props.property!.id) : null;
  const sortableRef = sortable?.ref ?? (() => {});
  const [dragDropState] = props.isSortable ? useDragDropContext()! : [];

  const [createProperty] = createMutation(CreatePropertyDocument);
  const [updateProperty] = createMutation(UpdatePropertyDocument);
  const [deleteProperty] = createMutation(DeletePropertyDocument);

  const onAction =
    (selectedAction: PropertyAction | null) =>
    (newAction: PropertyAction | null) => {
      if (newAction && newAction === selectedAction) {
        executeAction(newAction);
      }

      props.onSelectAction(newAction);
    };

  const executeAction = (action: PropertyAction) => {
    switch (action) {
      case PropertyAction.Create:
        return executeCreate();
      case PropertyAction.Update:
        return executeUpdate();
      case PropertyAction.Delete:
        return executeDelete();
    }
  };

  const executeCreate = () => {
    createProperty({
      variables: {
        input: {
          languageId: selectedLanguageId()!,
          partOfSpeech: props.partOfSpeech,
          // TODO
          type: PropertyType.Text,
          name: propertyName(),
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
          name: propertyName(),
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

  return (
    <div
      ref={sortableRef}
      class="group w-full max-w-[60rem] min-h-[6rem] flex flex-row text-spacecadet bg-coolgray-300 transition-colors"
      classList={{
        'opacity-50': sortable?.isActiveDraggable,
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
            props.selectedAction !== PropertyAction.Create &&
            props.selectedAction !== PropertyAction.Update
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
          <PropertyActionBar
            actions={
              props.property
                ? [PropertyAction.Update, PropertyAction.Delete]
                : [PropertyAction.Create]
            }
            selectedAction={props.selectedAction}
            onSelectAction={onAction(props.selectedAction)}
            isSaveDisabled={!isPropertyNameValid()}
          />
          <Show when={props.isSortable}>
            <div
              class="hover:bg-coolgray-200 cursor-move"
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
  property?: TextPropertyFieldsFragment | OptionPropertyFieldsFragment;
};

export const PropertyListItemOverlay: Component<
  PropertyListItemOverlayProps
> = (props) => {
  return (
    <div class="flex flex-row text-spacecadet">
      <div class="flex-1 p-2 bg-coolgray-300 font-bold">
        {props.property?.name ?? ''}
      </div>
      <div class="bg-coolgray-200 cursor-move">
        <FaSolidGripLines size="2rem" class="m-2" />
      </div>
    </div>
  );
};

type PropertyNameInputProps = {
  propertyName: string;
  onPropertyName: (name: string) => void;
  isDisabled: boolean;
};

const PropertyNameInput: Component<PropertyNameInputProps> = (props) => {
  return (
    <input
      class="p-3 w-full outline-none"
      classList={{
        'bg-coolgray-300': props.isDisabled,
        'bg-coolgray-200': !props.isDisabled,
      }}
      value={props.propertyName}
      onInput={(e) => props.onPropertyName(e.currentTarget.value)}
      disabled={props.isDisabled}
      spellcheck={false}
    />
  );
};

export default PropertyListItem;
