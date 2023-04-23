import { Component } from 'solid-js';
import { WordsSearchParams } from './wordsSearchParams';
import { PartOfSpeech } from '../../api/types/graphql';

export type WordsSearchBarProps = {
  searchParams: WordsSearchParams;
  onSearchParamsChange: (searchParams: Partial<WordsSearchParams>) => void;
};

const WordsSearchBar: Component<WordsSearchBarProps> = (props) => {
  return (
    <>
      <input
        type="text"
        value={props.searchParams.query}
        onInput={(e) =>
          props.onSearchParamsChange({ query: e.currentTarget.value })
        }
      />
      <select
        value={props.searchParams.partOfSpeech ?? ''}
        onChange={(e) => {
          props.onSearchParamsChange({
            partOfSpeech: (e.currentTarget.value as PartOfSpeech) || null,
          });
        }}
      >
        <option value={''}>-</option>
        <option value={'Noun'}>Noun</option>
        <option value={'Verb'}>Verb</option>
      </select>
    </>
  );
};

export default WordsSearchBar;
