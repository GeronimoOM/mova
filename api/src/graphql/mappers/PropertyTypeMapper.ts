import { Injectable } from '@nestjs/common';
import {
  isTextProperty,
  isTextPropertyUpdate,
  OptionId,
  Property,
  PropertyUpdate,
} from 'models/Property';
import {
  OptionPropertyType,
  OptionType,
  PropertyUnionType,
  TextPropertyType,
} from '../types/PropertyType';
import {
  OptionPropertyUpdateType,
  PropertyUpdateUnionType,
  TextPropertyUpdateType,
} from 'graphql/types/ChangeType';

@Injectable()
export class PropertyTypeMapper {
  map(property: Property): typeof PropertyUnionType {
    if (isTextProperty(property)) {
      return property as TextPropertyType;
    } else {
      return {
        ...property,
        options: this.mapOptions(property.options),
      } as OptionPropertyType;
    }
  }

  mapUpdate(propertyUpdate: PropertyUpdate): typeof PropertyUpdateUnionType {
    if (isTextPropertyUpdate(propertyUpdate)) {
      return propertyUpdate as TextPropertyUpdateType;
    } else {
      return {
        ...propertyUpdate,
        ...(propertyUpdate.options && {
          options: this.mapOptions(propertyUpdate.options),
        }),
      } as OptionPropertyUpdateType;
    }
  }

  private mapOptions(options: Record<OptionId, string>): OptionType[] {
    return Object.entries(options).map(([optionId, optionValue]) => ({
      id: optionId,
      value: optionValue,
    }));
  }
}
