import { Component, For, createSignal, Show } from 'solid-js';
import { GetLanguagesQuery } from '../../../api/types/graphql';
import {
  LanguageActionButtonsAction,
  LanguageActionButtons,
} from './LanguageActionButtons';
import { LanguageAction } from './NavBarLanguages';

export type Languages = GetLanguagesQuery['languages'];

export type Language = Languages extends Array<infer L> ? L : never;

export type LanguageListProps = {
  languages: Languages | undefined;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
  action: LanguageAction | null;
  actionLanguageId: string | null;
  onAction: (
    action: LanguageAction | null,
    actionLanguageId: string | null,
  ) => void;
  isVertical: boolean;
  languageInput: string;
  onLanguageInput: (languageInput: string) => void;
  isLanguageInputValid: boolean;
  setLanguagesContainer: (elem: HTMLDivElement) => void;
};

export const LanguageList: Component<LanguageListProps> = (props) => {
  return (
    <div
      class="flex-auto flex flex-row items-stretch scrollbar-hide overflow-x-scroll
      md:grow-0 md:flex-col md:items-stretch md:overflow-x-clip md:overflow-y-scroll
      backdrop-brightness-125"
      ref={props.setLanguagesContainer}
    >
      <For each={props.languages} fallback={'Loading languages...'}>
        {(language) => (
          <LanguageListItem
            language={language}
            selectedLanguageId={props.selectedLanguageId}
            onLanguageSelect={props.onLanguageSelect}
            action={
              language.id === props.actionLanguageId ? props.action : null
            }
            onActionSelect={(action) => props.onAction(action, language.id)}
            isVertical={props.isVertical}
            languageInput={props.languageInput}
            onLanguageInput={props.onLanguageInput}
            isLanguageInputValid={props.isLanguageInputValid}
          />
        )}
      </For>
    </div>
  );
};

export type LanguageListItemProps = {
  language: Language;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
  action: LanguageAction | null;
  onActionSelect: (action: LanguageAction | null) => void;
  isVertical: boolean;
  languageInput: string;
  onLanguageInput: (languageInput: string) => void;
  isLanguageInputValid: boolean;
};

export const LanguageListItem: Component<LanguageListItemProps> = (props) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const itemActions = (): LanguageActionButtonsAction[] =>
    !props.action ? selectActions() : confirmActions();
  const selectActions = (): LanguageActionButtonsAction[] => [
    { action: LanguageAction.Update },
    {
      action: LanguageAction.Delete,
    },
  ];
  const confirmActions = (): LanguageActionButtonsAction[] => [
    {
      action: props.action,
      isConfirm: true,
      isDisabled:
        props.action === LanguageAction.Update && !props.isLanguageInputValid,
    },
    { action: null },
  ];
  return (
    <div
      class="flex flex-row items-stretch"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Show
        when={
          props.action === LanguageAction.Create ||
          props.action === LanguageAction.Update
        }
        fallback={
          <LanguageName
            language={props.language}
            selectedLanguageId={props.selectedLanguageId}
            onLanguageSelect={props.onLanguageSelect}
          />
        }
      >
        <LanguageInput
          languageInput={props.languageInput}
          onLanguageInput={props.onLanguageInput}
        />
      </Show>

      <Show when={props.isVertical && (isHovered() || props.action)}>
        <LanguageActionButtons
          actions={itemActions()}
          onAction={props.onActionSelect}
        />
      </Show>
    </div>
  );
};

export type LanguageNameProps = {
  language: Language;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
};

const LanguageName: Component<LanguageNameProps> = (props) => (
  <div
    class="p-3 flex-auto hover:backdrop-brightness-150 hover:text-spacecadet cursor-pointer transition-colors whitespace-nowrap md:truncate"
    classList={{
      'text-spacecadet': props.selectedLanguageId === props.language!.id,
    }}
    onClick={() => props.onLanguageSelect(props.language!.id)}
  >
    {props.language!.name}
  </div>
);

export type LanguageInputProps = {
  languageInput: string;
  onLanguageInput: (name: string) => void;
  isDisabled?: boolean;
};

export const LanguageInput: Component<LanguageInputProps> = (props) => (
  <input
    type="text"
    class="p-3 w-full outline-none bg-inherit backdrop-brightness-125"
    value={props.languageInput}
    onInput={(e) => props.onLanguageInput(e.currentTarget.value)}
    disabled={props.isDisabled}
    spellcheck={false}
  />
);
