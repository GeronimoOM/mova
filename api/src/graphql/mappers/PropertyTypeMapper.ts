import { Injectable } from '@nestjs/common';
import {
  OptionPropertyUpdateType,
  PropertyUpdateUnionType,
  TextPropertyUpdateType,
} from 'graphql/types/ChangeType';
import {
  OptionId,
  Property,
  PropertyUpdate,
  isTextProperty,
  isTextPropertyUpdate,
} from 'models/Property';
import { UpdatePropertyParams } from 'services/PropertyService';
import {
  OptionPropertyType,
  OptionType,
  PropertyUnionType,
  TextPropertyType,
  UpdatePropertyInput,
} from '../types/PropertyType';

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

  mapFromUpdateInput(input: UpdatePropertyInput): UpdatePropertyParams {
    return {
      ...input,
      ...(input.options && {
        options: Object.fromEntries(
          input.options.map(({ id, value }) => [id, value]),
        ),
      }),
    };
  }

  private mapOptions(options: Record<OptionId, string | null>): OptionType[] {
    return Object.entries(options).map(
      ([optionId, optionValue]) =>
        ({
          id: optionId,
          value: optionValue,
        }) as OptionType,
    );
  }
}
