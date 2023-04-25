import { Component, Show, createEffect, createSignal, on } from 'solid-js';
import WordsSearchBar from './WordsSearchBar';
import WordsList from './WordsList';
import { createStore } from 'solid-js/store';
import {
  WordsSearchParams,
  defaultWordsSearchParams,
} from './wordsSearchParams';
import WordDetails from './WordDetails';
import { useLanguageContext } from '../LanguageContext';

const WordsPage: Component = () => {
  const [language] = useLanguageContext();

  const [wordsSearchParams, setSearchQuery] = createStore<WordsSearchParams>(
    defaultWordsSearchParams(),
  );
  const [selectedWord, setSelectedWord] = createSignal<string | null>(null);
  const [showWordDetails, setShowWordDetails] = createSignal(false);

  const handleCreateWordDetails = () => {
    setSelectedWord(null);
    setShowWordDetails(true);
  };

  createEffect(
    on(language, () => {
      setSelectedWord(null);
    }),
  );

  createEffect(() => {
    if (selectedWord()) {
      setShowWordDetails(true);
    } else {
      setShowWordDetails(false);
    }
  });

  return (
    <div class="flex flex-col h-full">
      <WordsSearchBar
        searchParams={wordsSearchParams}
        onSearchParamsChange={setSearchQuery}
      />
      <WordsList
        searchParams={wordsSearchParams}
        selectedWord={selectedWord()}
        setSelectedWord={setSelectedWord}
      />
      <button onClick={handleCreateWordDetails}>New</button>
      <Show when={showWordDetails()}>
        <WordDetails
          selectedWord={selectedWord()}
          setSelectedWord={setSelectedWord}
        />
      </Show>
    </div>
  );
};

export default WordsPage;
