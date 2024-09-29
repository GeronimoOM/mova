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
  @Field((type) => ID)
  id: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar)
  addedAt: DateTime;

  @Field((type) => Int)
  mastery: number;

  @Field((type) => TimestampScalar, { nullable: true })
  nextExerciseAt?: DateTime;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => [PropertyValueUnionType])
  properties: Array<typeof PropertyValueUnionType>;
}

export const WordPageType = pageType('Word', WordType);

registerEnumType(WordOrder, {
  name: 'WordOrder',
});

@InputType()
export class CreateWordInput {
  @Field((type) => ID, { nullable: true })
  id?: WordId;

  @Field()
  original: string;

  @Field()
  translation: string;

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => PartOfSpeech)
  partOfSpeech: PartOfSpeech;

  @Field((type) => TimestampScalar, { nullable: true })
  addedAt?: DateTime;

  @Field((type) => [UpdatePropertyValueInput], { nullable: true })
  properties?: UpdatePropertyValueInput[];
}

@InputType()
export class UpdateWordInput {
  @Field((type) => ID)
  id: WordId;

  @Field({ nullable: true })
  original?: string;

  @Field({ nullable: true })
  translation?: string;

  @Field((type) => [UpdatePropertyValueInput], { nullable: true })
  properties?: UpdatePropertyValueInput[];
}

@InputType()
export class UpdatePropertyValueInput {
  @Field((type) => ID)
  id: PropertyId;

  @Field({ nullable: true })
  text?: string;

  @Field((type) => ID, { nullable: true })
  option?: OptionId;
}

@InputType()
export class DeleteWordInput {
  @Field((type) => ID)
  id: WordId;
}
