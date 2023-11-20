import { IconTypes } from 'solid-icons';
import { BsTagFill } from 'solid-icons/bs';
import { IoShapes } from 'solid-icons/io';
import { Component, Switch, Match, For } from 'solid-js';
import { PartOfSpeech } from '../../../api/types/graphql';
import { partsOfSpeech, partsOfSpeechProps } from '../../common/partsOfSpeech';
import { DropdownMode } from './WordsSearchBar';
import { WordsSearchParams } from './wordsSearchParams';
import { Icon } from '../../common/Icon';

type WordSearchBarDropdownProps = {
  searchParams: WordsSearchParams;
  mode: DropdownMode;
  onFilterSelect: (
    filter: DropdownMode.PartsOfSpeech | DropdownMode.Topics,
  ) => void;
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
};

export const WordSearchBarDropdown: Component<WordSearchBarDropdownProps> = (
  props,
) => {
  //const [fetchTopics, topicsQuery] = createLazyQuery(GetTopicsDocument);

  return (
    <div class="absolute top-full z-10 flex w-full flex-col border-t-2 border-charcoal-300 bg-coolgray-200 text-spacecadet-300">
      <Switch>
        <Match when={props.mode === DropdownMode.Filters}>
          <WordSearchBarDropdownFilterItems
            onFilterSelect={props.onFilterSelect}
          />
        </Match>
        <Match when={props.mode === DropdownMode.PartsOfSpeech}>
          <WordSearchBarDropdownPosItems
            selectedPartsOfSpeech={props.searchParams.partsOfSpeech ?? []}
            onPartOfSpeechSelect={props.onPartOfSpeechSelect}
          />
        </Match>
      </Switch>
    </div>
  );
};

type WordSearchBarDropdownFilterItemsProps = {
  onFilterSelect: (
    filter: DropdownMode.PartsOfSpeech | DropdownMode.Topics,
  ) => void;
};

const WordSearchBarDropdownFilterItems: Component<
  WordSearchBarDropdownFilterItemsProps
> = (props) => {
  return (
    <>
      <WordSearchBarDropdownFilterItem
        icon={IoShapes}
        label={'part of speech'}
        onClick={() => props.onFilterSelect(DropdownMode.PartsOfSpeech)}
      />
      <WordSearchBarDropdownFilterItem
        icon={BsTagFill}
        label={'topics'}
        onClick={() => props.onFilterSelect(DropdownMode.Topics)}
      />
    </>
  );
};

type WordSearchBarDropdownFilterItemProps = {
  icon: IconTypes;
  label: string;
  onClick: () => void;
};

const WordSearchBarDropdownFilterItem: Component<
  WordSearchBarDropdownFilterItemProps
> = (props) => {
  return (
    <div class="flex flex-row items-center" onClick={props.onClick}>
      <Icon icon={props.icon} size="sm" />
      <div>{props.label}</div>
    </div>
  );
};

type WordSearchBarDropdownPosItemsProps = {
  selectedPartsOfSpeech: PartOfSpeech[];
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
};

const WordSearchBarDropdownPosItems: Component<
  WordSearchBarDropdownPosItemsProps
> = (props) => {
  return (
    <For each={partsOfSpeech}>
      {(pos) => (
        <WordSearchBarDropdownPosItem
          partOfSpeech={pos as PartOfSpeech}
          isSelected={props.selectedPartsOfSpeech.includes(pos)}
          onClick={() => props.onPartOfSpeechSelect(pos)}
        />
      )}
    </For>
  );
};

type WordSearchBarDropdownPosItemProps = {
  partOfSpeech: PartOfSpeech;
  isSelected: boolean;
  onClick: () => void;
};

const WordSearchBarDropdownPosItem: Component<
  WordSearchBarDropdownPosItemProps
> = (props) => {
  const partOfSpeechParams = partsOfSpeechProps[props.partOfSpeech];

  return (
    <div
      class="flex flex-row items-center p-2"
      classList={{ 'bg-coolgray-100': props.isSelected }}
      onClick={props.onClick}
    >
      <Icon icon={partOfSpeechParams.icon} size="sm" />
      <div class="p-1">{partOfSpeechParams.label}</div>
    </div>
  );
};

/*
type WordSearchBarDropdownPosItemsProps = {
  selectedPartsOfSpeech: PartOfSpeech[];
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
  onPartOfSpeechDeselect: (partOfSpeech: PartOfSpeech) => void;
};

const WordSearchBarDropdownPosItems: Component<
  WordSearchBarDropdownPosItemsProps
> = (props) => {
  return (
    <For each={partsOfSpeech}>
      {(pos) => (
        <WordSearchBarDropdownPosItem
          partOfSpeech={pos as PartOfSpeech}
          isSelected={props.selectedPartsOfSpeech.includes(pos)}
          onClick={() =>
            props.selectedPartsOfSpeech.includes(pos)
              ? props.onPartOfSpeechDeselect(pos)
              : props.onPartOfSpeechSelect(pos)
          }
        />
      )}
    </For>
  );
};

type WordSearchBarDropdownPosItemProps = {
  partOfSpeech: PartOfSpeech;
  isSelected: boolean;
  onClick: () => void;
};

const WordSearchBarDropdownPosItem: Component<
  WordSearchBarDropdownPosItemProps
> = (props) => {
  const partOfSpeechParams = partsOfSpeechParams[props.partOfSpeech];

  return (
    <div class="flex flex-row items-center" onClick={props.onClick}>
      <div class="text-spacecadet-300">
        <partOfSpeechParams.icon size="1.5rem" class="m-3" />
      </div>
      <div>{partOfSpeechParams.label}</div>
    </div>
  );
};
*/
