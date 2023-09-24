import { IconTypes } from 'solid-icons';
import { IoShapes } from 'solid-icons/io';
import { Component, Show } from 'solid-js';
import { PartOfSpeech } from '../../../api/types/graphql';
import { partsOfSpeechProps } from '../../common/partsOfSpeech';
import { DropdownMode } from './WordsSearchBar';
import { WordsSearchParams } from './wordsSearchParams';
import { Icon } from '../../common/Icon';

type WordSearchBarFilterPillsProps = {
  dropdownMode: DropdownMode | null;
  searchParams: WordsSearchParams;
  onFilterSelect: (
    filter: DropdownMode.PartsOfSpeech | DropdownMode.Topics,
  ) => void;
};

export const WordSearchBarFilterPills: Component<
  WordSearchBarFilterPillsProps
> = (props) => {
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

export const WordSearchBarPosFilterPill: Component<
  WordSearchBarPosFilterPillProps
> = (props) => {
  const icons = (): IconTypes[] => {
    if (props.partsOfSpeech.length === 1) {
      return [partsOfSpeechProps[props.partsOfSpeech[0]].icon];
    } else if (props.partsOfSpeech.length < 4) {
      return props.partsOfSpeech.map((pos) => partsOfSpeechProps[pos].icon);
    } else {
      return [IoShapes];
    }
  };
  const label = (): string | null => {
    if (props.partsOfSpeech.length === 1) {
      return partsOfSpeechProps[props.partsOfSpeech[0]].labelShort;
    } else if (props.partsOfSpeech.length < 4) {
      return null;
    } else {
      return String(props.partsOfSpeech.length);
    }
  };

  return (
    <div
      class="flex flex-row items-center text-spacecadet-300 outline outline-2 outline-spacecadet-300 cursor-pointer"
      classList={{
        'bg-coolgray-100': props.dropdownMode === DropdownMode.PartsOfSpeech,
      }}
      onClick={props.onClick}
    >
      {icons().map((icon) => {
        return <Icon icon={icon} size="sm" />;
      })}
      <Show when={label()}>
        <div class="p-2">{label()}</div>
      </Show>
    </div>
  );
};
