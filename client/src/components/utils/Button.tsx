import { Component, runWithOwner, getOwner } from 'solid-js';
import { useColorContext, asClasses } from './ColorContext';
import { Icon } from './Icon';
import { IconTypes } from 'solid-icons';

export type ButtonProps = {
  icon: IconTypes;
  onClick: () => void;
  isDisabled?: boolean;
};

export const Button: Component<ButtonProps> = (props) => {
  const { base: baseColors, disabled: disabledColors } = useColorContext()!;
  const defaultClasses = asClasses(
    baseColors?.textColor,
    baseColors?.backgroundColor,
  );
  const defaultEnabledClasses = asClasses(
    baseColors?.hoverTextColor,
    baseColors?.hoverBackgroundColor,
  );
  const disabledClasses = asClasses(
    disabledColors?.textColor,
    disabledColors?.backgroundColor,
  );

  const onClick = () =>
    !props.isDisabled && runWithOwner(owner, () => props.onClick());

  const owner = getOwner();

  return (
    <Icon
      icon={props.icon}
      class={`transition-colors ${defaultClasses}`}
      classList={{
        'cursor-pointer': !props.isDisabled,
        [defaultEnabledClasses]: !props.isDisabled,
        [disabledClasses]: props.isDisabled,
      }}
      onClick={onClick}
    />
  );
};
