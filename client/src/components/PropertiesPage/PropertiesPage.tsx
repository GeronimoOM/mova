import { Component, Show, createEffect, createSignal, on } from 'solid-js';
import { useLanguageContext } from '../LanguageContext';
import PropertiesList from './PropertiesList';
import { PartOfSpeech } from '../../api/types/graphql';
import PropertiesPosSelect from './PropertiesPosSelect';
import PropertyDetails from './PropertyDetails';

const PropertiesPage: Component = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedPos, setSelectedPos] = createSignal(PartOfSpeech.Noun);
  const [selectedProperty, setSelectedProperty] = createSignal<string | null>(
    null,
  );
  const [showPropertyDetails, setShowPropertyDetails] = createSignal(false);

  const onCreatePropertyDetails = () => {
    setSelectedProperty(null);
    setShowPropertyDetails(true);
  };

  createEffect(
    on(selectedLanguageId, () => {
      setSelectedProperty(null);
    }),
  );

  createEffect(() => {
    if (selectedProperty()) {
      setShowPropertyDetails(true);
    } else {
      setShowPropertyDetails(false);
    }
  });

  return (
    <div class="pb-12 md:pb-0 flex flex-col h-full items-center justify-items-stretch">
      <div class="flex flex-col items-center outline outline-yellow-300">
        <PropertiesPosSelect
          selectedPos={selectedPos()}
          setSelectedPos={setSelectedPos}
        />
      </div>
      <div class="w-full p-2 flex-auto flex flex-col xl:flex-row outline outline-purple-300">
        <div class="flex-1 outline outline-green-300">
          <PropertiesList
            partOfSpeech={selectedPos()}
            selectedProperty={selectedProperty()}
            onPropertySelect={setSelectedProperty}
          />
          <button onClick={onCreatePropertyDetails}>New</button>
        </div>
        <Show when={showPropertyDetails()}>
          <div class="flex-1 outline outline-orange-300">
            <PropertyDetails
              selectedProperty={selectedProperty()}
              setSelectedProperty={setSelectedProperty}
              partOfSpeech={selectedPos()}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default PropertiesPage;
