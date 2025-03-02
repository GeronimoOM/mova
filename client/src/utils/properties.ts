import {
  OptionPropertyFieldsFragment,
  PropertyFieldsFragment,
  PropertyType,
  PropertyValueFieldsFragment,
  TextPropertyFieldsFragment,
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

export function getPropertyTypeName(
  propertyType: PropertyFieldsFragment['type'],
): PropertyFieldsFragment['__typename'] {
  return propertyType === PropertyType.Option
    ? 'OptionProperty'
    : 'TextProperty';
}

export function getPropertyValueTypeName(
  propertyType: PropertyFieldsFragment['type'],
): PropertyValueFieldsFragment['__typename'] {
  return propertyType === PropertyType.Option
    ? 'OptionPropertyValue'
    : 'TextPropertyValue';
}
