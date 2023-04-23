import { Component, Show, createSignal } from 'solid-js';
import WordsSearchBar from './WordsSearchBar';
import WordsList from './WordsList';
import { WordProvider } from './WordContext';
import { createStore } from 'solid-js/store';
import {
  WordsSearchParams,
  defaultWordsSearchParams,
} from './wordsSearchParams';
import WordDetails from './WordDetails';

const WordsPage: Component = () => {
  const [wordsSearchParams, setSearchQuery] = createStore<WordsSearchParams>(
    defaultWordsSearchParams(),
  );

  return (
    <WordProvider>
      <div class="flex flex-col">
        <WordsSearchBar
          searchParams={wordsSearchParams}
          onSearchParamsChange={setSearchQuery}
        />
        <WordsList searchParams={wordsSearchParams} />
      </div>
    </WordProvider>
  );
};

export default WordsPage;
