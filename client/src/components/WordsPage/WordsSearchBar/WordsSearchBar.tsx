import { Component, createEffect, createSignal, Show } from 'solid-js';
import { FaSolidMagnifyingGlass } from 'solid-icons/fa';
import { useKeyDownEvent } from '@solid-primitives/keyboard';
import { WordsSearchParams } from './wordsSearchParams';
import { WordSearchBarFilterPills } from './WordSearchBarFilterPills';
import { WordSearchBarDropdown } from './WordSearchBarDropdown';
import { PartOfSpeech } from '../../../api/types/graphql';
import { Icon } from '../../utils/Icon';
import { useColorContext } from '../../utils/ColorContext';

export enum DropdownMode {
  Filters = 'filters',
  PartsOfSpeech = 'pos',
  Topics = 'topics',
}

const KEY_FOCUS_SEARCHBAR = 's';

const KEY_DROPDOWN_FILTERS = 'Semicolon';
const KEY_BACK = 'Backspace';
const KEY_TO_DROPDOWN_MODE: Record<string, DropdownMode> = {
  KeyP: DropdownMode.PartsOfSpeech,
  KeyT: DropdownMode.Topics,
};
const KEY_TO_PART_OF_SPEECH: Record<string, PartOfSpeech> = {
  KeyN: PartOfSpeech.Noun,
  KeyV: PartOfSpeech.Verb,
  KeyJ: PartOfSpeech.Adj,
  KeyD: PartOfSpeech.Adv,
  KeyP: PartOfSpeech.Pron,
  KeyM: PartOfSpeech.Misc,
};

export type WordsSearchBarProps = {
  searchParams: WordsSearchParams;
  onSearchParamsChange: (searchParams: Partial<WordsSearchParams>) => void;
};

export const WordsSearchBar: Component<WordsSearchBarProps> = (props) => {
  const [dropdownMode, setDropdownMode] = createSignal<DropdownMode | null>(
    null,
  );
  const [inputElement, setInputElement] = createSignal<
    HTMLInputElement | undefined
  >();

  // const keyEvent = useKeyDownEvent();

  // TODO extract keyboard logic
  // createEffect(() => {
  //   const event = keyEvent();
  //   if (event?.key === KEY_FOCUS_SEARCHBAR) {
  //     event.preventDefault();
  //     inputElement()!.focus();
  //   }
  // });

  const onPartOfSpeechSelect = (pos: PartOfSpeech) => {
    if (props.searchParams.partsOfSpeech.includes(pos)) {
      props.onSearchParamsChange({
        partsOfSpeech: props.searchParams.partsOfSpeech.filter(
          (p) => p !== pos,
        ),
      });
    } else {
      props.onSearchParamsChange({
        partsOfSpeech: [...props.searchParams.partsOfSpeech, pos],
      });
    }
  };

  const onInputChange = (text: string) => {
    props.onSearchParamsChange({ query: text });
  };

  // const onKeyDown = (code: string): boolean => {
  //   if (code === KEY_DROPDOWN_FILTERS) {
  //     setDropdownMode(DropdownMode.Filters);

  //     return false;
  //   } else {
  //     switch (dropdownMode()) {
  //       case null:
  //         return onDefaultKeyDown(code);
  //       case DropdownMode.Filters:
  //         return onFiltersKeyDown(code);
  //       case DropdownMode.PartsOfSpeech:
  //         return onPartsOfSpeechKeyDown(code);
  //     }
  //   }

  //   return true;
  // };

  // const onDefaultKeyDown = (code: string): boolean => {
  //   if (code === KEY_BACK && inputElement()?.selectionStart === 0) {
  //     if (props.searchParams.topics.length) {
  //       props.onSearchParamsChange({ topics: [] });
  //     } else if (props.searchParams.partsOfSpeech.length) {
  //       props.onSearchParamsChange({ partsOfSpeech: [] });
  //     }
  //     return false;
  //   }

  //   return true;
  // };

  const onFiltersKeyDown = (code: string): boolean => {
    const dropdownModeByKey = KEY_TO_DROPDOWN_MODE[code];
    if (dropdownModeByKey) {
      setDropdownMode(dropdownModeByKey);
      return false;
    } else if (code === KEY_BACK) {
      setDropdownMode(null);
      return false;
    }

    return true;
  };

  const onPartsOfSpeechKeyDown = (code: string): boolean => {
    const partOfSpeechByKey = KEY_TO_PART_OF_SPEECH[code];
    if (partOfSpeechByKey) {
      onPartOfSpeechSelect(partOfSpeechByKey);
      return false;
    } else if (code === KEY_BACK) {
      setDropdownMode(DropdownMode.Filters);
    }

    return true;
  };

  const onFilterSelect = (mode: DropdownMode) => {
    if (mode === dropdownMode()) {
      setDropdownMode(null);
    } else {
      setDropdownMode(mode);
    }
  };

  const { base: baseColors } = useColorContext()!;

  return (
    <div class="w-full max-w-2xl p-2 flex flex-row font-bold">
      <div
        class={`relative w-full flex flex-row items-center ${baseColors?.textColor} ${baseColors?.backgroundColor}`}
      >
        <Icon icon={FaSolidMagnifyingGlass} />
        <WordSearchBarFilterPills
          dropdownMode={dropdownMode()}
          searchParams={props.searchParams}
          onFilterSelect={onFilterSelect}
        />
        <input
          class="relative w-full p-3 outline-none bg-inherit placeholder:text-opacity-50"
          type="text"
          value={props.searchParams.query}
          ref={setInputElement}
          spellcheck={false}
          placeholder={'Type : to add filter'}
          onInput={(e) => onInputChange(e.currentTarget.value)}
          // onKeyDown={(e) => {
          //   const shouldChangeInput = onKeyDown(e.code);
          //   if (!shouldChangeInput) {
          //     e.preventDefault();
          //   }
          //   e.stopPropagation();
          // }}
        />
        <Show when={dropdownMode()}>
          <WordSearchBarDropdown
            searchParams={props.searchParams}
            mode={dropdownMode()!}
            onFilterSelect={(mode) => setDropdownMode(mode)}
            onPartOfSpeechSelect={onPartOfSpeechSelect}
          />
        </Show>
      </div>
    </div>
  );
};
