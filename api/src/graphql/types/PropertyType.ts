import {
  createUnionType,
  Field,
  ID,
  InputType,
  Int,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';
import {
  OptionId,
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
  @Field(() => ID)
  id: PropertyId;

  @Field()
  name: string;

  @Field(() => PropertyTypeEnum)
  type: PropertyTypeEnum;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => TimestampScalar)
  addedAt: DateTime;

  @Field(() => Int)
  order: number;

  @Field(() => ID)
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

@InputType()
export class CreatePropertyInput {
  @Field(() => ID, { nullable: true })
  id?: PropertyId;

  @Field()
  name: string;

  @Field(() => PropertyType)
  type: PropertyType;

  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => TimestampScalar, { nullable: true })
  addedAt?: DateTime;

  @Field(() => [String], { nullable: true })
  options: string[];
}

@InputType()
export class UpdatePropertyInput {
  @Field(() => ID)
  id: PropertyId;

  @Field({ nullable: true })
  name: string;

  @Field(() => [UpdateOptionInput], { nullable: true })
  options: UpdateOptionInput[];
}

@InputType()
export class ReorderPropertiesInput {
  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => [ID])
  propertyIds: PropertyId[];
}

@InputType()
export class UpdateOptionInput {
  @Field(() => ID)
  id: OptionId;

  @Field()
  value: string;
}

@InputType()
export class DeletePropertyInput {
  @Field(() => ID)
  id: PropertyId;
}
