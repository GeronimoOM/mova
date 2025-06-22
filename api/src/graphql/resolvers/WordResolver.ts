import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  CreateWordLinkInput,
  DeleteWordLinkInput,
  WordLinkObjectType,
} from 'graphql/types/WordLinkType';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { WordId, WordLinkType } from 'models/Word';
import { WordService } from 'services/WordService';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import {
  CreateWordInput,
  DeleteWordInput,
  UpdateWordInput,
  WordType,
} from '../types/WordType';

@Resolver(() => WordType)
export class WordResolver {
  constructor(
    private wordService: WordService,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query(() => WordType, { nullable: true })
  async word(
    @ContextDec() ctx: Context,
    @Args('id', { type: () => ID }) id: WordId,
  ): Promise<WordType | null> {
    const word = await this.wordService.getById(ctx, id).catch(() => null);
    return word ? this.wordTypeMapper.map(word) : null;
  }

  @ResolveField(() => [WordType])
  async links(
    @ContextDec() ctx: Context,
    @Parent() word: WordType,
    @Args('type', { type: () => WordLinkType }) type: WordLinkType,
  ): Promise<WordType[]> {
    const words = await this.wordService.getLinked(ctx, word.id, type);
    return words.map((word) => this.wordTypeMapper.map(word));
  }

  @Mutation(() => WordType)
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

  @Mutation(() => WordType)
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

  @Mutation(() => WordType)
  async deleteWord(
    @ContextDec() ctx: Context,
    @Args('input') input: DeleteWordInput,
  ): Promise<WordType> {
    const deletedWord = await this.wordService.delete(ctx, input);
    return this.wordTypeMapper.map(deletedWord);
  }

  @Mutation(() => WordLinkObjectType)
  async createLink(
    @ContextDec() ctx: Context,
    @Args('input') input: CreateWordLinkInput,
  ): Promise<WordLinkObjectType> {
    return await this.wordService.createLink(ctx, input);
  }

  @Mutation(() => WordLinkObjectType)
  async deleteLink(
    @ContextDec() ctx: Context,
    @Args('input') input: DeleteWordLinkInput,
  ): Promise<WordLinkObjectType> {
    return await this.wordService.deleteLink(ctx, input);
  }
}
