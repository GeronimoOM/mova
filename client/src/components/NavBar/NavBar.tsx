import {
  Component,
  Show,
  createEffect,
  createMemo,
  createSignal,
} from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import { BsTranslate } from 'solid-icons/bs';
import { FaSolidCircleNodes } from 'solid-icons/fa';
import { AppRoute, getAppRouteMatch } from '../../routes';
import NavBarLanguages from './NavBarLanguages/NavBarLanguages';
import NavBarLink from './NavBarLink';
import { createMediaQuery } from '@solid-primitives/media';

const NavBar: Component = () => {
  const appRoute = createMemo(() => getAppRouteMatch(useLocation().pathname));
  const navigate = useNavigate();
  const isVertical = createMediaQuery('(min-width: 768px)');

  const [isLanguagesActive, setIsLanguagesActive] = createSignal(false);

  createEffect(() => {
    if (!appRoute()) {
      navigate(AppRoute.Words, { replace: true });
    }
  });

  return (
    <nav
      class="flex flex-row items-center fixed bottom-0 w-full
      md:static md:flex-col md:items-stretch md:min-w-[16rem] md:max-w-[16rem] md:h-full md:overflow-x-hidden
      bg-charcoal text-gray-200 font-bold
    "
    >
      <Show when={!isLanguagesActive() || isVertical()}>
        <NavBarLink href={AppRoute.Words} icon={BsTranslate} text="Words" />
        <NavBarLink
          href={AppRoute.Properties}
          icon={FaSolidCircleNodes}
          text="Properties"
        />
      </Show>

      <NavBarLanguages
        isActive={isLanguagesActive()}
        setIsActive={setIsLanguagesActive}
        isVertical={isVertical()}
      />
    </nav>
  );
};

export default NavBar;
