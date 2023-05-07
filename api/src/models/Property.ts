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
  order: number;
}

export type OptionId = Flavor<string, 'Option'>;

export interface TextProperty extends BaseProperty {
  type: PropertyType.Text;
}

export interface OptionProperty extends BaseProperty {
  type: PropertyType.Option;
  options: Map<OptionId, string>;
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
