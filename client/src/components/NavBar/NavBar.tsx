import { A, useLocation, useNavigate } from '@solidjs/router';
import { Component, For, createEffect, createMemo } from 'solid-js';
import { AppRoute, getAppRouteMatch } from '../../routes';
import { createQuery } from '@merged/solid-apollo';
import { GetLanguagesDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';

const NavBar: Component = () => {
  const appRoute = createMemo(() => getAppRouteMatch(useLocation().pathname));
  const navigate = useNavigate();

  createEffect(() => {
    if (!appRoute()) {
      navigate(AppRoute.Words, { replace: true });
    }
  });

  const languagesQuery = createQuery(GetLanguagesDocument);
  const languages = () => languagesQuery()?.languages;

  const [selectedLanguage, setSelectedLanguage] = useLanguageContext();

  return (
    <nav class="flex flex-col h-full">
      <ul>
        <li>
          <div class="bg-pink-400">
            <ul>
              <For each={languages()} fallback={'Loading languages...'}>
                {(language) => (
                  <li onClick={() => setSelectedLanguage(language.id)}>
                    {language.name}{' '}
                    {selectedLanguage() === language.id ? '!' : ''}
                  </li>
                )}
              </For>
            </ul>
          </div>
        </li>
        <NavBarItem href={AppRoute.Words} text="Words" />
        <NavBarItem href={AppRoute.Properties} text="Properties" />
      </ul>
    </nav>
  );
};

type NavBarItemProps = {
  href: string;
  text: string;
};

const NavBarItem: Component<NavBarItemProps> = (props) => {
  return (
    <li>
      <div>
        <A href={props.href} end={true}>
          {props.text}
        </A>
      </div>
    </li>
  );
};

export default NavBar;
