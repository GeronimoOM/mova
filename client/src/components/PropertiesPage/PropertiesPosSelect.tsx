import { Component } from 'solid-js';
import { PartOfSpeech } from '../../api/types/graphql';
import { partsOfSpeechProps } from '../utils/partsOfSpeech';
import { Icon } from '../utils/Icon';

export type PropertiesPosSelectProps = {
  selectedPos: PartOfSpeech;
  setSelectedPos: (selectedProperty: PartOfSpeech) => void;
};

export const PropertiesPosSelect: Component<PropertiesPosSelectProps> = (
  props,
) => {
  return (
    <div class="my-2 flex flex-row justify-center text-spacecadet-300 font-bold cursor-pointer">
      {Object.entries(partsOfSpeechProps).map(([partOfSpeech, posProps]) => (
        <div
          class="p-2 items-center flex flex-row hover:bg-spacecadet-300 hover:text-white"
          classList={{
            'bg-spacecadet-300 text-white': partOfSpeech === props.selectedPos,
          }}
          onClick={() => props.setSelectedPos(partOfSpeech as PartOfSpeech)}
        >
          <Icon icon={posProps.icon} size="sm" />
          <div class="hidden md:block">{posProps.labelShort}</div>
        </div>
      ))}
    </div>
  );
};
