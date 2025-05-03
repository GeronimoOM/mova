import { createUnionType, Field, ID, ObjectType } from '@nestjs/graphql';
import { Color } from 'models/Color';
import { OptionId, PropertyType } from 'models/Property';
import { OptionPropertyType, TextPropertyType } from './PropertyType';

@ObjectType('TextPropertyValue')
export class TextPropertyValueType {
  @Field()
  property: TextPropertyType;

  @Field()
  text: string;
}

@ObjectType('OptionValue')
export class OptionValueType {
  @Field(() => ID, { nullable: true })
  id?: OptionId;

  @Field()
  value: string;

  @Field(() => Color, { nullable: true })
  color?: Color;
}

@ObjectType('OptionPropertyValue')
export class OptionPropertyValueType {
  @Field()
  property: OptionPropertyType;

  @Field(() => OptionValueType, { nullable: true })
  option?: OptionValueType;
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
