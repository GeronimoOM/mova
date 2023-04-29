import {
  Component,
  createSignal,
  Show,
  For,
  Setter,
  createEffect,
  batch,
} from 'solid-js';
import { createMutation, createQuery } from '@merged/solid-apollo';
import { createMediaQuery } from '@solid-primitives/media';
import { FaSolidEarthEurope } from 'solid-icons/fa';
import {
  RiSystemArrowDropDownLine,
  RiSystemArrowDropUpLine,
} from 'solid-icons/ri';
import {
  FaSolidFeatherPointed,
  FaSolidCircleXmark,
  FaSolidCirclePlus,
  FaSolidCircleMinus,
} from 'solid-icons/fa';
import {
  CreateLanguageDocument,
  DeleteLanguageDocument,
  GetLanguagesDocument,
  UpdateLanguageDocument,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import {
  updateCacheOnCreateLanguage,
  updateCacheOnDeleteLanguage,
} from '../../api/mutations';

export type NavBarLanguageControlProps = {
  isActive: boolean;
  setIsActive: Setter<boolean>;
};

enum Action {
  None,
  Create,
  Update,
  Delete,
}

const NavBarLanguageControl: Component<NavBarLanguageControlProps> = (
  props,
) => {
  const [selectedLanguageId, setSelectedLanguageId] = useLanguageContext();

  const [action, setAction] = createSignal(Action.None);
  const [languagesContainer, setLanguagesContainer] = createSignal<
    HTMLDivElement | undefined
  >();
  const [actionLanguageId, setActionLanguageId] = createSignal<string | null>(null);
  const [languageInput, setLanguageInput] = createSignal('');
  const canSaveLanguageInput = () => languageInput().length > 2;

  const languagesQuery = createQuery(GetLanguagesDocument);
  const languages = () => languagesQuery()?.languages;
  const selectedLanguage = () =>
    languages()?.find((language) => language.id === selectedLanguageId());
  const actionLanguage = () =>
    languages()?.find((language) => language.id === actionLanguageId());

  const isSmallScreen = createMediaQuery('(max-width: 768px)');

  const [createLanguage] = createMutation(CreateLanguageDocument);
  const [updateLanguage] = createMutation(UpdateLanguageDocument);
  const [deleteLanguage] = createMutation(DeleteLanguageDocument);

  createEffect(() => {
    if (props.isActive) {
      setAction(Action.None);
    }
  });

  createEffect(() => {
    switch (action()) {
      case Action.Create:
        return setLanguageInput('');
      case Action.Update:
      case Action.Delete:
        if (actionLanguage()) {
          return setLanguageInput(actionLanguage()!.name);
        }
    }
  });

  createEffect(() => {
    if (languages() && languagesContainer() && isSmallScreen()) {
      scrollToLanguageDiv(selectedLanguageId()!);
    }
  });

  const scrollToLanguageDiv = (selectedLanguage: string) => {
    const selectedLanguageIndex = languages()!.findIndex(
      (language) => language.id === selectedLanguage,
    );
    const selectedLanguageDiv = languagesContainer()?.childNodes.item(
      selectedLanguageIndex,
    ) as HTMLElement;
    if (selectedLanguageDiv) {
      languagesContainer()!.scrollLeft =
        selectedLanguageDiv.offsetLeft -
        languagesContainer()!.clientWidth / 2 +
        selectedLanguageDiv.clientWidth / 2;
    }
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguageId(language);
  };

  const handleAction = (act: Action, actionLanguageId?: string) => {
    setActionLanguageId(actionLanguageId ?? selectedLanguageId);

    if (action() !== act) {
      setAction(act);
    } else {
      switch (action()) {
        case Action.Create:
          return handleCreate();
        case Action.Update:
          return handleUpdate();
        case Action.Delete:
          return handleDelete();
      }
    }
  };

  const handleActionCancel = () => {
    setAction(Action.None);
  };

  const handleCreate = async () => {
    const { createLanguage: createdLanguage } = await createLanguage({
      variables: {
        input: {
          name: languageInput(),
        },
      },
      update: updateCacheOnCreateLanguage,
    });

    batch(() => {
      setAction(Action.None);
      setSelectedLanguageId(createdLanguage.id);
    });
  };

  const handleUpdate = async () => {
    await updateLanguage({
      variables: {
        input: {
          id: actionLanguageId()!,
          name: languageInput(),
        },
      },
    });

    setAction(Action.None);
  };

  const handleDelete = async () => {
    await deleteLanguage({
      variables: {
        id: actionLanguageId()!,
      },
      update: updateCacheOnDeleteLanguage,
    });
    batch(() => {
      setAction(Action.None);
      if (actionLanguageId() === selectedLanguageId()) {
        setSelectedLanguageId(null);
      }
    });
  };

  return (
    <>
      <div
        class="flex flex-row items-stretch hover:backdrop-brightness-150  hover:text-spacecadet cursor-pointer transition-colors"
        onClick={() => props.setIsActive((isOpen) => !isOpen)}
      >
        <FaSolidEarthEurope size="2rem" class="m-2" />
        <div class="flex-grow p-3 hidden md:block truncate">
          {selectedLanguage()?.name ?? 'Language'}
        </div>
        <div class="hidden md:block">
          <Show
            when={!props.isActive}
            fallback={<RiSystemArrowDropUpLine size="2rem" class="m-2" />}
          >
            <RiSystemArrowDropDownLine size="2rem" class="m-2" />
          </Show>
        </div>
      </div>

      <Show when={props.isActive}>
        <>
          <div
            class="flex flex-grow flex-row items-stretch scrollbar-hide overflow-x-scroll
            md:flex-grow-0 md:flex-col md:items-stretch md:overflow-x-clip md:overflow-y-scroll
            backdrop-brightness-125"
            ref={setLanguagesContainer}
          >
            <Show when={action() === Action.None}>
              <For each={languages()} fallback={'Loading languages...'}>
                {(language) => (
                  <div class='group flex flex-row'>
                    <div
                      class="p-3 flex-grow hover:backdrop-brightness-150 hover:text-spacecadet cursor-pointer transition-colors whitespace-nowrap md:truncate"
                      classList={{
                        'text-spacecadet': selectedLanguageId() === language.id,
                      }}
                      onClick={() => handleLanguageSelect(language.id)}
                    >
                      {language.name}
                    </div>
                      <div
                        class="cursor-pointer transition-colors hidden md:group-hover:block"
                        classList={{
                          'hover:backdrop-brightness-150 hover:text-spacecadet':
                            action() === Action.None ||
                            canSaveLanguageInput(),
                          'brightness-75':
                            action() === Action.Update &&
                            !canSaveLanguageInput(),
                          'text-mint hover:bg-mint':
                            action() === Action.Update &&
                            canSaveLanguageInput(),
                        }}
                        onClick={() => handleAction(Action.Update, language.id)}
                      >
                        <FaSolidFeatherPointed size="2rem" class="m-2" />
                      </div>

                      <div
                        class="hover:backdrop-brightness-150 hover:text-spacecadet cursor-pointer transition-colors hidden md:group-hover:block"
                        classList={{
                          'text-chilired hover:bg-chilired':
                            action() === Action.Delete,
                        }}
                        onClick={() => handleAction(Action.Delete, language.id)}
                      >
                        <FaSolidCircleXmark size="2rem" class="m-2" />
                      </div>
                  </div>
                )}
              </For>
            </Show>
            <Show when={action() !== Action.None}>
              <div class='group flex flex-row'>
                <input
                  type="text"
                  class="m-1 p-2 w-full outline-none bg-inherit backdrop-brightness-125"
                  value={languageInput()}
                  onInput={(e) => setLanguageInput(e.currentTarget.value)}
                  disabled={action() === Action.Delete}
                />
              </div>
            </Show>
          </div>

          <Show when={isSmallScreen()}>
            <Show when={[Action.None, Action.Create].includes(action())}>
              <div
                class="cursor-pointer transition-colors"
                classList={{
                  'hover:backdrop-brightness-150 hover:text-spacecadet':
                    action() === Action.None || canSaveLanguageInput(),
                  'brightness-75':
                    action() === Action.Create && !canSaveLanguageInput(),
                  'text-mint hover:bg-mint':
                    action() === Action.Create && canSaveLanguageInput(),
                }}
                onClick={() => handleAction(Action.Create)}
              >
                <FaSolidCirclePlus size="2rem" class="m-2" />
              </div>
            </Show>
            <Show
              when={
                selectedLanguageId() &&
                [Action.None, Action.Update].includes(action())
              }
            >
              <div
                class="cursor-pointer transition-colors"
                classList={{
                  'hover:backdrop-brightness-150 hover:text-spacecadet':
                    action() === Action.None || canSaveLanguageInput(),
                  'brightness-75':
                    action() === Action.Update && !canSaveLanguageInput(),
                  'text-mint hover:bg-mint':
                    action() === Action.Update && canSaveLanguageInput(),
                }}
                onClick={() => handleAction(Action.Update)}
              >
                <FaSolidFeatherPointed size="2rem" class="m-2" />
              </div>
            </Show>
            <Show
              when={
                selectedLanguageId() &&
                [Action.None, Action.Delete].includes(action())
              }
            >
              <div
                class="hover:backdrop-brightness-150 hover:text-spacecadet cursor-pointer transition-colors"
                classList={{
                  'text-chilired hover:bg-chilired':
                    action() === Action.Delete,
                }}
                onClick={() => handleAction(Action.Delete)}
              >
                <FaSolidCircleXmark size="2rem" class="m-2" />
              </div>
            </Show>
            <Show when={action() !== Action.None}>
              <div
                class="hover:backdrop-brightness-150 hover:text-spacecadet cursor-pointer transition-colors"
                onClick={handleActionCancel}
              >
                <FaSolidCircleMinus size="2rem" class="m-2" />
              </div>
            </Show>
          </Show>
        </>
      </Show>
      <></>
    </>
  );
};
export default NavBarLanguageControl;
