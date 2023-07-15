import { Component } from 'solid-js';
import { PartOfSpeech } from '../../api/types/graphql';
import { partsOfSpeechParams } from '../utils/partsOfSpeech';
import { Icon } from '../utils/Icon';

export type PropertiesPosSelectProps = {
  selectedPos: PartOfSpeech;
  setSelectedPos: (selectedProperty: PartOfSpeech) => void;
};

const PropertiesPosSelect: Component<PropertiesPosSelectProps> = (props) => {
  return (
    <div class="my-2 flex flex-row justify-center text-spacecadet font-bold cursor-pointer">
      {Object.entries(partsOfSpeechParams).map(([partOfSpeech, posProps]) => (
        <div
          class="p-2 items-center flex flex-row hover:bg-spacecadet hover:text-white"
          classList={{
            'bg-spacecadet text-white': partOfSpeech === props.selectedPos,
          }}
          onClick={() => props.setSelectedPos(partOfSpeech as PartOfSpeech)}
        >
          <Icon icon={posProps.icon} size="sm" />
          <div class="hidden md:block">{posProps.label}</div>
        </div>
      ))}
    </div>
  );
};

export default PropertiesPosSelect;
