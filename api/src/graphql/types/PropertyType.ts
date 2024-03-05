import {
  createUnionType,
  Field,
  ID,
  Int,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';
import {
  Property,
  PropertyId,
  PropertyType,
  PropertyType as PropertyTypeEnum,
} from 'models/Property';
import { PartOfSpeech } from 'models/Word';

registerEnumType(PropertyTypeEnum, {
  name: 'PropertyType',
});

@InterfaceType('IProperty')
export abstract class PropertyInterface {
  @Field((type) => ID)
  id: PropertyId;

  @Field()
  name: string;

  @Field((type) => PropertyTypeEnum)
  type: PropertyTypeEnum;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar)
  addedAt: DateTime;

  @Field((type) => Int)
  order: number;

  @Field((type) => ID)
  languageId: LanguageId;
}

@ObjectType('TextProperty', {
  implements: () => PropertyInterface,
})
export class TextPropertyType extends PropertyInterface {}

@ObjectType('OptionProperty', {
  implements: () => PropertyInterface,
})
export class OptionPropertyType extends PropertyInterface {
  @Field(() => [OptionType])
  options: OptionType[];
}

@ObjectType('Option')
export class OptionType {
  @Field(() => ID)
  id: string;

  @Field()
  value: string;
}

export const PropertyUnionType = createUnionType({
  name: 'Property',
  types: () => [TextPropertyType, OptionPropertyType] as const,
  resolveType: (value: Property) => {
    switch (value.type) {
      case PropertyType.Text:
        return TextPropertyType;
      case PropertyType.Option:
        return OptionPropertyType;
    }
  },
});
