import { Component, For, createEffect } from 'solid-js';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import {
  CreateWordDocument,
  CreateWordMutation,
  GetWordDocument,
  GetWordsDocument,
  LanguageWordsFragmentDoc,
  PartOfSpeech,
  Word,
} from '../../api/types/graphql';
import { PropertyType } from '../../api/types/graphql';
import { TextPropertyValue } from '../../api/types/graphql';
import { OptionPropertyValue } from '../../api/types/graphql';
import { createStore, produce } from 'solid-js/store';
import { useLanguageContext } from '../LanguageContext';
import { updateCacheOnCreateWord } from '../../api/mutations';

export type WordDetailsProps = {
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
};

enum WordDetailsMode {
  Update = 'update',
  Create = 'create',
}

const WordDetails: Component<WordDetailsProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [word, setWord] = createStore<Partial<Word>>({});

  const [fetchSelectedWord, selectedWordQuery] =
    createLazyQuery(GetWordDocument);
  const [createWord, createdWordMutation] = createMutation(CreateWordDocument);

  const selectedWord = () => selectedWordQuery()?.word;
  const mode = () =>
    props.selectedWord ? WordDetailsMode.Update : WordDetailsMode.Create;
  const createdWord = () => createdWordMutation()?.createWord;

  const onCreateWord = () => {
    createWord({
      variables: {
        input: {
          languageId: selectedLanguageId()!,
          original: word.original!,
          translation: word.translation!,
          partOfSpeech: PartOfSpeech.Noun, // TODO
        },
      },
      update: updateCacheOnCreateWord,
    });
  };

  createEffect(() => {
    if (props.selectedWord) {
      fetchSelectedWord({
        variables: {
          id: props.selectedWord,
        },
      });
    } else {
      setWord(
        produce((word) => {
          word = {};
        }),
      );
    }
  });

  createEffect(() => {
    if (selectedWord()) {
      const { original, translation } = selectedWord()!;
      setWord({ original, translation });
    }
  });

  createEffect(() => {
    if (createdWord()) {
      props.setSelectedWord(createdWord()!.id);
    }
  });

  return (
    <div class="m-2">
      <input
        type="text"
        value={word.original ?? ''}
        onInput={(e) => setWord({ original: e.currentTarget.value })}
      />
      <input
        type="text"
        value={word.translation ?? ''}
        onInput={(e) => setWord({ translation: e.currentTarget.value })}
      />
      <p>{word.partOfSpeech}</p>
      <For each={word.properties}>
        {(prop) => (
          <p>
            {prop.property.name}:{' '}
            {prop.property.type === PropertyType.Text
              ? (prop as TextPropertyValue).text
              : (prop as OptionPropertyValue).option.value}
          </p>
        )}
      </For>
      <button onClick={onCreateWord}>
        {mode() === WordDetailsMode.Create ? 'Add' : 'Edit'}
      </button>
    </div>
  );
};

export default WordDetails;
