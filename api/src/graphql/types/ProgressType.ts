import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import {
  ProgressCadence,
  ProgressType as ProgressTypeEnum,
} from 'models/Progress';

@ObjectType('ProgressInstance')
export class ProgressInstanceType {
  @Field((type) => TimestampScalar, { nullable: true })
  date: DateTime;

  @Field((type) => Int)
  points: number;
}

@ObjectType('Progress')
export class ProgressType {
  @Field((type) => ProgressTypeEnum)
  type: ProgressTypeEnum;

  @Field((type) => ProgressCadence)
  cadence: ProgressCadence;

  @Field()
  current: ProgressInstanceType;
}

@ObjectType('ProgressHistory')
export class ProgressHistoryType {
  @Field((type) => TimestampScalar)
  from: DateTime;

  @Field((type) => TimestampScalar)
  until: DateTime;

  @Field((type) => [ProgressInstanceType])
  instances: ProgressInstanceType[];
}
