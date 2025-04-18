import {
  OptionPropertyFieldsFragment,
  OptionPropertyValueSave,
  PropertyFieldsFragment,
  PropertyType,
  PropertyValueFieldsFragment,
  PropertyValueSave,
  SavePropertyValueInput,
  TextPropertyFieldsFragment,
  TextPropertyValueSave,
  WordFieldsFullFragment,
} from '../api/types/graphql';

export const propertyTypes: PropertyType[] = [
  PropertyType.Text,
  PropertyType.Option,
];

export function isTextPropertyFragment(
  property: PropertyFieldsFragment,
): property is TextPropertyFieldsFragment {
  return property.type === PropertyType.Text;
}

export function isOptionPropertyFragment(
  property: PropertyFieldsFragment,
): property is OptionPropertyFieldsFragment {
  return property.type === PropertyType.Option;
}

export function updatedWordProperties(
  properties?: WordFieldsFullFragment['properties'],
  changes?: Array<SavePropertyValueInput | PropertyValueSave>,
): WordFieldsFullFragment['properties'] {
  return (changes ?? []).reduce((current, propertyValue) => {
    const input = propertyValue as SavePropertyValueInput;
    const textSave = propertyValue as TextPropertyValueSave;
    const optionSave = propertyValue as OptionPropertyValueSave;

    const id = input.id || (textSave || optionSave).propertyId;

    if (!input.text && !input.option && !textSave.text && !optionSave.value) {
      return current.filter((prop) => prop.property.id !== id);
    }

    let newPropValue: PropertyValueFieldsFragment;
    const text = input.text || textSave.text;
    if (text) {
      newPropValue = {
        property: {
          id,
          __typename: 'TextProperty',
        },
        text,
        __typename: 'TextPropertyValue',
      };
    } else {
      newPropValue = {
        property: {
          id,
          __typename: 'OptionProperty',
        },
        option: {
          id: input.option?.id ?? optionSave.optionId ?? null,
          value: (input.option?.value ?? optionSave.value)!,
          color: input.option?.color ?? optionSave.color ?? null,
          __typename: 'OptionValue',
        },
        __typename: 'OptionPropertyValue',
      };
    }

    const currentPropIdx = current.findIndex(
      (propValue) => propValue.property.id === id,
    );
    if (currentPropIdx === -1) {
      return [...current, newPropValue];
    }

    return current.toSpliced(currentPropIdx, 1, newPropValue);
  }, properties ?? []);
}
