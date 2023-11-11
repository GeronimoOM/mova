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
      class="w-full flex flex-row items-center cursor-pointer select-none text-spacecadet-300"
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
      <div class="flex-[1_1_0%] p-3 truncate">{props.word.original}</div>
      <div class="flex-[2_1_0%] p-3 truncate">{props.word.translation}</div>
    </div>
  );
};

export const WordListItemLoading: Component = () => {
  return <div class="w-full h-12 icursor-none bg-coolgray-300 animate-pulse" />;
};
