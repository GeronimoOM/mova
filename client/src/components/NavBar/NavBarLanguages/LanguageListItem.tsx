import { Component, createSignal, Show } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';
import LanguageActionButtons, {
  LanguageActionButtonsAction,
} from './LanguageActionButtons';
import LanguageInput from './LanguageInput';
import LanguageName from './LanguageName';
import { LanguageAction } from './Languages';

export type LanguageListItemProps = {
  language: LanguageFieldsFragment;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
  action: LanguageAction | null;
  onActionSelect: (action: LanguageAction | null) => void;
  isVertical: boolean;
  languageInput: string;
  onLanguageInput: (languageInput: string) => void;
  isLanguageInputValid: boolean;
};

const LanguageListItem: Component<LanguageListItemProps> = (props) => {
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

export default LanguageListItem;
