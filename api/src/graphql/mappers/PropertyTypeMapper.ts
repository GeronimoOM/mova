import { Injectable } from '@nestjs/common';
import { isOptionProperty, isTextProperty, Property } from 'models/Property';
import {
  OptionPropertyType,
  PropertyUnionType,
  TextPropertyType,
} from '../types/PropertyType';

@Injectable()
export class PropertyTypeMapper {
  map(property: Property): typeof PropertyUnionType {
    if (isTextProperty(property)) {
      return property as TextPropertyType;
    } else if (isOptionProperty(property)) {
      return {
        ...property,
        options: Array.from(property.options).map(
          ([optionId, optionValue]) => ({
            id: optionId,
            value: optionValue,
          }),
        ),
      } as OptionPropertyType;
    }
  }
}
