import { useMatch, A } from '@solidjs/router';
import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';
import { Icon } from '../utils/Icon';
import { asClasses, useColorContext } from '../utils/ColorContext';

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
    <A href={props.href} end={true}>
      <div
        class="flex-none flex flex-row items-center"
        classList={{
          [baseClasses]: !match(),
          [selectedClasses]: !!match(),
        }}
      >
        <Icon icon={props.icon} />
        <div class="p-3 hidden md:inline-block">{props.text}</div>
      </div>
    </A>
  );
};
