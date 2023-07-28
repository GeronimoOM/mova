import {
  Component,
  For,
  createEffect,
  createSignal,
  Show,
} from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import {
  GetWordsDocument,
  GetWordsQueryVariables,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { WordsSearchParams } from './WordsSearchBar/wordsSearchParams';
import { cache } from '../../api/client';
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
  const hasMore = () => wordsPageQuery()?.language?.words.hasMore;
  const isSearch = () => props.searchParams.query.length >= SEARCH_MIN_TERM;
  const searchQuery = () => isSearch() ? props.searchParams.query : null;

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
        variables: {
          ...fetchWordsPageArgs(),
          start: 0,
        },
      });
    }
  });

  const observer = new IntersectionObserver(
    entries => setIsListEndVisible(entries[0].isIntersecting),
    { threshold: 1 }
  );

  createEffect(() => {
    if (listEndRef()) {
      observer.observe(listEndRef()!);
    }
  });

  createEffect(() => {
    if (isListEndVisible() && hasMore() && !wordsPageQuery.loading) {
      onFetchMore();
    }
  })

  const onFetchMore = () => {
    fetchWordsPage({
      variables: {
        ...fetchWordsPageArgs(),
        start: words()?.length ?? 0,
      },
      fetchPolicy: 'network-only',
    });
  };

  return (
    <div
      class="w-full max-w-[60rem] mx-auto p-2 gap-y-2 flex flex-col items-center"
    >
      <For each={words()}>
        {(word) => (
          <WordsListItem
            word={word}
            selectedWord={props.selectedWord}
            setSelectedWord={props.onSelectWord}
          />
        )}
      </For>
      {/* <Show when={wordsPageQuery.loading}>
        {new Array(15).fill(null).map(() => <WordListItemLoading />)}
      </Show> */}
      <div ref={setListEndRef}></div>
    </div>
  );
};
