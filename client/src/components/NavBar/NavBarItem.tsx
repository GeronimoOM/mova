import { useMatch, A } from '@solidjs/router';
import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';
import { Icon } from '../utils/Icon';

type NavBarItemProps = {
  href: string;
  icon: IconTypes;
  text: string;
};

const NavBarItem: Component<NavBarItemProps> = (props) => {
  const match = useMatch(() => props.href);

  return (
    <A href={props.href} end={true}>
      <div
        class="flex-none flex flex-row items-center"
        classList={{
          'bg-spacecadet': !!match(),
          'hover:bg-charcoal-100 hover:text-spacecadet': !match(),
        }}
      >
        <Icon icon={props.icon} />
        <div class="p-3 hidden md:inline-block">{props.text}</div>
      </div>
    </A>
  );
};

export default NavBarItem;
