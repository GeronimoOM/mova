import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';

@ObjectType('Language')
export class LanguageType {
  @Field((type) => ID)
  id: LanguageId;

  @Field()
  name: string;

  @Field((type) => TimestampScalar)
  addedAt: DateTime;
}
