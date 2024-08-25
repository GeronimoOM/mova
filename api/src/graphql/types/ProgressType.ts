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
  @Field((type) => ProgressType)
  type: ProgressType;

  @Field((type) => ProgressCadence)
  cadence: ProgressCadence;

  @Field((type) => Int)
  points: number;
}

@InputType('SetGoalsInput')
export class SetGoalsInput {
  @Field((type) => ID)
  languageId: LanguageId;

  @Field((type) => [SetGoalInput])
  goals: SetGoalInput[];
}

@InputType('SetGoalInput')
export class SetGoalInput {
  @Field((type) => ProgressType)
  type: ProgressType;

  @Field((type) => ProgressCadence)
  cadence: ProgressCadence;

  @Field((type) => Int)
  points: number;
}
