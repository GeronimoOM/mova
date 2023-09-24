import { FaSolidFeatherPointed, FaSolidFire } from 'solid-icons/fa';
import { SiAddthis } from 'solid-icons/si';
import { IoArrowRedo } from 'solid-icons/io';
import { Component, For, Show, getOwner, runWithOwner } from 'solid-js';
import { Icon } from '../common/Icon';
import { IconTypes } from 'solid-icons';
import { asClasses, useColorContext } from './ColorContext';

export enum Action {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

const actionToIcon: Record<Action, IconTypes> = {
  [Action.Create]: SiAddthis,
  [Action.Update]: FaSolidFeatherPointed,
  [Action.Delete]: FaSolidFire,
};
const cancelActionIcon = IoArrowRedo;

const actionToConfirmClasses: Record<Action, string> = {
  [Action.Create]: 'text-mint hover:bg-mint',
  [Action.Update]: 'text-mint hover:bg-mint',
  [Action.Delete]: 'text-chilired hover:bg-chilired',
};

export type ActionBarProps = {
  actions: Array<Action | null>;
  selectedAction: Action | null;
  onActionSelect: (action: Action | null) => void;
  isSaveDisabled?: boolean;
};

export const ActionBar: Component<ActionBarProps> = (props) => {
  const isSaveAction = (action: Action | null) =>
    action === Action.Create || action === Action.Update;

  return (
    <div class="flex flex-row items-stretch">
      <For each={props.actions}>
        {(action) => (
          <Show when={!props.selectedAction || props.selectedAction === action}>
            <ActionButton
              action={action}
              onActionSelect={props.onActionSelect}
              isConfirm={action !== null && props.selectedAction === action}
              isDisabled={
                isSaveAction(props.selectedAction) &&
                isSaveAction(action) &&
                props.isSaveDisabled
              }
            />
          </Show>
        )}
      </For>
      <Show when={props.selectedAction}>
        <ActionButton action={null} onActionSelect={props.onActionSelect} />
      </Show>
    </div>
  );
};

type ActionButtonProps = {
  action: Action | null;
  onActionSelect: (action: Action | null) => void;
  isConfirm?: boolean;
  isDisabled?: boolean;
};

export const ActionButton: Component<ActionButtonProps> = (props) => {
  const icon = props.action ? actionToIcon[props.action] : cancelActionIcon;
  const {
    base: baseColors,
    selected: selectedColors,
    disabled: disabledColors,
  } = useColorContext()!;
  const defaultClasses = asClasses(
    baseColors?.textColor,
    baseColors?.backgroundColor,
  );
  const defaultEnabledClasses = asClasses(
    baseColors?.hoverTextColor,
    baseColors?.hoverBackgroundColor,
  );
  const confirmClasses = props.action
    ? asClasses(
        actionToConfirmClasses[props.action],
        selectedColors?.backgroundColor,
        selectedColors?.hoverTextColor,
      )
    : '';
  const disabledClasses = asClasses(
    disabledColors?.textColor,
    disabledColors?.backgroundColor,
  );

  const onClick = () =>
    !props.isDisabled &&
    runWithOwner(owner, () => props.onActionSelect(props.action));

  const owner = getOwner();

  return (
    <Icon
      icon={icon}
      class="transition-colors"
      classList={{
        'cursor-pointer': !props.isDisabled,
        [defaultClasses]: !props.isConfirm,
        [defaultEnabledClasses]: !props.isConfirm && !props.isDisabled,
        [confirmClasses]: props.isConfirm && !props.isDisabled,
        [disabledClasses]: props.isDisabled,
      }}
      onClick={onClick}
    />
  );
};
