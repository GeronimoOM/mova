import { Component, createEffect, createSignal, Show } from 'solid-js';
import { IoSearch } from 'solid-icons/io';
import { WordsSearchParams } from './wordsSearchParams';
import { PartOfSpeech } from '../../api/types/graphql';
import { FaSolidBookmark, FaSolidShapes } from 'solid-icons/fa';
import { useKeyDownEvent } from '@solid-primitives/keyboard';

export type WordsSearchBarProps = {
  searchParams: WordsSearchParams;
  onSearchParamsChange: (searchParams: Partial<WordsSearchParams>) => void;
};

const KEY_FOCUS_SEARCHBAR = 's';
const CHAR_OPEN_DROPDOWN = ':';

const WordsSearchBar: Component<WordsSearchBarProps> = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  const [inputElement, setInputElement] = createSignal<
    HTMLInputElement | undefined
  >();
  const [isInputElementAnimated, setIsInputElementAnimated] =
    createSignal(false);

  const keyEvent = useKeyDownEvent();

  createEffect(() => {
    const event = keyEvent();
    if (event?.key === KEY_FOCUS_SEARCHBAR) {
      event.preventDefault();
      inputElement()!.focus();
      //setIsInputElementAnimated(true);
    }
  });

  const onSearchParamsChange = (text: string) => {
    if (text[text.length - 1] === CHAR_OPEN_DROPDOWN) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }

    props.onSearchParamsChange({ query: text });
  };

  return (
    <div class="relative w-full p-2 flex flex-row bg-coolgray-300 outline outline-charcoal-300 font-bold">
      <div class="bg-spacecadet text-coolgray-300">
        <IoSearch size="2rem" class="m-2" />
      </div>
      <div class="relative w-full flex flex-row items-center">
        <input
          class="relative w-full p-3 outline-none bg-coolgray-200 text-spacecadet 
        placeholder:text-spacecadet placeholder:text-opacity-50"
          classList={{ 'animate-flash': isInputElementAnimated() }}
          type="text"
          value={props.searchParams.query}
          onInput={(e) => onSearchParamsChange(e.currentTarget.value)}
          ref={setInputElement}
          spellcheck={false}
          placeholder={'Type : to add filter'}
          onKeyDown={(e) => e.stopPropagation()}
        />
        <Show when={isDropdownOpen()}>
          <WordSearchBarDropdown />
        </Show>
      </div>
      {/*
      <select
        value={props.searchParams.partOfSpeech ?? ''}
        onChange={(e) => {
          props.onSearchParamsChange({
            partOfSpeech: (e.currentTarget.value as PartOfSpeech) || null,
          });
        }}
      >
        <option value={''}>-</option>
        <option value={'Noun'}>Noun</option>
        <option value={'Verb'}>Verb</option>
      </select>
      */}
    </div>
  );
};

const WordSearchBarDropdown: Component = () => {
  return (
    <div class="absolute flex flex-col top-full w-full p-1 gap-y-1 bg-coolgray-200 text-spacecadet border-t-2 border-charcoal-300">
      <div class="flex flex-row items-center">
        <div>
          <FaSolidShapes size="1rem" class="m-2" />
        </div>
        <div class="p-1">
          <span class="px-1 mx-0.5 bg-spacecadet text-coolgray-100">p</span>art
          of speech
        </div>
      </div>
      <div class="flex flex-row items-center">
        <div>
          <FaSolidBookmark size="1rem" class="m-2" />
        </div>
        <div class="p-1">
          <span class="px-1 mx-0.5 bg-spacecadet text-coolgray-100">t</span>opic
        </div>
      </div>
    </div>
  );
};

export default WordsSearchBar;
