import { Component, For } from 'solid-js';
import { PartOfSpeech } from '../../api/types/graphql';
import { partsOfSpeechProps } from '../common/partsOfSpeech';
import { Icon } from '../common/Icon';

export type PropertiesPosSelectProps = {
  selectedPos: PartOfSpeech;
  setSelectedPos: (selectedProperty: PartOfSpeech) => void;
};

export const PropertiesPosSelect: Component<PropertiesPosSelectProps> = (
  props,
) => {
  return (
    <div class="m-2 flex cursor-pointer flex-col items-center bg-spacecadet-300 text-white">
      <div class="flex flex-row justify-center ">
        <For each={Object.entries(partsOfSpeechProps)}>
          {([partOfSpeech, posProps]) => (
            <div
              class="flex flex-row items-center p-2 hover:bg-spacecadet-200"
              classList={{
                'bg-spacecadet-100': partOfSpeech === props.selectedPos,
              }}
              onClick={() => props.setSelectedPos(partOfSpeech as PartOfSpeech)}
            >
              <Icon icon={posProps.icon} size="sm" />
              <div class="hidden md:block">{posProps.labelShort}</div>
            </div>
          )}
        </For>
      </div>
      <div class="p-2 text-center md:hidden">
        {partsOfSpeechProps[props.selectedPos].label}
      </div>
    </div>
  );
};
