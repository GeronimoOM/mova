import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GoalType, SetGoalsInput } from 'graphql/types/GoalType';

import {
  ProgressHistoryType,
  ProgressInstanceType,
  ProgressType,
} from 'graphql/types/ProgressType';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { ProgressCadence } from 'models/Progress';
import { ProgressService } from 'services/ProgressService';

@Resolver(() => ProgressType)
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @ResolveField(() => ProgressInstanceType)
  async current(
    @ContextDec() ctx: Context,
    @Parent()
    progress: ProgressType,
    @Args('cadence', { type: () => ProgressCadence, nullable: true })
    cadence?: ProgressCadence,
  ): Promise<ProgressInstanceType> {
    return await this.progressService.getCurrentProgress(
      ctx,
      progress.languageId,
      progress.type,
      cadence ?? progress.cadence,
    );
  }

  @ResolveField(() => Int)
  async streak(
    @ContextDec() ctx: Context,
    @Parent()
    progress: ProgressType,
  ): Promise<number> {
    return await this.progressService.getProgressStreak(
      ctx,
      progress.languageId,
      progress.type,
    );
  }

  @ResolveField(() => ProgressHistoryType)
  async history(
    @ContextDec() ctx: Context,
    @Parent()
    progress: ProgressType,
    @Args('cadence', { type: () => ProgressCadence })
    cadence: ProgressCadence,
  ): Promise<ProgressHistoryType> {
    return await this.progressService.getProgressHistory(
      ctx,
      progress.languageId,
      progress.type,
      cadence,
    );
  }

  @Mutation(() => [GoalType])
  async setGoals(
    @ContextDec() ctx: Context,
    @Args('input') input: SetGoalsInput,
  ): Promise<GoalType[]> {
    return await this.progressService.setGoals(
      input.goals.map((goal) => ({ ...goal, languageId: input.languageId })),
    );
  }
}
