import { IconTypes } from 'solid-icons';
import { Component, JSX, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type IconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  icon: IconTypes;
  size?: 'md' | 'sm';
};

export const Icon: Component<IconProps> = (props) => {
  const [iconProps, otherProps] = splitProps(props, ['icon', 'size']);
  const size = () => ((props.size ?? 'md') === 'md' ? '2rem' : '1.5rem');
  const classes = () => ((props.size ?? 'md') === 'md' ? 'm-2' : 'm-1.5');

  return (
    <div {...otherProps}>
      <Dynamic
        component={iconProps.icon}
        size={size()}
        class={classes()}
        fill="currentColor"
      />
    </div>
  );
};

export type ToggleIconProps = JSX.HTMLAttributes<HTMLDivElement> & {
  offIcon: IconTypes;
  onIcon: IconTypes;
  isOn: boolean;
};

export const ToggleIcon: Component<ToggleIconProps> = (props) => {
  const [iconProps, otherProps] = splitProps(props, [
    'onIcon',
    'offIcon',
    'isOn',
  ]);

  return (
    <Show
      when={iconProps.isOn}
      fallback={<Icon icon={iconProps.offIcon} {...otherProps} />}
    >
      <Icon icon={iconProps.onIcon} {...otherProps} />
    </Show>
  );
};
