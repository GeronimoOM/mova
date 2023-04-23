import { Component, For, Show, createEffect, createMemo } from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import { GetWordsDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { useWordContext } from './WordContext';
import { WordsSearchParams } from './wordsSearchParams';
import WordDetails from './WordDetails';

export type WordsListProps = {
  searchParams: WordsSearchParams;
};

const WordsList: Component<WordsListProps> = (props) => {
  const [language] = useLanguageContext();
  const [selectedWord, setSelectedWord] = useWordContext();

  const [fetchWordsPage, wordsPageQuery] = createLazyQuery(GetWordsDocument);
  const words = () => wordsPageQuery()?.language!.words.items;
  const hasMore = () => wordsPageQuery()?.language!.words.hasMore;
  const searchQuery = createMemo(() =>
    props.searchParams.query.length >= 3 ? props.searchParams.query : null,
  );

  createEffect(() => {
    if (language()) {
      fetchWordsPage({
        variables: {
          languageId: language()!,
          query: searchQuery(),
          partOfSpeech: props.searchParams.partOfSpeech,
          start: 0,
          limit: 2, // testing pagination
        },
      });
    }
  });

  const handleLoadMore = () => {
    fetchWordsPage({
      variables: {
        languageId: language()!,
        query: searchQuery(),
        partOfSpeech: props.searchParams.partOfSpeech,
        start: words()?.length ?? 0,
        limit: 2,
      },
      fetchPolicy: 'network-only',
    });
  };

  return (
    <>
      <For each={words()} fallback={'loading...'}>
        {(word) => (
          <span onClick={() => setSelectedWord(word.id)}>
            {word.original} - {word.translation}
            {selectedWord() === word.id ? '!' : ''}
          </span>
        )}
      </For>
      <Show when={hasMore()}>
        <button onClick={handleLoadMore}>Load more</button>
      </Show>
      <Show when={selectedWord()}>
        <WordDetails />
      </Show>
    </>
  );
};

export default WordsList;
