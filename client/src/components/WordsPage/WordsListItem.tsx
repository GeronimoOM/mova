import { Component } from 'solid-js';
import { WordFieldsFragment } from '../../api/types/graphql';
import { Icon } from '../common/Icon';
import { partsOfSpeechProps } from '../common/partsOfSpeech';

export type WordsListItemProps = {
  word: WordFieldsFragment;
  selectedWord: string | null;
  setSelectedWord: (selectedWord: string | null) => void;
};

export const WordsListItem: Component<WordsListItemProps> = (props) => {
  const isSelected = () => props.selectedWord === props.word.id;

  return (
    <div
      class="flex w-full cursor-pointer select-none flex-row items-center text-spacecadet-300"
      classList={{
        'bg-coolgray-300 hover:bg-coolgray-200': !isSelected(),
        'bg-spacecadet-300 text-white': isSelected(),
      }}
      onClick={() => props.setSelectedWord(props.word.id)}
    >
      <div class="flex-none p-1.5">
        <Icon
          icon={partsOfSpeechProps[props.word.partOfSpeech].icon}
          size="sm"
        />
      </div>
      <div class="flex-1 truncate p-3">{props.word.original}</div>
      <div class="flex-1 truncate p-3">{props.word.translation}</div>
    </div>
  );
};

export const WordListItemLoading: Component = () => {
  return <div class="icursor-none h-12 w-full animate-pulse bg-coolgray-300" />;
};
