import { Component } from 'solid-js';
import { ActionButton, Action } from '../common/ActionBar';
import {
  WordsSearchBar,
  WordsSearchBarProps,
} from './WordsSearchBar/WordsSearchBar';
import { ColorContextType, ColorProvider } from '../common/ColorContext';

type WordsPageHeader = WordsSearchBarProps & {
  isOpenCreateWord: boolean;
  onOpenCreateWord: () => void;
};

export const WordsPageHeader: Component<WordsPageHeader> = (props) => {
  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-coolgray-200',
      backgroundColor: 'bg-spacecadet-300',
      hoverTextColor: 'hover:text-spacecadet-300',
      hoverBackgroundColor: 'hover:bg-coolgray-200',
    },
    selected: {
      backgroundColor: 'bg-spacecadet-200',
      hoverTextColor: 'hover:text-spacecadet-300',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
      <div class="flex flex-row items-center justify-center gap-2 p-2">
        <WordsSearchBar
          searchParams={props.searchParams}
          onSearchParamsChange={props.onSearchParamsChange}
        />
        <ActionButton
          action={Action.Create}
          onActionSelect={props.onOpenCreateWord}
          isDisabled={props.isOpenCreateWord}
        />
      </div>
    </ColorProvider>
  );
};
