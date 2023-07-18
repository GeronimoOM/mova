import { Component, Show, createEffect, createSignal, on } from 'solid-js';
import WordsSearchBar from './WordsSearchBar/WordsSearchBar';
import WordsList from './WordsList';
import { createStore } from 'solid-js/store';
import {
  WordsSearchParams,
  defaultWordsSearchParams,
} from './WordsSearchBar/wordsSearchParams';
import WordDetails from './WordDetails';
import { useLanguageContext } from '../LanguageContext';

const WordsPage: Component = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [wordsSearchParams, setSearchQuery] = createStore<WordsSearchParams>(
    defaultWordsSearchParams(),
  );
  const [selectedWordId, setSelectedWordId] = createSignal<string | null>(null);
  const [showWordDetails, setShowWordDetails] = createSignal(false);

  const onOpenCreateWord = () => {
    setSelectedWordId(null);
    setShowWordDetails(true);
  };

  createEffect(
    on(selectedLanguageId, () => {
      setSelectedWordId(null);
    }),
  );

  createEffect(() => {
    if (selectedWordId()) {
      setShowWordDetails(true);
    } else {
      setShowWordDetails(false);
    }
  });

  return (
    <div class="flex flex-col w-full h-full items-stretch">
      <div class="flex-none">
        <WordsSearchBar
          searchParams={wordsSearchParams}
          onSearchParamsChange={setSearchQuery}
        />
      </div>
      <div class="flex-1 min-h-0 flex flex-col xl:flex-row">
        <div
          class="flex-none w-full min-h-0 overflow-y-scroll"
          classList={{
            'basis-full': !showWordDetails(),
            'basis-1/2': showWordDetails(),
          }}
        >
          <WordsList
            searchParams={wordsSearchParams}
            selectedWord={selectedWordId()}
            onSelectWord={setSelectedWordId}
            onOpenDetails={() => setShowWordDetails(true)}
          />
        </div>
        <Show when={showWordDetails()}>
          <div class="flex-none basis-1/2 min-h-0 overflow-y-scroll">
            <WordDetails
              selectedWordId={selectedWordId()}
              onWordSelect={setSelectedWordId}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default WordsPage;
