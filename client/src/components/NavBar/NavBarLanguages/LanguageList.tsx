import { Component, For } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';
import { LanguageListItem } from './LanguageListItem';
import { Action } from '../../common/ActionBar';
import { ColorContextType, ColorProvider } from '../../common/ColorContext';

export type Languages = LanguageFieldsFragment[];

export type LanguageListProps = {
  languages: Languages | undefined;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
  selectedAction: Action | null;
  actionLanguageId: string | null;
  onActionSelect: (
    action: Action | null,
    actionLanguageId: string | null,
  ) => void;
  isVertical: boolean;
  languageInput: string;
  onLanguageInput: (languageInput: string) => void;
  isLanguageInputValid: boolean;
  setLanguagesContainer: (elem: HTMLDivElement) => void;
};

export const LanguageList: Component<LanguageListProps> = (props) => {
  const colorContext: ColorContextType = {
    base: {
      backgroundColor: 'bg-charcoal-200',
      hoverBackgroundColor: 'hover:bg-charcoal-100',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
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
              selectedAction={
                language.id === props.actionLanguageId
                  ? props.selectedAction
                  : null
              }
              onActionSelect={(action) =>
                props.onActionSelect(action, language.id)
              }
              isVertical={props.isVertical}
              languageInput={props.languageInput}
              onLanguageInput={props.onLanguageInput}
              isLanguageInputValid={props.isLanguageInputValid}
            />
          )}
        </For>
      </div>
    </ColorProvider>
  );
};
