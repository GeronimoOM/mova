import { Color } from 'models/Color';
import {
  isOptionProperty,
  isTextProperty,
  OptionId,
  OptionProperty,
  Property,
  PropertyId,
  PropertyType,
  TextProperty,
} from './Property';

export interface BasePropertyValue {
  property: Property;
}

export interface TextPropertyValue extends BasePropertyValue {
  property: TextProperty;
  text: string;
}

export interface OptionPropertyValue extends BasePropertyValue {
  property: OptionProperty;
  option: OptionValue;
}

export type OptionValue =
  | {
      id: OptionId;
    }
  | {
      value: string;
      color?: Color;
    };

export type PropertyValue = TextPropertyValue | OptionPropertyValue;

export function isTextPropertyValue(
  propertyValue: PropertyValue,
): propertyValue is TextPropertyValue {
  return isTextProperty(propertyValue.property);
}

export function isOptionPropertyValue(
  propertyValue: PropertyValue,
): propertyValue is OptionPropertyValue {
  return isOptionProperty(propertyValue.property);
}

export interface BasePropertyValueSave {
  propertyId: PropertyId;
  type: PropertyType;
}

export interface TextPropertyValueSave extends BasePropertyValueSave {
  type: PropertyType.Text;
  text: string | null;
}

export interface OptionPropertyValueSave extends BasePropertyValueSave {
  type: PropertyType.Option;
  option: OptionValue | null;
}

export type PropertyValueSave = TextPropertyValueSave | OptionPropertyValueSave;

export function isIdOptionValue(
  propertyValueOption: OptionPropertyValue['option'],
): propertyValueOption is { id: OptionId } {
  return 'id' in propertyValueOption;
}

export function arePropertyValuesOptionsEqual(
  value1: OptionPropertyValue['option'],
  value2: OptionPropertyValue['option'],
): boolean {
  return isIdOptionValue(value1)
    ? isIdOptionValue(value2) && value1.id === value2.id
    : !isIdOptionValue(value2) &&
        value1.value === value2.value &&
        value1.color === value2.color;
}
