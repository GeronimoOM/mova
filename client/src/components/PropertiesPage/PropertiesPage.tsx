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

  const handleCreatePropertyDetails = () => {
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
    <div class="flex flex-col h-full">
      <PropertiesPosSelect
        selectedPos={selectedPos()}
        setSelectedPos={setSelectedPos}
      />
      <PropertiesList
        partOfSpeech={selectedPos()}
        selectedProperty={selectedProperty()}
        setSelectedProperty={setSelectedProperty}
      />
      <button onClick={handleCreatePropertyDetails}>New</button>
      <Show when={showPropertyDetails()}>
        <PropertyDetails
          selectedProperty={selectedProperty()}
          setSelectedProperty={setSelectedProperty}
        />
      </Show>
    </div>
  );
};

export default PropertiesPage;
