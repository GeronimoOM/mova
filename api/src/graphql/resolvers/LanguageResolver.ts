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
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Direction, Page, encodePageCursor, mapPage } from 'models/Page';
import { PartOfSpeech, WordCursor, WordOrder } from 'models/Word';
import { LanguageService } from 'services/LanguageService';
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
}
