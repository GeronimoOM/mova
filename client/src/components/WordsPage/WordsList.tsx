import { Component, For, Show, createEffect, createSignal } from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import {
  GetWordsDocument,
  GetWordsQueryVariables,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { WordsSearchParams } from './WordsSearchBar/wordsSearchParams';
import { cache } from '../../api/cache';
import { WordListItemLoading, WordsListItem } from './WordsListItem';

const WORDS_PAGE_SIZE = 15;
const SEARCH_MIN_TERM = 3;

export type WordsListProps = {
  searchParams: WordsSearchParams;
  selectedWord: string | null;
  onSelectWord: (selectedWord: string | null) => void;
  onOpenDetails: () => void;
};

export const WordsList: Component<WordsListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [listEndRef, setListEndRef] = createSignal<
    HTMLDivElement | undefined
  >();
  const [isListEndVisible, setIsListEndVisible] = createSignal(false);

  const [fetchWordsPage, wordsPageQuery] = createLazyQuery(GetWordsDocument);

  const words = () => wordsPageQuery()?.language?.words.items;
  const nextCursor = () => wordsPageQuery()?.language?.words.nextCursor;
  const isSearch = () => props.searchParams.query.length >= SEARCH_MIN_TERM;
  const searchQuery = () => (isSearch() ? props.searchParams.query : null);

  const fetchWordsPageArgs = (): GetWordsQueryVariables => ({
    languageId: selectedLanguageId()!,
    query: searchQuery(),
    partsOfSpeech: props.searchParams.partsOfSpeech,
    topics: props.searchParams.topics,
    limit: WORDS_PAGE_SIZE,
  });

  createEffect(() => {
    if (selectedLanguageId()) {
      if (isSearch()) {
        cache.evict({
          id: `Language:${selectedLanguageId()!}`,
          fieldName: 'words:search',
        });
      }

      fetchWordsPage({
        variables: fetchWordsPageArgs(),
      });
    }
  });

  const observer = new IntersectionObserver(
    (entries) => setIsListEndVisible(entries[0].isIntersecting),
    { threshold: 1 },
  );

  createEffect(() => {
    if (listEndRef()) {
      observer.observe(listEndRef()!);
    }
  });

  createEffect(() => {
    if (isListEndVisible() && nextCursor() && !wordsPageQuery.loading) {
      onFetchMore();
    }
  });

  const onFetchMore = () => {
    fetchWordsPage({
      variables: {
        ...fetchWordsPageArgs(),
        cursor: nextCursor(),
      },
      fetchPolicy: 'network-only',
    });
  };

  return (
    <div class="mx-auto flex w-full max-w-[60rem] flex-col items-center gap-y-2 p-2">
      <For each={words()}>
        {(word) => (
          <WordsListItem
            word={word}
            selectedWord={props.selectedWord}
            setSelectedWord={props.onSelectWord}
          />
        )}
      </For>
      <Show when={wordsPageQuery.loading}>
        <For each={Array(15).fill(null)}>{() => <WordListItemLoading />}</For>
      </Show>
      <div ref={setListEndRef} />
    </div>
  );
};
