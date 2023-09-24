import { Component } from 'solid-js';
import { LanguageFieldsFragment } from '../../../api/types/graphql';
import { asClasses, useColorContext } from '../../common/ColorContext';

export type LanguageNameProps = {
  language: LanguageFieldsFragment;
  selectedLanguageId: string | null;
  onLanguageSelect: (languageId: string) => void;
};

export const LanguageName: Component<LanguageNameProps> = (props) => {
  const isSelected = () => props.selectedLanguageId === props.language!.id;

  const { base: baseColors } = useColorContext()!;
  const baseClasses = asClasses(
    baseColors?.hoverTextColor,
    baseColors?.hoverBackgroundColor,
  );

  return (
    <div
      class="p-3 flex-auto cursor-pointer transition-colors whitespace-nowrap md:truncate"
      classList={{
        [baseClasses]: !isSelected(),
        'text-spacecadet-300': isSelected(),
      }}
      onClick={() => props.onLanguageSelect(props.language!.id)}
    >
      {props.language!.name}
    </div>
  );
};
