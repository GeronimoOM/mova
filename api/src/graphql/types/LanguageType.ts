import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
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

@InputType()
export class CreateLanguageInput {
  @Field((type) => ID, { nullable: true })
  id?: LanguageId;

  @Field()
  name: string;

  @Field((type) => TimestampScalar, { nullable: true })
  addedAt?: DateTime;
}

@InputType()
export class UpdateLanguageInput {
  @Field((type) => ID)
  id: LanguageId;

  @Field()
  name: string;
}

@InputType()
export class DeleteLanguageInput {
  @Field((type) => ID)
  id: LanguageId;
}
