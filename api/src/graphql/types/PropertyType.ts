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

@InputType()
export class CreatePropertyInput {
  @Field((type) => ID, { nullable: true })
  id?: PropertyId;

  @Field()
  name: string;

  @Field((type) => PropertyType)
  type: PropertyType;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar, { nullable: true })
  addedAt?: DateTime;

  @Field((type) => [String], { nullable: true })
  options: string[];
}

@InputType()
export class UpdatePropertyInput {
  @Field((type) => ID)
  id: PropertyId;

  @Field({ nullable: true })
  name: string;

  @Field((type) => [UpdateOptionInput], { nullable: true })
  options: UpdateOptionInput[];
}

@InputType()
export class ReorderPropertiesInput {
  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => [ID])
  propertyIds: PropertyId[];
}

@InputType()
export class UpdateOptionInput {
  @Field((type) => ID)
  id: OptionId;

  @Field()
  value: string;
}

@InputType()
export class DeletePropertyInput {
  @Field((type) => ID)
  id: PropertyId;
}
