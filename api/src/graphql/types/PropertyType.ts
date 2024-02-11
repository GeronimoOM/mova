import {
  createUnionType,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';
import {
  PropertyId,
  PropertyType,
  PropertyType as PropertyTypeEnum,
} from 'models/Property';
import { PartOfSpeech } from 'models/Word';

registerEnumType(PropertyTypeEnum, {
  name: 'PropertyType',
});

@ObjectType()
export abstract class IPropertyType {
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

  @Field((type) => ID)
  languageId: LanguageId;
}

@ObjectType('TextProperty')
export class TextPropertyType extends IPropertyType {}

@ObjectType('OptionProperty')
export class OptionPropertyType extends IPropertyType {
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
  name: 'PropertyUnion',
  types: () => [TextPropertyType, OptionPropertyType] as const,
  resolveType: (value) => {
    switch (value.type) {
      case PropertyType.Text:
        return TextPropertyType;
      case PropertyType.Option:
        return OptionPropertyType;
    }
  },
});
