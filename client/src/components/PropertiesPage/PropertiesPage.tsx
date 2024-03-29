import { Component, createSignal } from 'solid-js';
import { PropertiesList } from './PropertiesList';
import { PartOfSpeech } from '../../api/types/graphql';
import { PropertiesPosSelect } from './PropertiesPosSelect';

export const PropertiesPage: Component = () => {
  const [selectedPos, setSelectedPos] = createSignal(PartOfSpeech.Noun);

  return (
    <div class="flex h-full flex-col items-center justify-items-stretch">
      <div class="w-full">
        <PropertiesPosSelect
          selectedPos={selectedPos()}
          setSelectedPos={setSelectedPos}
        />
      </div>
      <div class="w-full overflow-y-scroll">
        <PropertiesList partOfSpeech={selectedPos()} />
      </div>
    </div>
  );
};
