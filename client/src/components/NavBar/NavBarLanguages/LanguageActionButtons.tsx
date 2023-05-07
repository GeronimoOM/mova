import {
  FaSolidCirclePlus,
  FaSolidFeatherPointed,
  FaSolidCircleXmark,
  FaSolidCircleMinus,
} from 'solid-icons/fa';
import { IoArrowRedo } from 'solid-icons/io';
import { Component, For } from 'solid-js';
import { NavBarIcon } from '../NavBarIcon';
import { LanguageAction } from './Languages';

export type LanguageActionButtonsProps = {
  onAction: (action: LanguageAction | null) => void;
  actions: LanguageActionButtonsAction[];
};

export type LanguageActionButtonsAction = Omit<
  LanguageActionButtonProps,
  'onAction'
>;

const LanguageActionButtons: Component<LanguageActionButtonsProps> = (
  props,
) => {
  return (
    <div class="flex flex-row items-stretch">
      <For each={props.actions}>
        {(actionButtonProps) => (
          <LanguageActionButton
            {...actionButtonProps}
            onAction={props.onAction}
          />
        )}
      </For>
    </div>
  );
};

type LanguageActionButtonProps = {
  action: LanguageAction | null;
  isDisabled?: boolean;
  isConfirm?: boolean;
  onAction: (action: LanguageAction | null) => void;
};

const LanguageActionButton: Component<LanguageActionButtonProps> = (props) => {
  const icon = () => {
    switch (props.action) {
      case LanguageAction.Create:
        return FaSolidCirclePlus;
      case LanguageAction.Update:
        return FaSolidFeatherPointed;
      case LanguageAction.Delete:
        return FaSolidCircleXmark;
      default:
        return IoArrowRedo;
    }
  };

  const confirmClasses = () => {
    switch (props.action) {
      case LanguageAction.Create:
      case LanguageAction.Update:
        return 'text-mint hover:bg-mint';
      case LanguageAction.Delete:
        return 'text-chilired hover:bg-chilired';
      default:
        return '';
    }
  };

  const onAction = (action: LanguageAction | null) => () =>
    props.onAction(action);

  return (
    <NavBarIcon
      icon={icon()}
      class="cursor-pointer transition-colors"
      classList={{
        'hover:bg-charcoal-100 hover:text-spacecadet': !props.isDisabled,
        'brightness-75': props.isDisabled,
        [confirmClasses()]: props.isConfirm && !props.isDisabled,
      }}
      onClick={onAction(props.action)}
    />
  );
};

export default LanguageActionButtons;
