import { Component, For, Show, createSignal } from 'solid-js';
import { PartOfSpeech } from '../../api/types/graphql';
import { IoShapes } from 'solid-icons/io';
import { Icon } from '../common/Icon';
import { partsOfSpeech, partsOfSpeechProps } from '../common/partsOfSpeech';
import { asClasses, useColorContext } from '../common/ColorContext';

type WordDetailsPosSelectProps = {
  selectedPartOfSpeech: PartOfSpeech | null;
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
  isDisabled?: boolean;
};

export const WordDetailsPosSelect: Component<WordDetailsPosSelectProps> = (
  props,
) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const onPartOfSpeechSelect = (partOfSpeech: PartOfSpeech) => {
    setIsOpen(false);
    props.onPartOfSpeechSelect(partOfSpeech);
  };

  return (
    <div class="relative w-[7rem] select-none">
      <WordDetailsPosSelectItem
        partOfSpeech={props.selectedPartOfSpeech}
        onSelect={() => setIsOpen(!isOpen())}
        isDisabled={props.isDisabled}
      />

      <Show when={isOpen()}>
        <div class={`absolute flex flex-col top-full w-full`}>
          <For each={partsOfSpeech}>
            {(partOfSpeech) => (
              <WordDetailsPosSelectItem
                partOfSpeech={partOfSpeech}
                onSelect={() => onPartOfSpeechSelect(partOfSpeech)}
                isDisabled={props.isDisabled}
              />
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};

type WordDetailsPosSelectItem = {
  partOfSpeech: PartOfSpeech | null;
  onSelect: () => void;
  isDisabled?: boolean;
};

const WordDetailsPosSelectItem: Component<WordDetailsPosSelectItem> = (
  props,
) => {
  const partOfSpeechIcon = () =>
    props.partOfSpeech ? partsOfSpeechProps[props.partOfSpeech].icon : IoShapes;
  const label = () =>
    props.partOfSpeech
      ? partsOfSpeechProps[props.partOfSpeech].labelShort
      : props.isDisabled
      ? ''
      : 'PoS';

  const { base: baseColors, active: activeColors } = useColorContext()!;
  const activeClasses = asClasses(
    activeColors?.textColor,
    activeColors?.backgroundColor,
    baseColors?.hoverTextColor,
    baseColors?.hoverBackgroundColor,
    'cursor-pointer',
  );

  const onClick = () => !props.isDisabled && props.onSelect();

  return (
    <div
      class="flex flex-row items-center p-1.5"
      classList={{
        [activeClasses]: !props.isDisabled,
      }}
      onClick={onClick}
    >
      <Icon icon={partOfSpeechIcon()} size="sm" />
      <div class="flex-1 flex flex-row justify-center">
        <p class="p-1">{label()}</p>
      </div>
    </div>
  );
};
