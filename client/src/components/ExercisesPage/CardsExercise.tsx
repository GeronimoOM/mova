import { createLazyQuery } from '@merged/solid-apollo';
import { Component, Show, createEffect, createSignal } from 'solid-js';
import {
  GetWordsDocument,
  WordFieldsFragment,
  WordOrder,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import {
  ColorProvider,
  ColorContextType,
  asClasses,
  useColorContext,
} from '../common/ColorContext';
import {
  BiRegularRightArrow,
  BiRegularLeftArrow,
  BiRegularReset,
} from 'solid-icons/bi';
import { BsTranslate } from 'solid-icons/bs';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';

const N_WORDS = 30;

export const CardsExercise: Component = () => {
  const [selectedLanguageId] = useLanguageContext();
  const [fetchRandomWords, randomWordsQuery] =
    createLazyQuery(GetWordsDocument);
  const [wordIndex, setWordIndex] = createSignal(0);
  const [isRevealed, setIsRevealed] = createSignal(false);

  const words = () => randomWordsQuery()?.language!.words.items;
  const word = () => (words() ? words()![wordIndex()] : undefined);
  const hasPrevWord = () => wordIndex() > 0;
  const hasNextWord = () => wordIndex() < (words() ?? []).length - 1;

  const fetchWords = () => {
    if (selectedLanguageId()) {
      fetchRandomWords({
        variables: {
          languageId: selectedLanguageId()!,
          limit: N_WORDS,
          order: WordOrder.Random,
        },
        fetchPolicy: 'no-cache',
      });
      setIsRevealed(false);
      setWordIndex(0);
    }
  };

  createEffect(() => {
    fetchWords();
  });

  const toPrevWord = () => {
    setIsRevealed(false);
    setWordIndex((idx) => idx - 1);
  };
  const toNextWord = () => {
    setIsRevealed(false);
    setWordIndex((idx) => idx + 1);
  };

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
      <div class="flex flex-col items-center p-3">
        <Show when={word()}>
          <WordCard
            word={word()!}
            isRevealed={isRevealed()}
            onReveal={setIsRevealed}
            index={wordIndex()}
            total={words()?.length ?? 0}
          />
          <div class="flex flex-row gap-2 p-2">
            <Button icon={BiRegularReset} onClick={fetchWords} />
            <Button
              icon={BiRegularLeftArrow}
              onClick={toPrevWord}
              isDisabled={!hasPrevWord()}
            />
            <Button
              icon={BiRegularRightArrow}
              onClick={toNextWord}
              isDisabled={!hasNextWord()}
            />
          </div>
        </Show>
      </div>
    </ColorProvider>
  );
};

type WordCardProps = {
  word: WordFieldsFragment;
  isRevealed: boolean;
  onReveal: (isRevealed: boolean) => void;
  index: number;
  total: number;
};

const WordCard: Component<WordCardProps> = (props) => {
  const colorContext = useColorContext()!;
  const baseClasses = asClasses(
    colorContext.base?.textColor,
    colorContext.base?.backgroundColor,
    colorContext.base?.hoverTextColor,
    colorContext.base?.hoverBackgroundColor,
  );

  return (
    <div
      class={`relative flex h-[10rem] w-[20rem] cursor-pointer select-none items-center
    justify-center p-3 ${baseClasses}`}
      onClick={() => props.onReveal(!props.isRevealed)}
    >
      <div class="absolute left-3 top-2 text-sm">{`${props.index + 1}/${
        props.total
      }`}</div>
      <Show when={props.isRevealed}>
        <div class="absolute right-3 top-2">
          <Icon icon={BsTranslate} />
        </div>
      </Show>
      <div class="truncate text-lg">
        {props.isRevealed ? props.word.original : props.word.translation}
      </div>
    </div>
  );
};
