import {
  Args,
  Context as ContextDec,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TimestampScalar } from 'graphql/scalars/Timestamp';
import { GoalType, SetGoalsInput } from 'graphql/types/GoalType';

import { ProgressHistoryType, ProgressType } from 'graphql/types/ProgressType';
import { DateTime } from 'luxon';
import { Context } from 'models/Context';
import { ProgressService } from 'services/ProgressService';

@Resolver((of) => ProgressType)
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @ResolveField((type) => Int)
  async streak(
    @Parent()
    progress: ProgressType,
  ): Promise<number> {
    throw new Error('not implemented');
  }

  @ResolveField((type) => ProgressHistoryType)
  async history(
    @Parent()
    progress: ProgressType,
    @Args('until', { type: () => TimestampScalar, nullable: true })
    from?: DateTime,
    @Args('until', { type: () => TimestampScalar, nullable: true })
    until?: DateTime,
  ): Promise<ProgressHistoryType> {
    throw new Error('not implemented');
  }

  @Mutation((returns) => [GoalType])
  async setGoals(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: SetGoalsInput,
  ): Promise<GoalType[]> {
    return await this.progressService.setGoals(
      input.goals.map((goal) => ({ ...goal, languageId: input.languageId })),
    );
  }
}
