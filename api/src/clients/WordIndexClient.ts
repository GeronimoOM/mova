import * as elastic from '@elastic/elasticsearch';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { LanguageId } from 'src/models/Language';
import { Page, PageArgs } from 'src/models/Page';
import {
    isTextPropertyValue,
    TextPropertyValue,
} from 'src/models/PropertyValue';
import { Word, WordId } from 'src/models/Word';
import { retry } from 'src/utils/retry';

const WORDS_INDEX = 'words';

const CONNECT_RETRY = 5000; // ms

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
        await retry(async () => {
            this.client = new elastic.Client({
                //TODO extract
                node: 'http://mova-index:9200',
            });

            await this.createIndex();
        }, CONNECT_RETRY);

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
            index: WORDS_INDEX,
            id: word.id,
            document: this.toDocument(word),
        });
    }

    async indexMany(words: Word[]): Promise<void> {
        await this.client.bulk<WordDocument>({
            operations: words.flatMap((word) => [
                {
                    index: {
                        _index: WORDS_INDEX,
                        _id: word.id,
                    },
                },
                this.toDocument(word),
            ]),
        });
    }

    async delete(id: WordId): Promise<void> {
        await this.client.delete({
            id,
            index: WORDS_INDEX,
        });
    }

    async deleteLanguage(languageId: LanguageId): Promise<void> {
        await this.client.deleteByQuery({
            index: WORDS_INDEX,
            query: {
                match: {
                    languageId,
                },
            },
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
