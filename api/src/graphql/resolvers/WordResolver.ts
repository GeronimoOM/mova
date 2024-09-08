import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { WordId } from 'models/Word';
import { WordService } from 'services/WordService';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import {
  CreateWordInput,
  DeleteWordInput,
  UpdateWordInput,
  WordType,
} from '../types/WordType';

@Resolver((of) => WordType)
export class WordResolver {
  constructor(
    private wordService: WordService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query((type) => WordType, { nullable: true })
  async word(
    @ContextDec() ctx: Context,
    @Args('id', { type: () => ID }) id: WordId,
  ): Promise<WordType | null> {
    const word = await this.wordService.getById(ctx, id).catch(() => null);
    return word ? this.wordTypeMapper.map(word) : null;
  }

  @Mutation((returns) => WordType)
  async createWord(
    @ContextDec() ctx: Context,
    @Args('input') input: CreateWordInput,
  ): Promise<WordType> {
    const createdWord = await this.wordService.create(
      ctx,
      this.wordTypeMapper.mapFromCreateInput(input),
    );
    return this.wordTypeMapper.map(createdWord);
  }

  @Mutation((returns) => WordType)
  async updateWord(
    @ContextDec() ctx: Context,
    @Args('input') input: UpdateWordInput,
  ): Promise<WordType> {
    const updatedWord = await this.wordService.update(
      ctx,
      this.wordTypeMapper.mapFromUpdateInput(input),
    );
    return this.wordTypeMapper.map(updatedWord);
  }

  @Mutation((returns) => WordType)
  async deleteWord(
    @ContextDec() ctx: Context,
    @Args('input') input: DeleteWordInput,
  ): Promise<WordType> {
    const deletedWord = await this.wordService.delete(ctx, input);
    return this.wordTypeMapper.map(deletedWord);
  }
}
