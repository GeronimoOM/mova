import { Component } from 'solid-js';
import { WordFieldsFragment } from '../../api/types/graphql';

export type WordsListItemProps = {
  word: WordFieldsFragment;
  selectedWord: string | null;
  setSelectedWord: (selectedWord: string | null) => void;
};

const WordsListItem: Component<WordsListItemProps> = (props) => {
  return (
    <div
      class="w-full p-3 bg-coolgray-300 text-spacecadet "
      onClick={() => props.setSelectedWord(props.word.id)}
    >
      {props.word.original} - {props.word.translation}
      {props.selectedWord === props.word.id ? '!' : ''}
    </div>
  );
};

export default WordsListItem;
