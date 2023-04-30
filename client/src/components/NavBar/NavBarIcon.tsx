import { IconTypes } from 'solid-icons';
import { Component, JSX, Show, splitProps } from 'solid-js';

export type NavBarIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  icon: IconTypes;
};

export const NavBarIcon: Component<NavBarIconProps> = (props) => {
  const [iconProp, otherProps] = splitProps(props, ['icon']);

  return (
    <div {...otherProps}>
      <iconProp.icon size="2rem" class="m-2" />
    </div>
  );
};

export type NavBarToggleIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  offIcon: IconTypes;
  onIcon: IconTypes;
  isOn: boolean;
};

export const NavBarToggleIcon: Component<NavBarToggleIconProps> = (props) => {
  const [iconProps, otherProps] = splitProps(props, [
    'onIcon',
    'offIcon',
    'isOn',
  ]);

  return (
    <Show
      when={iconProps.isOn}
      fallback={<NavBarIcon icon={iconProps.offIcon} {...otherProps} />}
    >
      <NavBarIcon icon={iconProps.onIcon} {...otherProps} />
    </Show>
  );
};
