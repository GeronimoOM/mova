import {
  Args,
  Context as ContextDec,
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
import { DateTime } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Direction, Page, encodePageCursor, mapPage } from 'models/Page';
import {
  ProgressCadence,
  ProgressType as ProgressTypeEnum,
} from 'models/Progress';
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

@Resolver((of) => LanguageType)
export class LanguageResolver {
  constructor(
    private languageService: LanguageService,
    private propertyService: PropertyService,
    private wordService: WordService,
    private progressService: ProgressService,
    private propertyTypeMapper: PropertyTypeMapper,
    private wordTypeMapper: WordTypeMapper,
  ) {}

  @Query((type) => [LanguageType])
  async languages(): Promise<LanguageType[]> {
    return await this.languageService.getAll();
  }

  @Query((type) => LanguageType, { nullable: true })
  async language(
    @Args('id', { type: () => ID }) id: LanguageId,
  ): Promise<LanguageType | null> {
    return this.languageService.getById(id).catch(() => null);
  }

  @Mutation((returns) => LanguageType)
  async createLanguage(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: CreateLanguageInput,
  ): Promise<LanguageType> {
    const createdLanguage = await this.languageService.create(ctx, input);
    return createdLanguage;
  }

  @Mutation((returns) => LanguageType)
  async updateLanguage(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: UpdateLanguageInput,
  ): Promise<LanguageType> {
    const updatedLanguage = await this.languageService.update(ctx, input);
    return updatedLanguage;
  }

  @Mutation((returns) => LanguageType)
  async deleteLanguage(
    @ContextDec('ctx') ctx: Context,
    @Args('input') input: DeleteLanguageInput,
  ): Promise<LanguageType> {
    const deletedLanguage = await this.languageService.delete(ctx, input);
    return deletedLanguage;
  }

  @ResolveField((type) => [PropertyUnionType])
  async properties(
    @Parent() language: LanguageType,
    @Args('partOfSpeech', { type: () => PartOfSpeech, nullable: true })
    partOfSpeech?: PartOfSpeech,
  ): Promise<Array<typeof PropertyUnionType>> {
    const properties = await this.propertyService.getByLanguageId(
      language.id,
      partOfSpeech,
    );

    return properties.map((property) => this.propertyTypeMapper.map(property));
  }

  @ResolveField((type) => WordPageType)
  async words(
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
    const wordPage = await this.wordService.getPage({
      languageId: language.id,
      query,
      partsOfSpeech,
      order,
      direction,
      cursor: pageArgs.cursor
        ? decodeCursor(pageArgs.cursor, WordCursor)
        : null,
      limit: pageArgs.limit,
    });

    return encodePageCursor(
      mapPage(wordPage, (word) => this.wordTypeMapper.map(word)),
    );
  }

  @ResolveField((type) => WordsStatsType)
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

  @ResolveField((type) => [GoalType])
  async goals(@Parent() language: LanguageType): Promise<GoalType[]> {
    return await this.progressService.getGoals(language.id);
  }

  @ResolveField((type) => ProgressType)
  async progress(
    @ContextDec('ctx') ctx: Context,
    @Parent() language: LanguageType,
    @Args('type', { type: () => ProgressTypeEnum })
    type: ProgressTypeEnum,
    @Args('cadence', { type: () => ProgressCadence, nullable: true })
    cadence?: ProgressCadence,
  ): Promise<ProgressType> {
    const currentProgress = await this.progressService.getCurrentProgress(
      ctx,
      language.id,
      type,
      cadence,
    );

    return {
      type,
      cadence: currentProgress.cadence,
      current: currentProgress,
    };
  }
}
