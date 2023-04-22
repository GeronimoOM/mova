import { Component, For, createEffect } from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import { GetWordsDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../../store/LanguageContext';

const WordsList: Component = () => {
  const [language] = useLanguageContext();

  const [getWords, wordsQuery] = createLazyQuery(GetWordsDocument);
  const words = () => wordsQuery()?.language!.words.items;

  createEffect(() => {
    if (language()) {
      getWords({
        variables: {
          languageId: language()!,
        },
      });
    }
  });

  return (
    <For each={words()} fallback={'loading...'}>
      {(word: any) => (
        <span>
          {word.original} - {word.translation}
        </span>
      )}
    </For>
  );
};

export default WordsList;
