import { useMatch, A } from '@solidjs/router';
import { IconTypes } from 'solid-icons';
import { Component } from 'solid-js';

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
        class="flex flex-row items-center"
        classList={{
          'bg-spacecadet': !!match(),
          'hover:backdrop-brightness-150 hover:text-spacecadet': !match(),
        }}
      >
        {<props.icon size="2rem" class="m-2" />}
        <div class="p-2 hidden md:inline-block">{props.text}</div>
      </div>
    </A>
  );
};

export default NavBarLink;
