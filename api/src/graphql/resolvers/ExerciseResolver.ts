import {
  Args,
  Context as ContextDec,
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
import { WordId } from 'models/Word';
import { ExerciseService } from 'services/ExerciseService';
import { Context } from 'vm';

@Resolver((of) => LanguageType)
export class ExerciseResolver {
  constructor(
    private exerciseService: ExerciseService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @ResolveField((type) => [WordType])
  async exerciseWords(
    @Parent() language: LanguageType,
    @Args('total', { type: () => Int, nullable: true }) total: number,
  ): Promise<WordType[]> {
    const words = await this.exerciseService.getWords({
      languageId: language.id,
      total,
    });
    return words.map((word) => this.wordTypeMapper.map(word));
  }

  @Mutation((returns) => WordType)
  async increaseMastery(
    @ContextDec('ctx') ctx: Context,
    @Args('wordId', { type: () => ID }) wordId: WordId,
  ): Promise<WordType> {
    const word = await this.exerciseService.increaseMastery(ctx, wordId);

    return this.wordTypeMapper.map(word);
  }
}
