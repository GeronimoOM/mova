import {
  FaSolidCirclePlus,
  FaSolidFeatherPointed,
  FaSolidCircleXmark,
} from 'solid-icons/fa';
import { IoArrowRedo } from 'solid-icons/io';
import { Component, For } from 'solid-js';
import { LanguageAction } from './Languages';
import { Icon } from '../../utils/Icon';

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
        return 'text-mint bg-spacecadet hover:bg-mint';
      case LanguageAction.Delete:
        return 'text-chilired bg-spacecadet hover:bg-chilired';
      default:
        return '';
    }
  };

  return (
    <Icon
      icon={icon()}
      class="transition-colors"
      classList={{
        'cursor-pointer': !props.isDisabled,
        'text-white': !props.isConfirm,
        'hover:bg-charcoal-100 hover:text-spacecadet': !props.isDisabled,
        [confirmClasses()]: props.isConfirm && !props.isDisabled,
        'brightness-75': props.isDisabled,
      }}
      onClick={
        !props.isDisabled ? () => props.onAction(props.action) : undefined
      }
    />
  );
};

export default LanguageActionButtons;
