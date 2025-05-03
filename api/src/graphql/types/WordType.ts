import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { Color } from 'models/Color';
import { LanguageId } from 'models/Language';
import { OptionId, PropertyId } from 'models/Property';
import { PartOfSpeech, WordId, WordOrder } from 'models/Word';
import { pageType } from './PageType';
import { PropertyValueUnionType } from './PropertyValueType';

registerEnumType(PartOfSpeech, {
  name: 'PartOfSpeech',
});

@ObjectType('Word')
export class WordType {
  @Field(() => ID)
  id: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => TimestampScalar)
  addedAt: DateTime;

  @Field(() => Int)
  mastery: number;

  @Field(() => TimestampScalar)
  nextExerciseAt: DateTime;

  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => [PropertyValueUnionType])
  properties: Array<typeof PropertyValueUnionType>;
}

export const WordPageType = pageType('Word', WordType);

registerEnumType(WordOrder, {
  name: 'WordOrder',
});

@InputType()
export class CreateWordInput {
  @Field(() => ID, { nullable: true })
  id?: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field(() => TimestampScalar, { nullable: true })
  addedAt?: DateTime;

  @Field(() => [SavePropertyValueInput], { nullable: true })
  properties?: SavePropertyValueInput[];
}

@InputType()
export class UpdateWordInput {
  @Field(() => ID)
  id: WordId;

  @Field({ nullable: true })
  original?: string;

  @Field({ nullable: true })
  translation?: string;

  @Field(() => [SavePropertyValueInput], { nullable: true })
  properties?: SavePropertyValueInput[];
}

@InputType()
export class UpdatePropertyValueOptionInput {
  @Field(() => ID, { nullable: true })
  id?: OptionId;

  @Field({ nullable: true })
  value?: string;

  @Field(() => Color, { nullable: true })
  color?: Color;
}

@InputType()
export class SavePropertyValueInput {
  @Field(() => ID)
  id: PropertyId;

  @Field({ nullable: true })
  text?: string;

  @Field(() => UpdatePropertyValueOptionInput, { nullable: true })
  option?: UpdatePropertyValueOptionInput;
}

@InputType()
export class DeleteWordInput {
  @Field(() => ID)
  id: WordId;
}
