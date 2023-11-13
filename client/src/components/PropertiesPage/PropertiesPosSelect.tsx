import { Component } from 'solid-js';
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
    <div class="m-2 flex flex-col items-center bg-spacecadet-300 text-white font-bold cursor-pointer">
      <div class="flex flex-row justify-center ">
        {Object.entries(partsOfSpeechProps).map(([partOfSpeech, posProps]) => (
          <div
            class="p-2 items-center flex flex-row hover:bg-spacecadet-200"
            classList={{
              'bg-spacecadet-100': partOfSpeech === props.selectedPos,
            }}
            onClick={() => props.setSelectedPos(partOfSpeech as PartOfSpeech)}
          >
            <Icon icon={posProps.icon} size="sm" />
            <div class="hidden md:block">{posProps.labelShort}</div>
          </div>
        ))}
      </div>
      <div class="md:hidden p-2 text-center">
        {partsOfSpeechProps[props.selectedPos].label}
      </div>
    </div>

  );
};
