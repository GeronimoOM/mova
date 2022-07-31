import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import {
    SearchWordsParams,
    WordIndexClient,
} from 'src/clients/WordIndexClient';
import { LanguageId } from 'src/models/Language';
import { mapPage, Page, PageArgs } from 'src/models/Page';
import { PartOfSpeech, Word, WordId, WordOrder } from 'src/models/Word';
import {
    WordRepository,
    WordWithoutProperties,
    GetWordPageParams as RepoGetWordPageParams,
} from 'src/repositories/WordRepository';
import {
    isOptionProperty,
    isTextProperty,
    OptionId,
    Property,
    PropertyId,
} from 'src/models/Property';
import { PropertyValue } from 'src/models/PropertyValue';
import { PropertyService } from './PropertyService';
import { LanguageService } from './LanguageService';

export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 10;
export const QUERY_MIN_LENGTH = 3;

export interface GetWordPageParms extends PageArgs {
    languageId: LanguageId;
    query?: string;
    order?: WordOrder;
}

export interface CreateWordParams {
    original: string;
    translation: string;
    languageId: LanguageId;
    partOfSpeech: PartOfSpeech;
    properties?: Map<PropertyId, UpdatePropertyValueParams>;
}

export interface UpdateWordParams {
    id: WordId;
    original?: string;
    translation?: string;
    properties?: Map<PropertyId, UpdatePropertyValueParams>;
}

export interface UpdatePropertyValueParams {
    text?: string;
    option?: OptionId;
}

@Injectable()
export class WordService {
    constructor(
        private wordRepository: WordRepository,
        private wordIndexClient: WordIndexClient,
        private propertyService: PropertyService,
        private languageService: LanguageService,
    ) {}

    async getPage(params: GetWordPageParms): Promise<Page<Word>> {
        if (!params.start) {
            params.start = 0;
        }
        if (!params.limit) {
            params.limit = DEFAULT_LIMIT;
        }
        if (!params.order) {
            params.order = WordOrder.Chronological;
        }

        params.start = Math.max(0, params.start);
        params.limit = Math.min(MAX_LIMIT, params.limit);

        let words: Page<WordWithoutProperties>;
        if (params.query && params.query.length >= QUERY_MIN_LENGTH) {
            const wordIds = await this.wordIndexClient.search(
                params as SearchWordsParams,
            );
            const repoWords = await this.wordRepository.getByIds(wordIds.items);
            const wordById = new Map(repoWords.map((word) => [word.id, word]));
            words = mapPage(wordIds, (wordId) => wordById.get(wordId)!);
        } else {
            words = await this.wordRepository.getPage(
                params as RepoGetWordPageParams,
            );
        }

        const propertyIds = words.items.reduce<Set<PropertyId>>(
            (propertyIds, word) => {
                if (word.properties) {
                    for (const propertyId of word.properties.keys()) {
                        propertyIds.add(propertyId);
                    }
                }
                return propertyIds;
            },
            new Set(),
        );
        const properties = await this.propertyService.getByIds(
            Array.from(propertyIds),
        );

        return mapPage(words, (word) => this.withProperties(word, properties));
    }

    async create(params: CreateWordParams): Promise<Word> {
        const language = await this.languageService.getById(params.languageId);
        if (!language) {
            throw new Error('Language does not exist');
        }

        const word: Word = {
            id: uuid(),
            original: params.original,
            translation: params.translation,
            languageId: params.languageId,
            partOfSpeech: params.partOfSpeech,
        };

        if (params.properties) {
            const properties = await this.propertyService.getByLanguageId(
                word.languageId,
                word.partOfSpeech,
            );

            this.setPropertyValues(word, properties, params.properties);
        }

        await Promise.all([
            this.wordRepository.create(word),
            this.wordIndexClient.index(word),
        ]);

        return word;
    }

    async update(params: UpdateWordParams): Promise<Word> {
        const wordWithoutProperties = await this.wordRepository.getById(
            params.id,
        );
        if (!wordWithoutProperties) {
            throw new Error('Word does not exist');
        }

        const properties = await this.propertyService.getByLanguageId(
            wordWithoutProperties.languageId,
            wordWithoutProperties.partOfSpeech,
        );
        const word = this.withProperties(wordWithoutProperties, properties);

        if (params.original) {
            word.original = params.original;
        }

        if (params.translation) {
            word.translation = params.translation;
        }

        if (params.properties) {
            this.setPropertyValues(word, properties, params.properties);
        }

        await Promise.all([
            this.wordRepository.update(word),
            this.wordIndexClient.index(word),
        ]);
        return word;
    }

    async delete(id: WordId): Promise<Word> {
        const wordWithoutProperties = await this.wordRepository.getById(id);
        if (!wordWithoutProperties) {
            throw new Error('Word does not exist');
        }

        const properties = await this.propertyService.getByLanguageId(
            wordWithoutProperties.languageId,
            wordWithoutProperties.partOfSpeech,
        );
        const word = this.withProperties(wordWithoutProperties, properties);

        await Promise.all([
            this.wordRepository.delete(id),
            this.wordIndexClient.delete(id),
        ]);

        return word;
    }

    private setPropertyValues(
        word: Word,
        properties: Property[],
        propertyValues: Map<PropertyId, UpdatePropertyValueParams>,
    ) {
        word.properties = word.properties ?? new Map();

        for (const [propertyId, propertyValue] of propertyValues) {
            const property = properties.find(
                (property) => property.id === propertyId,
            );
            if (!property) {
                throw new Error('Property is not valid for word');
            }

            if (isTextProperty(property)) {
                if (!propertyValue.text || !propertyValue.text.length) {
                    word.properties.delete(propertyId);
                } else {
                    word.properties.set(propertyId, {
                        property,
                        text: propertyValue.text,
                    });
                }
            } else if (isOptionProperty(property)) {
                if (!propertyValue.option || !propertyValue.option.length) {
                    word.properties.delete(propertyId);
                } else if (!property.options.has(propertyValue.option)) {
                    throw new Error('Options is not valid for property');
                } else {
                    word.properties.set(propertyId, {
                        property,
                        option: propertyValue.option,
                    });
                }
            }
        }

        if (!word.properties.size) {
            delete word.properties;
        }
    }

    private withProperties(
        word: WordWithoutProperties,
        properties: Property[],
    ): Word {
        if (!word.properties) {
            return word as Word;
        }

        const propertyValues = new Map<PropertyId, PropertyValue>();
        for (const [propertyId, propertyValue] of word.properties) {
            const property = properties.find(
                (property) => property.id === propertyId,
            );
            if (!property) {
                continue;
            }

            propertyValues.set(propertyId, {
                property,
                ...propertyValue,
            } as PropertyValue);
        }

        return {
            ...word,
            properties: propertyValues.size ? propertyValues : undefined,
        };
    }
}
