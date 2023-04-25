import { Component } from 'solid-js';
import { PartOfSpeech } from '../../api/types/graphql';

export type PropertiesPosSelectProps = {
  selectedPos: PartOfSpeech;
  setSelectedPos: (selectedProperty: PartOfSpeech) => void;
};

const PropertiesPosSelect: Component<PropertiesPosSelectProps> = (props) => {
  return (
    <ul class="flex flex-row">
      {Object.values(PartOfSpeech).map((partOfSpeech) => (
        <li class="p-1" onClick={() => props.setSelectedPos(partOfSpeech)}>
          <span>
            {partOfSpeech}
            {partOfSpeech === props.selectedPos ? '!' : ''}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PropertiesPosSelect;
