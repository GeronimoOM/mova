import { useMatch, A } from '@solidjs/router';
import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';
import { Icon } from '../common/Icon';
import { asClasses, useColorContext } from '../common/ColorContext';

type NavBarItemProps = {
  href: string;
  icon: IconTypes;
  text: string;
};

export const NavBarItem: Component<NavBarItemProps> = (props) => {
  const match = useMatch(() => props.href);

  const { base: baseColors, selected: selectedColors } = useColorContext()!;
  const baseClasses = asClasses(
    baseColors?.textColor,
    baseColors?.backgroundColor,
    baseColors?.hoverTextColor,
    baseColors?.hoverBackgroundColor,
  );
  const selectedClasses = asClasses(
    selectedColors?.textColor,
    selectedColors?.backgroundColor,
  );

  return (
    <A href={props.href}>
      <div
        class="flex flex-none flex-row items-center"
        classList={{
          [baseClasses]: !match(),
          [selectedClasses]: !!match(),
        }}
      >
        <Icon icon={props.icon} />
        <div class="hidden p-3 md:inline-block">{props.text}</div>
      </div>
    </A>
  );
};
