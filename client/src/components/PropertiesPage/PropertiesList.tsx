import { Component, For, createEffect } from 'solid-js';
import { createLazyQuery } from '@merged/solid-apollo';
import { useLanguageContext } from '../LanguageContext';
import { GetPropertiesDocument, PartOfSpeech } from '../../api/types/graphql';

export type PropertiesListProps = {
  partOfSpeech: PartOfSpeech;
  selectedProperty: string | null;
  setSelectedProperty: (selectedProperty: string | null) => void;
};

const PropertiesList: Component<PropertiesListProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [fetchProperies, propertiesQuery] = createLazyQuery(
    GetPropertiesDocument,
  );
  const properties = () => propertiesQuery()?.language?.properties;

  createEffect(() => {
    if (selectedLanguageId()) {
      fetchProperies({
        variables: {
          languageId: selectedLanguageId()!,
          partOfSpeech: props.partOfSpeech,
        },
      });
    }
  });

  return (
    <For each={properties()} fallback={'loading...'}>
      {(property) => (
        <span onClick={() => props.setSelectedProperty(property.id)}>
          {property.name}
          {props.selectedProperty === property.id ? '!' : ''}
        </span>
      )}
    </For>
  );
};

export default PropertiesList;
