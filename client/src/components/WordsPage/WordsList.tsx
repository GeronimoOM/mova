import {
  Component,
  For,
  Show,
  createEffect,
  createMemo,
  untrack,
} from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import {
  GetWordsDocument,
  GetWordsQueryVariables,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { WordsSearchParams } from './wordsSearchParams';
import { cache } from '../../api/client';

export type WordsListProps = {
  searchParams: WordsSearchParams;
  selectedWord: string | null;
  setSelectedWord: (selectedWord: string | null) => void;
};

const WordsList: Component<WordsListProps> = (props) => {
  const [language] = useLanguageContext();

  const [fetchWordsPage, wordsPageQuery] = createLazyQuery(GetWordsDocument);

  const words = () => wordsPageQuery()?.language!.words.items;
  const hasMore = () => wordsPageQuery()?.language!.words.hasMore;
  const searchQuery = () =>
    props.searchParams.query.length >= 3 ? props.searchParams.query : null;
  const fetchWordsPageArgs = (): GetWordsQueryVariables => ({
    languageId: language()!,
    query: searchQuery(),
    partOfSpeech: props.searchParams.partOfSpeech,
    topic: props.searchParams.topic,
  });

  createEffect(() => {
    if (language()) {
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
      props.searchParams.partOfSpeech ||
      props.searchParams.topic
    ) {
      cache.evict({
        id: `Language:${untrack(language)!}`,
        fieldName: 'words:search',
      });
    }
  });

  const handleFetchMore = () => {
    fetchWordsPage({
      variables: {
        ...fetchWordsPageArgs(),
        start: words()?.length ?? 0,
      },
      fetchPolicy: 'network-only',
    });
  };

  return (
    <>
      <For each={words()} fallback={'loading...'}>
        {(word) => (
          <span onClick={() => props.setSelectedWord(word.id)}>
            {word.original} - {word.translation}
            {props.selectedWord === word.id ? '!' : ''}
          </span>
        )}
      </For>
      <Show when={hasMore()}>
        <button onClick={handleFetchMore}>Load more</button>
      </Show>
    </>
  );
};

export default WordsList;
