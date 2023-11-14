import { Component, Show, createEffect, createSignal, on } from 'solid-js';
import { WordsList } from './WordsList';
import { createStore } from 'solid-js/store';
import {
  WordsSearchParams,
  defaultWordsSearchParams,
} from './WordsSearchBar/wordsSearchParams';
import { WordDetails } from './WordDetails';
import { useLanguageContext } from '../LanguageContext';
import { WordsPageHeader } from './WordsPageHeader';

export const WordsPage: Component = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [searchParams, setSearchParams] = createStore<WordsSearchParams>(
    defaultWordsSearchParams(),
  );
  const [selectedWordId, setSelectedWordId] = createSignal<string | null>(null);
  const [isWordDetailsOpen, setIsWordDetailsOpen] = createSignal(false);
  const isOpenCreateWord = () => isWordDetailsOpen() && !selectedWordId();

  const onOpenCreateWord = (isOpen: boolean) => {
    setSelectedWordId(null);
    setIsWordDetailsOpen(isOpen);
    setSearchParams(defaultWordsSearchParams());
  };

  const onWordSelect = (selectedWordId: string | null) => {
    setSelectedWordId(selectedWordId);
    setIsWordDetailsOpen(!!selectedWordId);
  };

  createEffect(
    on(selectedLanguageId, () => {
      setSelectedWordId(null);
    }),
  );

  return (
    <div class="flex flex-col w-full h-full items-stretch">
      <div class="flex-none">
        <WordsPageHeader
          searchParams={searchParams}
          onSearchParamsChange={setSearchParams}
          onOpenCreateWord={() => onOpenCreateWord(true)}
          isOpenCreateWord={isOpenCreateWord()}
        />
      </div>
      <div class="flex-1 min-h-0 flex flex-col xl:flex-row gap-2">
        <div
          class="flex-none w-full min-h-0 overflow-y-scroll"
          classList={{
            'basis-full': !isWordDetailsOpen(),
            'basis-1/2': isWordDetailsOpen(),
          }}
        >
          <WordsList
            searchParams={searchParams}
            selectedWord={selectedWordId()}
            onSelectWord={onWordSelect}
            onOpenDetails={() => setIsWordDetailsOpen(true)}
          />
        </div>
        <Show when={isWordDetailsOpen()}>
          <div class="flex-none basis-1/2 min-h-0 overflow-y-scroll">
            <WordDetails
              selectedWordId={selectedWordId()}
              onWordSelect={onWordSelect}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
