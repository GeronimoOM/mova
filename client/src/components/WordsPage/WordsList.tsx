import {
  Component,
  For,
  Show,
  createEffect,
  untrack,
  createSignal,
} from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import {
  GetWordsDocument,
  GetWordsQueryVariables,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { WordsSearchParams } from './WordsSearchBar/wordsSearchParams';
import { cache } from '../../api/client';
import WordsListItem from './WordsListItem';

export type WordsListProps = {
  searchParams: WordsSearchParams;
  selectedWord: string | null;
  onSelectWord: (selectedWord: string | null) => void;
  onOpenDetails: () => void;
};

const WordsList: Component<WordsListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [isCreateOpen, setIsCreateOpen] = createSignal(false);
  const [wordsContainer, setWordsContainer] = createSignal<
    HTMLDivElement | undefined
  >();

  const [fetchWordsPage, wordsPageQuery] = createLazyQuery(GetWordsDocument);

  const words = () => wordsPageQuery()?.language!.words.items;
  const hasMore = () => wordsPageQuery()?.language!.words.hasMore;
  const searchQuery = () =>
    props.searchParams.query.length >= 3 ? props.searchParams.query : null;
  const fetchWordsPageArgs = (): GetWordsQueryVariables => ({
    languageId: selectedLanguageId()!,
    query: searchQuery(),
    partsOfSpeech: props.searchParams.partsOfSpeech,
    topics: props.searchParams.topics,
  });

  createEffect(() => {
    if (selectedLanguageId()) {
      fetchWordsPage({
        variables: {
          ...fetchWordsPageArgs(),
          start: 0,
        },
      });
    }
  });

  createEffect(() => {
    if (
      searchQuery() ||
      props.searchParams.partsOfSpeech ||
      props.searchParams.topics
    ) {
      cache.evict({
        id: `Language:${untrack(selectedLanguageId)!}`,
        fieldName: 'words:search',
      });
    }
  });

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
      ref={setWordsContainer}
    >
      {/* <Show
        when={isCreateOpen()}
        fallback={
          <div class="sticky bottom-0 w-full flex flex-row justify-center bg-coolgray-300 outline outline-8 outline-alabaster">
            <PropertyActionBar
              actions={[PropertyAction.Create]}
              selectedAction={null}
              onActionSelect={onAction}
            />
          </div>
        }
      >
        <PropertyListItem
          property={null}
          partOfSpeech={props.partOfSpeech}
          selectedAction={PropertyAction.Create}
          onActionSelect={onAction}
          isSortable={false}
        />
      </Show> */}
      <For each={words()} fallback={'loading...'}>
        {(word) => (
          <WordsListItem
            word={word}
            selectedWord={props.selectedWord}
            setSelectedWord={props.onSelectWord}
          />
        )}
      </For>
      <Show when={hasMore()}>
        <button onClick={onFetchMore}>Load more</button>
      </Show>
    </div>
  );
};

export default WordsList;
