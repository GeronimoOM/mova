import { Component, createSignal, Show } from 'solid-js';
import { FaSolidMagnifyingGlass } from 'solid-icons/fa';
import { WordsSearchParams } from './wordsSearchParams';
//import { WordSearchBarFilterPills } from './WordSearchBarFilterPills';
import { WordSearchBarDropdown } from './WordSearchBarDropdown';
import { PartOfSpeech } from '../../../api/types/graphql';
import { Icon } from '../../common/Icon';
import { useColorContext } from '../../common/ColorContext';

export enum DropdownMode {
  Filters = 'filters',
  PartsOfSpeech = 'pos',
  Topics = 'topics',
}

export type WordsSearchBarProps = {
  searchParams: WordsSearchParams;
  onSearchParamsChange: (searchParams: Partial<WordsSearchParams>) => void;
};

export const WordsSearchBar: Component<WordsSearchBarProps> = (props) => {
  const [dropdownMode, setDropdownMode] = createSignal<DropdownMode | null>(
    null,
  );

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

  const { base: baseColors } = useColorContext()!;

  return (
    <div class="flex w-full max-w-2xl flex-row">
      <div
        class={`relative flex w-full flex-row items-center ${baseColors?.textColor} ${baseColors?.backgroundColor}`}
      >
        <Icon icon={FaSolidMagnifyingGlass} />
        {/* <WordSearchBarFilterPills
          dropdownMode={dropdownMode()}
          searchParams={props.searchParams}
          onFilterSelect={onFilterSelect}
        /> */}
        <input
          class="relative w-full bg-inherit p-3 outline-none placeholder:text-opacity-50"
          type="text"
          //ref={setInputElement}
          spellcheck={false}
          autoCapitalize="off"
          placeholder={'Search'}
          value={props.searchParams.query}
          onInput={(e) => onInputChange(e.currentTarget.value)}
          onChange={(e) => onInputChange(e.currentTarget.value)}
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
