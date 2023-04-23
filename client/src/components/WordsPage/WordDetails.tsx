import { Component, For, Suspense, createEffect, on } from 'solid-js';
import { useWordContext } from './WordContext';
import { createLazyQuery } from '@merged/solid-apollo';
import { GetWordDocument } from '../../api/types/graphql';
import { PropertyType } from '../../api/types/graphql';
import { TextPropertyValue } from '../../api/types/graphql';
import { OptionPropertyValue } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';

const WordDetails: Component = () => {
  const [selectedWord] = useWordContext();
  const [queryWord, wordQuery] = createLazyQuery(GetWordDocument);
  const word = () => wordQuery()?.word;

  createEffect(() => {
    if (selectedWord()) {
      queryWord({
        variables: {
          id: selectedWord()!,
        },
      });
    }
  });

  return (
    <div class="bg-lime-400">
      <Suspense fallback={'Loading word...'}>
        <p>{word()?.original}</p>
        <p>{word()?.translation}</p>
        <p>{word()?.partOfSpeech}</p>
        <For each={word()?.properties}>
          {(prop) => (
            <p>
              {prop.property.name}:{' '}
              {prop.property.type === PropertyType.Text
                ? (prop as TextPropertyValue).text
                : (prop as OptionPropertyValue).option.value}
            </p>
          )}
        </For>
      </Suspense>
    </div>
  );
};

export default WordDetails;
