import {
  Component,
  createSignal,
  Show,
  Setter,
  createEffect,
  batch,
} from 'solid-js';
import { createQuery } from '@merged/solid-apollo';
import { FaSolidEarthEurope } from 'solid-icons/fa';
import {
  RiArrowsArrowDropDownLine,
  RiArrowsArrowDropUpLine,
} from 'solid-icons/ri';
import { GetLanguagesDocument } from '../../../api/types/graphql';
import { useLanguageContext } from '../../LanguageContext';
import {
  createLanguageMutation,
  deleteLanguageMutation,
  updateLanguageMutation,
} from '../../../api/mutations';
import { LanguageList } from './LanguageList';
import { LanguageInput } from './LanguageInput';
import { Icon, ToggleIcon } from '../../common/Icon';
import { ActionBar, Action } from '../../common/ActionBar';
import { v1 as uuid } from 'uuid';
import { DateTime } from 'luxon';

const MIN_LANGUAGE_NAME_LENGTH = 3;

export type NavBarLanguagesProps = {
  isActive: boolean;
  setIsActive: Setter<boolean>;
  isVertical: boolean;
};

export const Languages: Component<NavBarLanguagesProps> = (props) => {
  const [selectedLanguageId, setSelectedLanguageId] = useLanguageContext();

  const [action, setAction] = createSignal<Action | null>(null);
  const [languagesContainer, setLanguagesContainer] = createSignal<
    HTMLDivElement | undefined
  >();
  const [actionLanguageId, setActionLanguageId] = createSignal<string | null>(
    null,
  );
  const [languageInput, setLanguageInput] = createSignal('');
  const isLanguageInputValid = () =>
    languageInput().trim().length >= MIN_LANGUAGE_NAME_LENGTH;

  const languagesQuery = createQuery(GetLanguagesDocument);
  const languages = () => languagesQuery()?.languages;
  const selectedLanguage = () =>
    languages()?.find((language) => language.id === selectedLanguageId());
  const actionLanguage = () =>
    languages()?.find((language) => language.id === actionLanguageId());

  const [createLanguage] = createLanguageMutation();
  const [updateLanguage] = updateLanguageMutation();
  const [deleteLanguage] = deleteLanguageMutation();

  createEffect(() => {
    if (props.isActive) {
      setAction(null);
    }
  });

  createEffect(() => {
    if (!action() || action() === Action.Create) {
      setActionLanguageId(null);
    }
  });

  createEffect(() => {
    if (actionLanguageId()) {
      setLanguageInput(actionLanguage()?.name ?? '');
    } else {
      setLanguageInput('');
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
    if (
      languages() &&
      languagesContainer() &&
      !props.isVertical &&
      selectedLanguageId()
    ) {
      scrollToLanguageDiv();
    }
  });

  const actions = () => [
    Action.Create,
    ...(!props.isVertical && selectedLanguageId()
      ? [Action.Update, Action.Delete]
      : []),
  ];

  const onLanguageSelect = (languageId: string) => {
    setSelectedLanguageId(languageId);
  };

  const onActionSelect = (
    newAction: Action | null,
    newActionLanguageId: string | null = null,
  ) => {
    if (newAction === Action.Update || newAction === Action.Delete) {
      newActionLanguageId = newActionLanguageId ?? selectedLanguageId();
    }

    if (newActionLanguageId === actionLanguageId() && newAction === action()) {
      executeAction(action()!);
    } else {
      batch(() => {
        setAction(newAction);
        setActionLanguageId(newActionLanguageId);
      });
    }
  };

  const executeAction = (action: Action) => {
    switch (action) {
      case Action.Create:
        return executeCreate();
      case Action.Update:
        return executeUpdate();
      case Action.Delete:
        return executeDelete();
    }
  };

  const executeCreate = async () => {
    const { createLanguage: createdLanguage } = await createLanguage({
      variables: {
        input: {
          id: uuid(),
          name: languageInput().trim(),
          addedAt: DateTime.now().toSeconds(),
        },
      },
    });

    setAction(null);
    setSelectedLanguageId(createdLanguage.id);
  };

  const executeUpdate = async () => {
    await updateLanguage({
      variables: {
        input: {
          id: actionLanguageId()!,
          name: languageInput().trim(),
        },
      },
    });

    setAction(null);
  };

  const executeDelete = async () => {
    await deleteLanguage({
      variables: {
        id: actionLanguageId()!,
      },
    });

    setAction(null);
    if (actionLanguageId() === selectedLanguageId()) {
      setSelectedLanguageId(null);
    }
  };

  const scrollToLanguageDiv = () => {
    const selectedLanguageIndex = languages()!.findIndex(
      (language) => language.id === selectedLanguageId(),
    );
    const selectedLanguageDiv = languagesContainer()?.childNodes.item(
      selectedLanguageIndex,
    ) as HTMLElement;
    if (selectedLanguageDiv) {
      // center language div or set to beginning of language div if it's too large
      languagesContainer()!.scrollLeft = Math.min(
        selectedLanguageDiv.offsetLeft,
        selectedLanguageDiv.offsetLeft -
          languagesContainer()!.clientWidth / 2 +
          selectedLanguageDiv.clientWidth / 2,
      );
    }
  };

  return (
    <div class="flex max-w-full flex-auto flex-row items-center md:flex-col md:items-stretch">
      <div
        class="flex flex-none cursor-pointer flex-row items-stretch transition-colors hover:bg-charcoal-100 hover:text-spacecadet-300"
        onClick={() => props.setIsActive((isActive) => !isActive)}
      >
        <Icon icon={FaSolidEarthEurope} />
        <div class="hidden flex-auto truncate p-3 md:block">
          {selectedLanguage()?.name ?? 'Language'}
        </div>
        <div class="hidden md:block">
          <ToggleIcon
            offIcon={RiArrowsArrowDropDownLine}
            onIcon={RiArrowsArrowDropUpLine}
            isOn={props.isActive}
          />
        </div>
      </div>

      <Show when={props.isActive}>
        <Show when={!action() || props.isVertical}>
          <div class="flex min-h-0 min-w-0 flex-1 flex-row items-stretch md:flex-col">
            <LanguageList
              languages={languages()}
              selectedLanguageId={selectedLanguageId()}
              onLanguageSelect={onLanguageSelect}
              selectedAction={action()}
              actionLanguageId={actionLanguageId()}
              onActionSelect={onActionSelect}
              isVertical={props.isVertical}
              languageInput={languageInput()}
              onLanguageInput={setLanguageInput}
              isLanguageInputValid={isLanguageInputValid()}
              setLanguagesContainer={setLanguagesContainer}
            />
          </div>
        </Show>

        <div
          class="flex flex-row md:justify-center"
          classList={{
            'flex-1': Boolean(action() && !props.isVertical),
          }}
        >
          <Show when={props.isVertical ? action() === Action.Create : action()}>
            <div class="flex-1">
              <LanguageInput
                languageInput={languageInput()}
                onLanguageInput={setLanguageInput}
                isDisabled={action() === Action.Delete}
              />
            </div>
          </Show>

          <div class="flex-none">
            <ActionBar
              actions={actions()}
              selectedAction={
                props.isVertical
                  ? action() === Action.Create
                    ? Action.Create
                    : null
                  : action()
              }
              onActionSelect={onActionSelect}
              isSaveDisabled={
                action() === Action.Create && !isLanguageInputValid()
              }
            />
          </div>
        </div>
      </Show>
    </div>
  );
};
