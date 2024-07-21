import {
  Args,
  Context as ContextDec,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TopicPageType, TopicType } from 'graphql/types/TopicType';
import { WordsStatsType } from 'graphql/types/WordsDateStatsType';
import { DateTime } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Direction, Page, encodePageCursor, mapPage } from 'models/Page';
import { TopicCursor, TopicId } from 'models/Topic';
import { PartOfSpeech, WordCursor, WordOrder } from 'models/Word';
import { LanguageService } from 'services/LanguageService';
import { PropertyService } from 'services/PropertyService';
import { TopicService } from 'services/TopicService';
import { WordService } from 'services/WordService';
import { DATE_FORMAT } from 'utils/constants';
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
    private topicService: TopicService,
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

  @ResolveField((type) => TopicPageType)
  async topics(
    @Parent() language: LanguageType,
    @Args() pageArgs: PageArgsType,
    @Args('query', { nullable: true }) query?: string,
  ): Promise<Page<TopicType, string>> {
    const topicPage = await this.topicService.getPage({
      languageId: language.id,
      query,
      cursor: pageArgs.cursor
        ? decodeCursor(pageArgs.cursor, TopicCursor)
        : null,
      limit: pageArgs.limit,
    });

    return encodePageCursor(topicPage);
  }

  @ResolveField((type) => WordPageType)
  async words(
    @Parent() language: LanguageType,
    @Args() pageArgs: PageArgsType,
    @Args('query', { nullable: true }) query?: string,
    @Args('partsOfSpeech', { type: () => [PartOfSpeech], nullable: true })
    partsOfSpeech?: PartOfSpeech[],
    @Args('topics', { type: () => [ID], nullable: true })
    topics?: TopicId[],
    @Args('order', { type: () => WordOrder, nullable: true })
    order?: WordOrder,
    @Args('direction', { type: () => Direction, nullable: true })
    direction?: Direction,
  ): Promise<Page<WordType, string>> {
    const wordPage = await this.wordService.getPage({
      languageId: language.id,
      query,
      partsOfSpeech,
      topics,
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
  async wordsStats(
    @Parent() language: LanguageType,
    @Args('days', { type: () => Int, nullable: true })
    days?: number,
    @Args('from', { type: () => String, nullable: true })
    from?: string,
  ): Promise<WordsStatsType> {
    const stats = await this.wordService.getStats(
      language.id,
      days,
      from ? DateTime.fromFormat(from, DATE_FORMAT) : undefined,
    );

    return {
      total: stats.total,
      byDate: {
        from: stats.byDate.from.toFormat(DATE_FORMAT),
        until: stats.byDate.until.toFormat(DATE_FORMAT),
        dates: stats.byDate.dates.map(({ date, words }) => ({
          date: date.toFormat(DATE_FORMAT),
          words,
        })),
      },
    };
  }
}
