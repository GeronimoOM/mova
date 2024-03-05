import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PartOfSpeech, WordId, WordOrder } from 'models/Word';
import { pageType } from './PageType';
import { PropertyValueUnionType } from './PropertyValueType';
import { LanguageId } from 'models/Language';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';

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

  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => [PropertyValueUnionType])
  properties: Array<typeof PropertyValueUnionType>;
}

export const WordPageType = pageType('Word', WordType);

registerEnumType(WordOrder, {
  name: 'WordOrder',
});
