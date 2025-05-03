import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GoalType } from 'graphql/types/GoalType';
import { ProgressType } from 'graphql/types/ProgressType';
import { WordsStatsType } from 'graphql/types/WordsStatsType';
import { ContextDec } from 'middleware/ContextMiddleware';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Direction, Page, encodePageCursor, mapPage } from 'models/Page';
import { ProgressType as ProgressTypeEnum } from 'models/Progress';
import { PartOfSpeech, WordCursor, WordOrder } from 'models/Word';
import { LanguageService } from 'services/LanguageService';
import { ProgressService } from 'services/ProgressService';
import { PropertyService } from 'services/PropertyService';
import { WordService } from 'services/WordService';
import { decodeCursor } from 'utils/cursors';
import { PropertyTypeMapper } from '../mappers/PropertyTypeMapper';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import {
  CreateLanguageInput,
  DeleteLanguageInput,
  LanguageType,
  UpdateLanguageInput,
} from '../types/LanguageType';
import { PageArgsType } from '../types/PageType';
import { PropertyUnionType } from '../types/PropertyType';
import { WordPageType, WordType } from '../types/WordType';

@Resolver(() => LanguageType)
export class LanguageResolver {
  constructor(
    private languageService: LanguageService,
    private propertyService: PropertyService,
    private wordService: WordService,
    private progressService: ProgressService,
    private propertyTypeMapper: PropertyTypeMapper,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query(() => [LanguageType])
  async languages(@ContextDec() ctx: Context): Promise<LanguageType[]> {
    return await this.languageService.getAll(ctx);
  }

  @Query(() => LanguageType, { nullable: true })
  async language(
    @ContextDec() ctx: Context,
    @Args('id', { type: () => ID }) id: LanguageId,
  ): Promise<LanguageType | null> {
    return this.languageService.getById(ctx, id).catch(() => null);
  }

  @Mutation(() => LanguageType)
  async createLanguage(
    @ContextDec() ctx: Context,
    @Args('input') input: CreateLanguageInput,
  ): Promise<LanguageType> {
    const createdLanguage = await this.languageService.create(ctx, input);
    return createdLanguage;
  }

  @Mutation(() => LanguageType)
  async updateLanguage(
    @ContextDec() ctx: Context,
    @Args('input') input: UpdateLanguageInput,
  ): Promise<LanguageType> {
    const updatedLanguage = await this.languageService.update(ctx, input);
    return updatedLanguage;
  }

  @Mutation(() => LanguageType)
  async deleteLanguage(
    @ContextDec() ctx: Context,
    @Args('input') input: DeleteLanguageInput,
  ): Promise<LanguageType> {
    const deletedLanguage = await this.languageService.delete(ctx, input);
    return deletedLanguage;
  }

  @ResolveField(() => [PropertyUnionType])
  async properties(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
    @Args('partOfSpeech', { type: () => PartOfSpeech, nullable: true })
    partOfSpeech?: PartOfSpeech,
  ): Promise<Array<typeof PropertyUnionType>> {
    const properties = await this.propertyService.getByLanguageId(
      ctx,
      language.id,
      partOfSpeech,
    );

    return properties.map((property) => this.propertyTypeMapper.map(property));
  }

  @ResolveField(() => WordPageType)
  async words(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
    @Args() pageArgs: PageArgsType,
    @Args('query', { nullable: true }) query?: string,
    @Args('partsOfSpeech', { type: () => [PartOfSpeech], nullable: true })
    partsOfSpeech?: PartOfSpeech[],
    @Args('order', { type: () => WordOrder, nullable: true })
    order?: WordOrder,
    @Args('direction', { type: () => Direction, nullable: true })
    direction?: Direction,
  ): Promise<Page<WordType, string>> {
    const cursor = pageArgs.cursor
      ? decodeCursor(pageArgs.cursor, WordCursor)
      : null;

    const wordPage = await this.wordService.getPage(ctx, {
      languageId: language.id,
      query,
      partsOfSpeech,
      order,
      direction,
      ...(cursor && { cursor }),
      limit: pageArgs.limit,
    });

    return encodePageCursor(
      mapPage(wordPage, (word) => this.wordTypeMapper.map(word)),
    );
  }

  @ResolveField(() => WordType, { nullable: true })
  async word(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
    @Args('original') original: string,
  ): Promise<WordType | null> {
    const word = await this.wordService.getByOriginal(language.id, original);
    return word ? this.wordTypeMapper.map(word) : null;
  }

  @ResolveField(() => WordsStatsType)
  async stats(@Parent() language: LanguageType): Promise<WordsStatsType> {
    const wordsStats = await this.progressService.getStats(language.id);

    return {
      total: wordsStats.total,
      mastery: Object.entries(wordsStats.mastery).map(([mastery, total]) => ({
        mastery: Number(mastery),
        total,
      })),
      partsOfSpeech: Object.entries(wordsStats.partsOfSpeech).map(
        ([partOfSpeech, total]) => ({
          partOfSpeech: partOfSpeech as PartOfSpeech,
          total,
        }),
      ),
    };
  }

  @ResolveField(() => [GoalType])
  async goals(@Parent() language: LanguageType): Promise<GoalType[]> {
    return await this.progressService.getGoals(language.id);
  }

  @ResolveField(() => ProgressType)
  async progress(
    @ContextDec() ctx: Context,
    @Parent() language: LanguageType,
    @Args('type', { type: () => ProgressTypeEnum })
    type: ProgressTypeEnum,
  ): Promise<ProgressType> {
    const goal = await this.progressService.getGoal(language.id, type);
    const { cadence } = goal;

    return {
      type,
      cadence,
      goal,
      languageId: language.id,
    };
  }
}
