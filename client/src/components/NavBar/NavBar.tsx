import { A, useLocation, useNavigate } from '@solidjs/router';
import { Component, For, createEffect, createMemo } from 'solid-js';
import { AppRoute, getAppRouteMatch } from '../../routes';
import { createQuery } from '@merged/solid-apollo';
import { GetLanguagesDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../../store/LanguageContext';

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
          <div>
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
        <li>
          <div>
            <A href={AppRoute.Words} end={true}>
              Words
            </A>
          </div>
        </li>
        <li>
          <div>
            <A href={AppRoute.Properties} end={true}>
              Properties
            </A>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
