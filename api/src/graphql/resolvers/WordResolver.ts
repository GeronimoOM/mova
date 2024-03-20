import {
  Args,
  ID,
  Mutation,
  Resolver,
  Query,
  Context as ContextDec,
} from '@nestjs/graphql';
import {
  CreateWordInput,
  DeleteWordInput,
  UpdateWordInput,
  WordType,
} from '../types/WordType';
import { WordService } from 'services/WordService';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import { WordId } from 'models/Word';
import { Context } from 'models/Context';

@Resolver((of) => WordType)
export class WordResolver {
  constructor(
    private wordService: WordService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query((type) => WordType, { nullable: true })
  async word(
    @Args('id', { type: () => ID }) id: WordId,
  ): Promise<WordType | null> {
    const word = await this.wordService.getById(id).catch(() => null);
    return word ? this.wordTypeMapper.map(word) : null;
  }

  @Mutation((returns) => WordType)
  async createWord(
    @ContextDec('ctx') ctx: Context,
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
    @ContextDec('ctx') ctx: Context,
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
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: DeleteWordInput,
  ): Promise<WordType> {
    const deletedWord = await this.wordService.delete(ctx, input);
    return this.wordTypeMapper.map(deletedWord);
  }
}
