import { DateTime } from 'luxon';
import { Flavor } from '../utils/flavor';
import { LanguageId } from './Language';
import { PartOfSpeech } from './Word';

export type PropertyId = Flavor<string, 'Property'>;

export enum PropertyType {
  Text = 'text',
  Option = 'option',
}

export interface BaseProperty {
  id: PropertyId;
  name: string;
  type: PropertyType;
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  addedAt: DateTime;
  order: number;
}

export type OptionId = Flavor<string, 'Option'>;

export interface TextProperty extends BaseProperty {
  type: PropertyType.Text;
}

export interface OptionProperty extends BaseProperty {
  type: PropertyType.Option;
  options: Record<OptionId, string>;
}

export type Property = TextProperty | OptionProperty;

export function isTextProperty(property: Property): property is TextProperty {
  return property.type === PropertyType.Text;
}

export function isOptionProperty(
  property: Property,
): property is OptionProperty {
  return property.type === PropertyType.Option;
}

export interface BasePropertyUpdate {
  id: PropertyId;
  type: PropertyType;
  name?: string;
}

export interface TextPropertyUpdate extends BasePropertyUpdate {
  type: PropertyType.Text;
}

export interface OptionPropertyUpdate extends BasePropertyUpdate {
  type: PropertyType.Option;
  options?: Record<OptionId, string | null>;
}

export type PropertyUpdate = TextPropertyUpdate | OptionPropertyUpdate;

export function isTextPropertyUpdate(
  propertyUpdate: PropertyUpdate,
): propertyUpdate is TextPropertyUpdate {
  return propertyUpdate.type === PropertyType.Text;
}

export function isOptionPropertyUpdate(
  propertyUpdate: PropertyUpdate,
): propertyUpdate is OptionPropertyUpdate {
  return propertyUpdate.type === PropertyType.Option;
}

export type PropertiesReorder = {
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  propertyIds: PropertyId[];
};
