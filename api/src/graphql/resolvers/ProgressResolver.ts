import {
  Args,
  Context as ContextDec,
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
import { Context } from 'models/Context';
import { ProgressCadence } from 'models/Progress';
import { ProgressService } from 'services/ProgressService';

@Resolver((of) => ProgressType)
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @ResolveField((type) => ProgressInstanceType)
  async current(
    @ContextDec('ctx') ctx: Context,
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

  @ResolveField((type) => Int)
  async streak(
    @ContextDec('ctx') ctx: Context,
    @Parent()
    progress: ProgressType,
  ): Promise<number> {
    return await this.progressService.getProgressStreak(
      ctx,
      progress.languageId,
      progress.type,
    );
  }

  @ResolveField((type) => ProgressHistoryType)
  async history(
    @ContextDec('ctx') ctx: Context,
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