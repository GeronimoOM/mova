import { Component, For, createEffect } from 'solid-js';
import { createLazyQuery, createMutation } from '@merged/solid-apollo';
import {
  CreatePropertyDocument,
  GetPropertyDocument,
  LanguagePropertiesFragmentDoc,
  OptionProperty,
  PartOfSpeech,
  TextProperty,
} from '../../api/types/graphql';
import { PropertyType } from '../../api/types/graphql';
import { createStore, produce } from 'solid-js/store';
import { useLanguageContext } from '../LanguageContext';
import { updateCacheOnCreateProperty } from '../../api/mutations';

export type PropertyDetailsProps = {
  selectedProperty: string | null;
  setSelectedProperty: (property: string | null) => void;
  partOfSpeech: PartOfSpeech;
};

enum PropertyDetailsMode {
  Update = 'update',
  Create = 'create',
}

const PropertyDetails: Component<PropertyDetailsProps> = (props) => {
  const [selectedLanguageId] = useLanguageContext();

  const [property, setProperty] = createStore<
    Partial<TextProperty | OptionProperty>
  >({});

  const [fetchSelectedProperty, selectedPropertyQuery] =
    createLazyQuery(GetPropertyDocument);
  const [createProperty, createdPropertyMutation] = createMutation(
    CreatePropertyDocument,
  );

  const selectedProperty = () => selectedPropertyQuery()?.property;
  const mode = () =>
    props.selectedProperty
      ? PropertyDetailsMode.Update
      : PropertyDetailsMode.Create;
  const createdProperty = () => createdPropertyMutation()?.createProperty;

  const onCreateProperty = () => {
    createProperty({
      variables: {
        input: {
          languageId: selectedLanguageId()!,
          name: property.name!,
          type: PropertyType.Text, // TODO
          partOfSpeech: props.partOfSpeech,
        },
      },
      update: updateCacheOnCreateProperty,
    });
  };

  createEffect(() => {
    if (props.selectedProperty) {
      fetchSelectedProperty({
        variables: {
          id: props.selectedProperty,
        },
      });
    } else {
      setProperty(
        produce((property) => {
          property = {};
        }),
      );
    }
  });

  createEffect(() => {
    if (selectedProperty()) {
      const { name, type } = selectedProperty()!;
      setProperty({ name, type });
    }
  });

  createEffect(() => {
    if (createdProperty()) {
      props.setSelectedProperty(createdProperty()!.id);
    }
  });

  return (
    <div class="flex flex-col">
      <input
        type="text"
        value={property.name ?? ''}
        onInput={(e) => setProperty({ name: e.currentTarget.value })}
      />
      <p>{property.type ?? ''}</p>
      <button onClick={onCreateProperty}>
        {mode() === PropertyDetailsMode.Create ? 'Add' : 'Edit'}
      </button>
    </div>
  );
};

export default PropertyDetails;
