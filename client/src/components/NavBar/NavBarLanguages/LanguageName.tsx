import { Component } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';

export type LanguageNameProps = {
  language: LanguageFieldsFragment;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
};

const LanguageName: Component<LanguageNameProps> = (props) => (
  <div
    class="p-3 flex-auto hover:bg-charcoal-100 hover:text-spacecadet cursor-pointer transition-colors whitespace-nowrap md:truncate"
    classList={{
      'text-spacecadet': props.selectedLanguageId === props.language!.id,
    }}
    onClick={() => props.onLanguageSelect(props.language!.id)}
  >
    {props.language!.name}
  </div>
);

export default LanguageName;
