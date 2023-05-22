import { Component, For } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';
import LanguageListItem from './LanguageListItem';
import { LanguageAction } from './Languages';

export type Languages = LanguageFieldsFragment[];

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

const LanguageList: Component<LanguageListProps> = (props) => {
  return (
    <div
      class="flex-1 flex flex-row items-stretch scrollbar-hide overflow-x-scroll
      md:flex-col md:items-stretch md:overflow-x-clip md:min-h-0 md:overflow-y-scroll
      bg-charcoal-200"
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

export default LanguageList;
