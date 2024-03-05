import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { PropertyType } from 'models/Property';
import {
  OptionPropertyType,
  OptionType,
  TextPropertyType,
} from './PropertyType';

@ObjectType('TextPropertyValue')
export class TextPropertyValueType {
  @Field()
  property: TextPropertyType;

  @Field()
  text: string;
}

@ObjectType('OptionPropertyValue')
export class OptionPropertyValueType {
  @Field()
  property: OptionPropertyType;

  @Field()
  option: OptionType;
}

export const PropertyValueUnionType = createUnionType({
  name: 'PropertyValue',
  types: () => [TextPropertyValueType, OptionPropertyValueType] as const,
  resolveType: (value) => {
    switch (value.property.type) {
      case PropertyType.Text:
        return TextPropertyValueType;
      case PropertyType.Option:
        return OptionPropertyValueType;
    }
  },
});
