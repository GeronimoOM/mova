import { Component, Show, createSignal } from 'solid-js';
import { BsTranslate } from 'solid-icons/bs';
import { FaSolidGear, FaSolidBrain } from 'solid-icons/fa';
import { ImStatsBars } from 'solid-icons/im';
import { AppRoute } from '../../routes';
import { Languages } from './NavBarLanguages/Languages';
import { NavBarItem } from './NavBarItem';
import { createMediaQuery } from '@solid-primitives/media';
import { ColorContextType, ColorProvider } from '../common/ColorContext';

export const NavBar: Component = () => {
  // const appRoute = createMemo(() => getAppRouteMatch(useLocation().pathname));
  // const navigate = useNavigate();
  const isVertical = createMediaQuery('(min-width: 768px)');

  const [isLanguagesActive, setIsLanguagesActive] = createSignal(false);

  // createEffect(() => {
  //   if (!appRoute()) {
  //     navigate(AppRoute.Words, { replace: true });
  //   }
  // });

  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-gray-100',
      backgroundColor: 'bg-charcoal-300',
      hoverTextColor: 'hover:text-spacecadet-300',
      hoverBackgroundColor: 'hover:bg-charcoal-100',
    },
    selected: {
      textColor: 'text-gray-100',
      backgroundColor: 'bg-spacecadet-300',
      hoverTextColor: 'hover:text-spacecadet-300',
    },
    disabled: {
      textColor: 'text-gray-500',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
      <nav
        class={`fixed bottom-0 flex w-full flex-row items-center overflow-hidden
        md:static md:h-full md:min-w-[14rem] md:max-w-[14rem] md:flex-col md:items-stretch
        ${colorContext.base?.textColor} ${colorContext.base?.backgroundColor} font-bold`}
      >
        <Show when={!isLanguagesActive() || isVertical()}>
          <NavBarItem href={AppRoute.Words} icon={BsTranslate} text="Words" />
          <NavBarItem
            href={AppRoute.Properties}
            icon={FaSolidGear}
            text="Properties"
          />
          <NavBarItem
            href={AppRoute.Exercises}
            icon={FaSolidBrain}
            text="Exercises"
          />
          <NavBarItem
            href={AppRoute.Statistics}
            icon={ImStatsBars}
            text="Statistics"
          />
        </Show>

        <Languages
          isActive={isLanguagesActive()}
          setIsActive={setIsLanguagesActive}
          isVertical={isVertical()}
        />
      </nav>
    </ColorProvider>
  );
};
