import {
  Args,
  Context as ContextDec,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { LanguageType } from 'graphql/types/LanguageType';
import { GoalType, SetGoalsInput } from 'graphql/types/ProgressType';
import { Context } from 'models/Context';
import { ProgressService } from 'services/ProgressService';

@Resolver((of) => LanguageType)
export class ProgressResolver {
  constructor(private progressService: ProgressService) {}

  @ResolveField((type) => [GoalType])
  async goals(@Parent() language: LanguageType): Promise<GoalType[]> {
    return await this.progressService.getGoals(language.id);
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
