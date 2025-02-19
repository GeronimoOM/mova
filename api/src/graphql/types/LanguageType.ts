import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { LanguageId } from 'models/Language';

@ObjectType('Language')
export class LanguageType {
  @Field(() => ID)
  id: LanguageId;

  @Field()
  name: string;

  @Field(() => TimestampScalar)
  addedAt: DateTime;
}

@InputType()
export class CreateLanguageInput {
  @Field(() => ID, { nullable: true })
  id?: LanguageId;

  @Field()
  name: string;

  @Field(() => TimestampScalar, { nullable: true })
  addedAt?: DateTime;
}

@InputType()
export class UpdateLanguageInput {
  @Field(() => ID)
  id: LanguageId;

  @Field()
  name: string;
}

@InputType()
export class DeleteLanguageInput {
  @Field(() => ID)
  id: LanguageId;
}
