import { useMatch, A } from '@solidjs/router';
import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';
import { NavBarIcon } from './NavBarIcon';

type NavBarLinkProps = {
  href: string;
  icon: IconTypes;
  text: string;
};

const NavBarLink: Component<NavBarLinkProps> = (props) => {
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
        {<NavBarIcon icon={props.icon} />}
        <div class="p-3 hidden md:inline-block">{props.text}</div>
      </div>
    </A>
  );
};

export default NavBarLink;
