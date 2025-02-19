import {
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { LanguageId } from 'models/Language';
import { ProgressCadence, ProgressType } from 'models/Progress';

registerEnumType(ProgressType, {
  name: 'ProgressType',
});

registerEnumType(ProgressCadence, {
  name: 'ProgressCadence',
});

@ObjectType('Goal')
export class GoalType {
  @Field(() => ProgressType)
  type: ProgressType;

  @Field(() => ProgressCadence)
  cadence: ProgressCadence;

  @Field(() => Int)
  points: number;
}

@InputType('SetGoalsInput')
export class SetGoalsInput {
  @Field(() => ID)
  languageId: LanguageId;

  @Field(() => [SetGoalInput])
  goals: SetGoalInput[];
}

@InputType('SetGoalInput')
export class SetGoalInput {
  @Field(() => ProgressType)
  type: ProgressType;

  @Field(() => ProgressCadence)
  cadence: ProgressCadence;

  @Field(() => Int)
  points: number;
}
