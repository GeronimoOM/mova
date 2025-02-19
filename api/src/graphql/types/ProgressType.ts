import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { DateTime } from 'luxon';
import { Goal } from 'models/Goal';
import { LanguageId } from 'models/Language';
import {
  ProgressCadence,
  ProgressType as ProgressTypeEnum,
} from 'models/Progress';
import { GoalType } from './GoalType';

@ObjectType('ProgressInstance')
export class ProgressInstanceType {
  @Field(() => TimestampScalar)
  date: DateTime;

  @Field(() => Int)
  points: number;
}

@ObjectType('Progress')
export class ProgressType {
  @Field(() => ProgressTypeEnum)
  type: ProgressTypeEnum;

  @Field(() => ProgressCadence)
  cadence: ProgressCadence;

  @Field(() => GoalType)
  goal: Goal;

  languageId: LanguageId;
}

@ObjectType('ProgressHistory')
export class ProgressHistoryType {
  @Field(() => ProgressCadence)
  cadence: ProgressCadence;

  @Field(() => TimestampScalar)
  from: DateTime;

  @Field(() => TimestampScalar)
  until: DateTime;

  @Field(() => [ProgressInstanceType])
  instances: ProgressInstanceType[];
}
