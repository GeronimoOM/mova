import { createLazyQuery } from '@merged/solid-apollo'
import { Component, Show, createEffect, createSignal } from 'solid-js'
import { GetWordsDocument, WordFieldsFragment, WordOrder } from '../../api/types/graphql'
import { useLanguageContext } from '../LanguageContext'
import { ColorProvider, ColorContextType, asClasses, useColorContext } from '../utils/ColorContext';
import { Icon } from '../utils/Icon';
import { BiRegularRightArrow, BiRegularLeftArrow } from 'solid-icons/bi'
import { Button } from '../utils/Button';

const N_WORDS = 30;

export const CardsExercise: Component = () => {
  const [selectedLanguageId] = useLanguageContext();
  const [fetchRandomWords, randomWordsQuery] = createLazyQuery(GetWordsDocument);
  const [wordIndex, setWordIndex] = createSignal(0);

  const words = () => randomWordsQuery()?.language!.words.items;
  const word = () => words() ? words()![wordIndex()] : undefined;
  const hasPrevWord = () => wordIndex() > 0;
  const hasNextWord = () => wordIndex() < (words() ?? []).length - 1;

  createEffect(() => {
    if (selectedLanguageId()) {
      fetchRandomWords({
        variables: {
          languageId: selectedLanguageId()!,
          limit: N_WORDS,
          order: WordOrder.Random,
        },
      });
    }
  });

  const toPrevWord = () => setWordIndex((idx) => idx - 1);
  const toNextWord = () => setWordIndex((idx) => idx + 1);

  const colorContext: ColorContextType = {
    base: {
      textColor: 'text-gray-100',
      backgroundColor: 'bg-spacecadet-300',
      hoverTextColor: 'hover:text-gray-100',
      hoverBackgroundColor: 'hover:bg-spacecadet-100',
    },
    disabled: {
      textColor: 'text-gray-500',
    },
  };

  return (
    <ColorProvider colorContext={colorContext}>
      <div class='flex flex-col items-center p-3'>
        <Show when={word()}>
          <WordCard word={word()!}/>
          <div class='p-2 gap-2 flex flex-row'>
            <Button icon={BiRegularLeftArrow}
              onClick={toPrevWord}
              isDisabled={!hasPrevWord()}
            />
            <Button icon={BiRegularRightArrow}
              onClick={toNextWord}
              isDisabled={!hasNextWord()}
            />
          </div>
        </Show>
      </div>
    </ColorProvider>
  )
}

type WordCardProps = {
  word: WordFieldsFragment;
}

const WordCard: Component<WordCardProps> = (props) => {
  const [isRevealed, setIsRevealed] = createSignal(false);

  const colorContext = useColorContext()!;
  const baseClasses = asClasses(
    colorContext.base?.textColor,
    colorContext.base?.backgroundColor,
    colorContext.base?.hoverTextColor,
    colorContext.base?.hoverBackgroundColor,
  );

  return (
    <div class={`${baseClasses} min-w-[20rem] min-h-[10rem] flex items-center justify-center`}
      onClick={() => setIsRevealed((isRevealed) => !isRevealed)}
    >
      <p>{isRevealed() ? props.word.original : props.word.translation}</p>
    </div>
  );
}
