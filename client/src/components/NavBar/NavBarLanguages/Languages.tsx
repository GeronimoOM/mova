import {
  Component,
  createSignal,
  Show,
  Setter,
  createEffect,
  batch,
} from 'solid-js';
import { createMutation, createQuery } from '@merged/solid-apollo';
import { FaSolidEarthEurope } from 'solid-icons/fa';
import {
  RiSystemArrowDropDownLine,
  RiSystemArrowDropUpLine,
} from 'solid-icons/ri';
import {
  CreateLanguageDocument,
  DeleteLanguageDocument,
  GetLanguagesDocument,
  UpdateLanguageDocument,
} from '../../../api/types/graphql';
import { useLanguageContext } from '../../LanguageContext';
import {
  updateCacheOnCreateLanguage,
  updateCacheOnDeleteLanguage,
} from '../../../api/mutations';
import { NavBarIcon, NavBarToggleIcon } from '../NavBarIcon';
import LanguageActionButtons, {
  LanguageActionButtonsAction,
} from './LanguageActionButtons';
import LanguageList from './LanguageList';
import LanguageInput from './LanguageInput';

const MIN_LANGUAGE_NAME_LENGTH = 3;

export type NavBarLanguagesProps = {
  isActive: boolean;
  setIsActive: Setter<boolean>;
  isVertical: boolean;
};

export enum LanguageAction {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

const Languages: Component<NavBarLanguagesProps> = (props) => {
  const [selectedLanguageId, setSelectedLanguageId] = useLanguageContext();

  const [action, setAction] = createSignal<LanguageAction | null>(null);
  const [languagesContainer, setLanguagesContainer] = createSignal<
    HTMLDivElement | undefined
  >();
  const [actionLanguageId, setActionLanguageId] = createSignal<string | null>(
    null,
  );
  const [languageInput, setLanguageInput] = createSignal('');
  const isLanguageInputValid = () =>
    languageInput().length >= MIN_LANGUAGE_NAME_LENGTH;

  const languagesQuery = createQuery(GetLanguagesDocument);
  const languages = () => languagesQuery()?.languages;
  const selectedLanguage = () =>
    languages()?.find((language) => language.id === selectedLanguageId());
  const actionLanguage = () =>
    languages()?.find((language) => language.id === actionLanguageId());

  const [createLanguage] = createMutation(CreateLanguageDocument);
  const [updateLanguage] = createMutation(UpdateLanguageDocument);
  const [deleteLanguage] = createMutation(DeleteLanguageDocument);

  createEffect(() => {
    if (props.isActive) {
      setAction(null);
    }
  });

  createEffect(() => {
    if (!action() || action() === LanguageAction.Create) {
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
      case LanguageAction.Create:
        return setLanguageInput('');
      case LanguageAction.Update:
      case LanguageAction.Delete:
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

  const actions = (): LanguageActionButtonsAction[] =>
    !action() ? selectActions() : confirmActions();

  const selectActions = (): LanguageActionButtonsAction[] => [
    { action: LanguageAction.Create },
    ...(!props.isVertical && selectedLanguageId()
      ? [
          {
            action: LanguageAction.Update,
          },
          {
            action: LanguageAction.Delete,
          },
        ]
      : []),
  ];

  const confirmActions = (): LanguageActionButtonsAction[] => [
    ...(action() === LanguageAction.Create || !props.isVertical
      ? [
          {
            action: action(),
            isConfirm: true,
            isDisabled:
              (action() === LanguageAction.Create ||
                action() === LanguageAction.Update) &&
              !isLanguageInputValid(),
          },
          { action: null },
        ]
      : []),
  ];

  const onLanguageSelect = (languageId: string) => {
    setSelectedLanguageId(languageId);
  };

  const onAction = (
    newAction: LanguageAction | null,
    newActionLanguageId: string | null = null,
  ) => {
    if (
      newAction === LanguageAction.Update ||
      newAction === LanguageAction.Delete
    ) {
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

  const executeAction = (action: LanguageAction) => {
    switch (action) {
      case LanguageAction.Create:
        return executeCreate();
      case LanguageAction.Update:
        return executeUpdate();
      case LanguageAction.Delete:
        return executeDelete();
    }
  };

  const executeCreate = async () => {
    const { createLanguage: createdLanguage } = await createLanguage({
      variables: {
        input: {
          name: languageInput(),
        },
      },
      update: updateCacheOnCreateLanguage,
    });

    setAction(null);
    setSelectedLanguageId(createdLanguage.id);
  };

  const executeUpdate = async () => {
    await updateLanguage({
      variables: {
        input: {
          id: actionLanguageId()!,
          name: languageInput(),
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
      update: updateCacheOnDeleteLanguage,
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
    <div class="flex-auto max-w-full flex flex-row items-center md:flex-col md:items-stretch">
      <div
        class="flex-none flex flex-row items-stretch hover:bg-charcoal-100 hover:text-spacecadet cursor-pointer transition-colors"
        onClick={() => props.setIsActive((isActive) => !isActive)}
      >
        <NavBarIcon icon={FaSolidEarthEurope} />
        <div class="flex-auto p-3 hidden md:block truncate">
          {selectedLanguage()?.name ?? 'Language'}
        </div>
        <div class="hidden md:block">
          <NavBarToggleIcon
            offIcon={RiSystemArrowDropDownLine}
            onIcon={RiSystemArrowDropUpLine}
            isOn={props.isActive}
          />
        </div>
      </div>

      <Show when={props.isActive}>
        <Show when={!action() || props.isVertical}>
          <div class="min-w-0 min-h-0 flex-1 flex flex-row items-stretch md:flex-col">
            <LanguageList
              languages={languages()}
              selectedLanguageId={selectedLanguageId()}
              onLanguageSelect={onLanguageSelect}
              action={action()}
              actionLanguageId={actionLanguageId()}
              onAction={onAction}
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
          <Show
            when={
              props.isVertical ? action() === LanguageAction.Create : action()
            }
          >
            <div class="flex-1">
              <LanguageInput
                languageInput={languageInput()}
                onLanguageInput={setLanguageInput}
                isDisabled={action() === LanguageAction.Delete}
              />
            </div>
          </Show>

          <div class="flex-none">
            <LanguageActionButtons actions={actions()} onAction={onAction} />
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Languages;
