import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { WordTypeMapper } from 'graphql/mappers/WordTypeMapper';
import { LanguageType } from 'graphql/types/LanguageType';
import { WordType } from 'graphql/types/WordType';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { WordId } from 'models/Word';
import { ExerciseService } from 'services/ExerciseService';

@Resolver((of) => LanguageType)
export class ExerciseResolver {
  constructor(
    private exerciseService: ExerciseService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @ResolveField((type) => [WordType])
  async exerciseWords(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
    @Args('total', { type: () => Int, nullable: true }) total: number,
  ): Promise<WordType[]> {
    const words = await this.exerciseService.getWords(ctx, {
      languageId: language.id,
      total,
    });
    return words.map((word) => this.wordTypeMapper.map(word));
  }

  @ResolveField((type) => Int)
  async exerciseCount(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
  ): Promise<number> {
    return await this.exerciseService.getCount(ctx, language.id);
  }

  @Mutation((returns) => WordType)
  async attemptMastery(
    @ContextDec() ctx: Context,
    @Args('wordId', { type: () => ID }) wordId: WordId,
    @Args('success', { type: () => Boolean }) success: boolean,
  ): Promise<WordType> {
    const word = await this.exerciseService.attemptMastery(ctx, {
      wordId,
      success,
    });

    return this.wordTypeMapper.map(word);
  }
}
