import * as elastic from '@elastic/elasticsearch';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { LanguageId } from 'src/models/Language';
import { Page, PageArgs } from 'src/models/Page';
import {
    isTextPropertyValue,
    TextPropertyValue,
} from 'src/models/PropertyValue';
import { Word, WordId } from 'src/models/Word';

export const WORDS_INDEX = 'words';

export type WordDocument = Omit<Word, 'properties'> & {
    properties?: string[];
};

export interface SearchWordsParams extends Required<PageArgs> {
    languageId: LanguageId;
    query: string;
}

@Injectable()
export class WordIndexClient implements OnApplicationBootstrap {
    private client: elastic.Client;

    async onApplicationBootstrap() {
        await this.connect();
    }

    async connect(): Promise<void> {
        this.client = new elastic.Client({
            //TODO extract
            node: 'http://mova-index:9200',
        });

        await this.createIndex();
        Logger.log('Search index ready');
    }

    async createIndex(): Promise<void> {
        if (
            await this.client.indices.exists({
                index: WORDS_INDEX,
            })
        ) {
            return;
        }

        await this.client.indices.create({
            index: WORDS_INDEX,
            mappings: {
                properties: {
                    original: {
                        type: 'text',
                    },
                    translation: {
                        type: 'text',
                    },
                    properties: {
                        type: 'text',
                    },
                    languageId: {
                        type: 'keyword',
                    },
                    partOfSpeech: {
                        type: 'keyword',
                    },
                },
            },
        });
    }

    async search({
        languageId,
        query,
        start,
        limit,
    }: SearchWordsParams): Promise<Page<WordId>> {
        const searchResponse = await this.client.search<WordDocument>({
            index: WORDS_INDEX,
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                languageId,
                            },
                        },
                        {
                            multi_match: {
                                query,
                                fields: [
                                    'original',
                                    'translation',
                                    'properties',
                                ],
                                fuzziness: 'AUTO',
                            },
                        },
                    ],
                },
            },
            from: start,
            size: limit,
        });

        return {
            items: searchResponse.hits.hits.map(
                (wordDocument) => wordDocument._id,
            ),
            hasMore: searchResponse.hits.total > start + limit,
        };
    }

    async index(word: Word): Promise<void> {
        await this.client.index<WordDocument>({
            id: word.id,
            index: WORDS_INDEX,
            document: this.toDocument(word),
        });
    }

    async delete(id: WordId): Promise<void> {
        await this.client.delete({
            id,
            index: WORDS_INDEX,
        });
    }

    private toDocument(word: Word): WordDocument {
        return {
            id: word.id,
            original: word.original,
            translation: word.translation,
            languageId: word.languageId,
            partOfSpeech: word.partOfSpeech,
            properties: word.properties
                ? [...word.properties.values()]
                      .filter((value): value is TextPropertyValue =>
                          isTextPropertyValue(value),
                      )
                      .map((value) => value.text)
                : undefined,
        };
    }
}
