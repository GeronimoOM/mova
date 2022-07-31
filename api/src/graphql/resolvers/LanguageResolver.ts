import {
    Query,
    Resolver,
    ID,
    Args,
    ResolveField,
    Parent,
    Mutation,
    InputType,
    Field,
} from '@nestjs/graphql';
import { LanguageId } from 'src/models/Language';
import { mapPage, Page } from 'src/models/Page';
import { PartOfSpeech, WordOrder } from 'src/models/Word';
import { LanguageService } from 'src/services/LanguageService';
import { PropertyService } from 'src/services/PropertyService';
import { WordService } from 'src/services/WordService';
import { LanguageTypeMapper } from '../mappers/LanguageTypeMapper';
import { PropertyTypeMapper } from '../mappers/PropertyTypeMapper';
import { WordTypeMapper } from '../mappers/WordTypeMapper';
import { LanguageType } from '../types/LanguageType';
import { PageArgsType } from '../types/PageType';
import { PropertyUnionType } from '../types/PropertyType';
import { WordPageType, WordType } from '../types/WordType';

@InputType()
export class CreateLanguageInput {
    @Field()
    name: string;
}

@InputType()
export class UpdateLanguageInput {
    @Field((type) => ID)
    id: LanguageId;

    @Field()
    name: string;
}

@Resolver((of) => LanguageType)
export class LanguageResolver {
    constructor(
        private languageService: LanguageService,
        private propertyService: PropertyService,
        private wordService: WordService,
        private languageTypeMapper: LanguageTypeMapper,
        private propertyTypeMapper: PropertyTypeMapper,
        private wordTypeMapper: WordTypeMapper,
    ) {}

    @Query((type) => [LanguageType])
    async languages(): Promise<LanguageType[]> {
        const languages = await this.languageService.getAll();
        return languages.map((language) =>
            this.languageTypeMapper.map(language),
        );
    }

    @Query((type) => LanguageType, { nullable: true })
    async language(
        @Args('id', { type: () => ID }) id: LanguageId,
    ): Promise<LanguageType | null> {
        const language = await this.languageService.getById(id);
        return language ? this.languageTypeMapper.map(language) : null;
    }

    @Mutation((returns) => LanguageType)
    async createLanguage(
        @Args('input') input: CreateLanguageInput,
    ): Promise<LanguageType> {
        const createdLanguage = await this.languageService.create(input);
        return createdLanguage;
    }

    @Mutation((returns) => LanguageType)
    async updateLanguage(
        @Args('input') input: UpdateLanguageInput,
    ): Promise<LanguageType> {
        const updatedLanguage = await this.languageService.update(input);
        return updatedLanguage;
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
        return properties.map((property) =>
            this.propertyTypeMapper.map(property),
        );
    }

    @ResolveField((type) => WordPageType)
    async words(
        @Parent() language: LanguageType,
        @Args() pageArgs: PageArgsType,
        @Args('query', { nullable: true }) query?: string,
        @Args('order', { type: () => WordOrder, nullable: true })
        order: WordOrder = WordOrder.Chronological,
    ): Promise<Page<WordType>> {
        const wordPage = await this.wordService.getPage({
            languageId: language.id,
            query,
            order,
            ...pageArgs,
        });

        return mapPage(wordPage, (word) => this.wordTypeMapper.map(word));
    }
}
