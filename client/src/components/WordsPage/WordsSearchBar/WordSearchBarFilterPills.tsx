import { IconTypes } from 'solid-icons';
import { IoShapes } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { PartOfSpeech } from '../../../api/types/graphql';
import { partsOfSpeechParams } from '../../utils/partsOfSpeech';
import { DropdownMode } from './WordsSearchBar';
import { WordsSearchParams } from './wordsSearchParams';

type WordSearchBarFilterPillsProps = {
  dropdownMode: DropdownMode | null;
  searchParams: WordsSearchParams;
  onFilterSelect: (
    filter: DropdownMode.PartsOfSpeech | DropdownMode.Topics,
  ) => void;
};

const WordSearchBarFilterPills: Component<WordSearchBarFilterPillsProps> = (
  props,
) => {
  const hasFilters = () =>
    Boolean(
      props.searchParams.partsOfSpeech?.length ||
        props.searchParams.topics?.length,
    );

  return (
    <Show when={hasFilters()}>
      <div class="m-1 flex flex-row">
        <Show when={props.searchParams.partsOfSpeech?.length}>
          <WordSearchBarPosFilterPill
            dropdownMode={props.dropdownMode}
            partsOfSpeech={props.searchParams.partsOfSpeech!}
            onClick={() => props.onFilterSelect(DropdownMode.PartsOfSpeech)}
          />
        </Show>
      </div>
    </Show>
  );
};

type WordSearchBarPosFilterPillProps = {
  dropdownMode: DropdownMode | null;
  partsOfSpeech: PartOfSpeech[];
  onClick: () => void;
};

const WordSearchBarPosFilterPill: Component<WordSearchBarPosFilterPillProps> = (
  props,
) => {
  const icons = (): IconTypes[] => {
    if (props.partsOfSpeech.length === 1) {
      return [partsOfSpeechParams[props.partsOfSpeech[0]].icon];
    } else if (props.partsOfSpeech.length < 4) {
      return props.partsOfSpeech.map((pos) => partsOfSpeechParams[pos].icon);
    } else {
      return [IoShapes];
    }
  };
  const label = (): string | null => {
    if (props.partsOfSpeech.length === 1) {
      return partsOfSpeechParams[props.partsOfSpeech[0]].label;
    } else if (props.partsOfSpeech.length < 4) {
      return null;
    } else {
      return String(props.partsOfSpeech.length);
    }
  };

  return (
    <div
      class="flex flex-row items-center text-spacecadet outline outline-2 outline-spacecadet cursor-pointer"
      classList={{
        'bg-coolgray-100': props.dropdownMode === DropdownMode.PartsOfSpeech,
      }}
      onClick={props.onClick}
    >
      {icons().map((icon) => {
        return <Dynamic component={icon} size="1.5rem" class="m-2" />;
      })}
      <Show when={label()}>
        {' '}
        <div class="p-2">{label()}</div>
      </Show>
    </div>
  );
};

export default WordSearchBarFilterPills;
