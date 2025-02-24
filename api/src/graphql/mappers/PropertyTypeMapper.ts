import { Injectable } from '@nestjs/common';
import {
  OptionUpdateType,
  PropertyUpdateUnionType,
  TextPropertyUpdateType,
} from 'graphql/types/ChangeType';
import {
  Option,
  OptionId,
  Property,
  PropertyType,
  PropertyUpdate,
  isTextProperty,
  isTextPropertyUpdate,
} from 'models/Property';
import {
  CreateOptionPropertyParams,
  CreatePropertyParams,
  CreateTextPropertyParams,
} from 'services/PropertyService';
import {
  CreatePropertyInput,
  OptionType,
  PropertyUnionType,
  TextPropertyType,
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
      };
    }
  }

  mapFromCreateInput(input: CreatePropertyInput): CreatePropertyParams {
    if (input.type === PropertyType.Text) {
      return input as CreateTextPropertyParams;
    } else {
      return input as CreateOptionPropertyParams;
    }
  }

  mapUpdate(propertyUpdate: PropertyUpdate): typeof PropertyUpdateUnionType {
    if (isTextPropertyUpdate(propertyUpdate)) {
      return propertyUpdate as TextPropertyUpdateType;
    } else {
      return {
        ...propertyUpdate,
        ...(propertyUpdate.options && {
          options: this.mapOptionsUpdate(propertyUpdate.options),
        }),
      };
    }
  }

  private mapOptions(options: Record<OptionId, Option>): OptionType[] {
    return Object.entries(options).map(([optionId, option]) => ({
      id: optionId,
      value: option.value,
      color: option.color,
    }));
  }

  private mapOptionsUpdate(
    options: Record<OptionId, Option | null>,
  ): OptionUpdateType[] {
    return Object.entries(options).map(([optionId, option]) => ({
      id: optionId,
      value: option?.value,
      color: option?.color,
    }));
  }
}
