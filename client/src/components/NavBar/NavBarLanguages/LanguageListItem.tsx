import { Component, createSignal, Show } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';
import { LanguageInput } from './LanguageInput';
import { LanguageName } from './LanguageName';
import { ActionBar, Action } from '../../common/ActionBar';

export type LanguageListItemProps = {
  language: LanguageFieldsFragment;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
  selectedAction: Action | null;
  onActionSelect: (action: Action | null) => void;
  isVertical: boolean;
  languageInput: string;
  onLanguageInput: (languageInput: string) => void;
  isLanguageInputValid: boolean;
};

export const LanguageListItem: Component<LanguageListItemProps> = (props) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const isSelectedSaveAction = () =>
    props.selectedAction === Action.Create ||
    props.selectedAction === Action.Update;

  return (
    <div
      class="flex flex-row items-stretch"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Show
        when={
          props.selectedAction === Action.Create ||
          props.selectedAction === Action.Update
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

      <Show when={props.isVertical && (isHovered() || props.selectedAction)}>
        <ActionBar
          actions={[Action.Update, Action.Delete]}
          selectedAction={props.selectedAction}
          onActionSelect={props.onActionSelect}
          isSaveDisabled={isSelectedSaveAction() && !props.isLanguageInputValid}
        />
      </Show>
    </div>
  );
};
