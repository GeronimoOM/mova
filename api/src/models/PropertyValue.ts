import {
    isOptionProperty,
    isTextProperty,
    OptionId,
    OptionProperty,
    Property,
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
    option: OptionId;
}

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
