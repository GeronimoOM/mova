import {
  createSortable,
  useDragDropContext,
  transformStyle,
} from '@thisbeyond/solid-dnd';
import {
  FaSolidGripLines,
  FaSolidFeatherPointed,
  FaSolidCircleXmark,
} from 'solid-icons/fa';
import { Component } from 'solid-js';
import {
  TextPropertyFieldsFragment,
  OptionPropertyFieldsFragment,
} from '../../api/types/graphql';

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
      ref={sortable.ref}
      class="w-full max-w-[60rem] p-2 flex flex-row bg-coolgray-300"
      onClick={() => props.onPropertySelect(props.property.id)}
      classList={{
        'opacity-50': sortable.isActiveDraggable,
        'transition-transform': !!state.active.draggable,
      }}
      style={transformStyle(sortable.transform)}
    >
      <div class="flex-1">
        <input
          class="p-3 w-full outline-none bg-coolgray-200"
          value={props.property.name}
        />
      </div>
      <div>
        <div class="flex flex-col">
          <div class="flex flex-row items-end">
            <div class="hover:bg-spacecadet hover:text-coolgray-300">
              <FaSolidFeatherPointed size="2rem" class="m-2" />
            </div>
            <div class="hover:bg-spacecadet hover:text-coolgray-300">
              <FaSolidCircleXmark size="2rem" class="m-2" />
            </div>
          </div>
          <div class="flex flex-row justify-end">
            <div
              class="hover:bg-spacecadet hover:text-coolgray-300 cursor-move"
              {...sortable.dragActivators}
            >
              <FaSolidGripLines size="2rem" class="m-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
