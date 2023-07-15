import {
  FaSolidCirclePlus,
  FaSolidFeatherPointed,
  FaSolidCircleXmark,
} from 'solid-icons/fa';
import { IoArrowRedo } from 'solid-icons/io';
import { Component, For, Show, getOwner, runWithOwner } from 'solid-js';
import { Icon } from '../utils/Icon';
import { IconTypes } from 'solid-icons';
import { PropertyAction } from './propertyActions';

const actionToIcon: Record<PropertyAction, IconTypes> = {
  [PropertyAction.Create]: FaSolidCirclePlus,
  [PropertyAction.Update]: FaSolidFeatherPointed,
  [PropertyAction.Delete]: FaSolidCircleXmark,
};
const cancelActionIcon = IoArrowRedo;

const actionToConfirmClasses: Record<PropertyAction, string> = {
  [PropertyAction.Create]:
    'text-mint bg-spacecadet hover:text-inherit hover:bg-mint',
  [PropertyAction.Update]:
    'text-mint bg-spacecadet hover:text-inherit hover:bg-mint',
  [PropertyAction.Delete]:
    'text-chilired bg-spacecadet hover:text-inherit hover:bg-chilired',
};

export type PropertyActionBarProps = {
  actions: PropertyAction[];
  selectedAction: PropertyAction | null;
  onSelectAction: (action: PropertyAction | null) => void;
  isSaveDisabled?: boolean;
};

const PropertyActionBar: Component<PropertyActionBarProps> = (props) => {
  const isSaveAction = (action: PropertyAction) =>
    action === PropertyAction.Create || action === PropertyAction.Update;

  return (
    <div class="flex flex-row items-stretch">
      <For each={props.actions}>
        {(action) => (
          <Show when={!props.selectedAction || props.selectedAction === action}>
            <PropertyActionButton
              action={action}
              onAction={props.onSelectAction}
              isConfirm={props.selectedAction === action}
              isDisabled={isSaveAction(action) && props.isSaveDisabled}
            />
          </Show>
        )}
      </For>
      <Show when={props.selectedAction}>
        <PropertyActionButton action={null} onAction={props.onSelectAction} />
      </Show>
    </div>
  );
};

type PropertyActionButtonProps = {
  action: PropertyAction | null;
  onAction: (action: PropertyAction | null) => void;
  isConfirm?: boolean;
  isDisabled?: boolean;
};

const PropertyActionButton: Component<PropertyActionButtonProps> = (props) => {
  const icon = props.action ? actionToIcon[props.action] : cancelActionIcon;
  const confirmClasses = props.action
    ? actionToConfirmClasses[props.action]
    : '';
  const owner = getOwner();

  return (
    <Icon
      icon={icon}
      class="transition-colors"
      classList={{
        'text-spacecadet': !props.isConfirm,
        'cursor-pointer': !props.isDisabled,
        'hover:bg-coolgray-200': !props.isConfirm && !props.isDisabled,
        [confirmClasses]: props.isConfirm && !props.isDisabled,
        'brightness-150': props.isDisabled,
      }}
      onClick={
        !props.isDisabled
          ? () => runWithOwner(owner, () => props.onAction(props.action))
          : undefined
      }
    />
  );
};

export default PropertyActionBar;
