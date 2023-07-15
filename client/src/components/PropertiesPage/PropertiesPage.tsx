import { Component, createSignal, on } from 'solid-js';
import { useLanguageContext } from '../LanguageContext';
import PropertiesList from './PropertiesList';
import { PartOfSpeech } from '../../api/types/graphql';
import PropertiesPosSelect from './PropertiesPosSelect';

const PropertiesPage: Component = () => {
  const [selectedPos, setSelectedPos] = createSignal(PartOfSpeech.Noun);

  return (
    <div class="flex flex-col h-full items-center justify-items-stretch">
      <div class="w-full flex flex-col items-center">
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

export default PropertiesPage;
