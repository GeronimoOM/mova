import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import { Page, PageArgs, StartCursor, emptyPage } from 'models/Page';
import { isTextPropertyValue, TextPropertyValue } from 'models/PropertyValue';
import { Topic, TopicId } from 'models/Topic';
import { PartOfSpeech, Word, WordId } from 'models/Word';
import { ElasticClientManager } from './ElasticClientManager';
import {
  INDEX_SETTINGS,
  INDEX_TOPICS,
  INDEX_TO_MAPPING,
  INDEX_WORDS,
  IndexType,
} from './elasticConfig';
import {
  QueryDslQueryContainer,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { decodeCursor, encodeCursor } from 'utils/cursors';

export type WordDocument = Omit<Word, 'properties' | 'topics'> & {
  properties?: string[];
  topics?: TopicId[];
};

export type TopicDocument = Topic;

export interface SearchWordsParams extends PageArgs {
  languageId: LanguageId;
  query: string;
  partsOfSpeech?: PartOfSpeech[];
  topics?: TopicId[];
}

export interface SearchTopicsParams extends Required<PageArgs> {
  languageId: LanguageId;
  query: string;
}

@Injectable()
export class SearchClient implements OnApplicationBootstrap {
  constructor(private elasticClientManager: ElasticClientManager) {}

  async searchWords({
    languageId,
    query,
    partsOfSpeech,
    topics,
    cursor,
    limit,
  }: SearchWordsParams): Promise<Page<WordId>> {
    const indexExists = await this.indexExists(INDEX_WORDS);
    if (!indexExists) {
      return emptyPage();
    }

    const decodedCursor = cursor ? decodeCursor(cursor, StartCursor) : null;
    const { start = 0 } = decodedCursor ?? {};

    const queryFilters: QueryDslQueryContainer[] = [{ term: { languageId } }];

    if (partsOfSpeech?.length) {
      queryFilters.push({
        bool: {
          should: partsOfSpeech.map((partOfSpeech) => ({
            term: { partOfSpeech },
          })),
        },
      });
    }

    if (topics?.length) {
      queryFilters.push({
        bool: {
          should: topics.map((topic) => ({
            term: { topics: topic },
          })),
        },
      });
    }

    query = query.toLowerCase();

    const queryShould: QueryDslQueryContainer[] = [
      { fuzzy: { original: { value: query, boost: 1 } } },
      { prefix: { original: { value: query, boost: 2 } } },
      { fuzzy: { translation: { value: query, boost: 1 } } },
      { prefix: { translation: { value: query, boost: 2 } } },
      { fuzzy: { properties: { value: query, boost: 1 } } },
      { prefix: { properties: { value: query, boost: 2 } } },
    ];

    const searchResponse = await this.getClient().search<WordDocument>({
      index: INDEX_WORDS,
      query: {
        bool: {
          filter: queryFilters,
          should: queryShould,
          minimum_should_match: 1,
        },
      },
      from: start,
      size: limit,
    });

    return this.toPage(searchResponse, start, limit);
  }

  async searchTopics({
    languageId,
    query,
    cursor,
    limit,
  }: SearchTopicsParams): Promise<Page<TopicId>> {
    const indexExists = await this.indexExists(INDEX_TOPICS);
    if (!indexExists) {
      return emptyPage();
    }

    const decodedCursor = cursor ? decodeCursor(cursor, StartCursor) : null;
    const { start = 0 } = decodedCursor ?? {};

    const filterQuery: QueryDslQueryContainer = {
      match: {
        languageId,
      },
    };
    const searchQuery: QueryDslQueryContainer = {
      match: {
        name: {
          query,
          fuzziness: 'AUTO',
        },
      },
    };

    const searchResponse = await this.getClient().search<TopicDocument>({
      index: INDEX_TOPICS,
      query: {
        bool: {
          must: [filterQuery, searchQuery],
        },
      },
      from: start,
      size: limit,
    });

    return this.toPage(searchResponse, start, limit);
  }

  async indexWord(word: Word): Promise<void> {
    await this.getClient().index<WordDocument>({
      index: INDEX_WORDS,
      id: word.id,
      document: this.wordToDocument(word),
    });
  }

  async indexWords(words: Word[]): Promise<void> {
    if (!words.length) {
      return;
    }

    await this.getClient().bulk<WordDocument>({
      operations: words.flatMap((word) => [
        {
          index: {
            _index: INDEX_WORDS,
            _id: word.id,
          },
        },
        this.wordToDocument(word),
      ]),
    });
  }

  async deleteWord(id: WordId): Promise<void> {
    await this.getClient().delete({
      id,
      index: INDEX_WORDS,
    });
  }

  async indexTopic(topic: Topic): Promise<void> {
    await this.getClient().index<TopicDocument>({
      index: INDEX_TOPICS,
      id: topic.id,
      document: {
        id: topic.id,
        name: topic.name.toLowerCase(),
        languageId: topic.languageId,
      },
    });
  }

  async indexTopics(topics: Topic[]): Promise<void> {
    if (!topics.length) {
      return;
    }

    await this.getClient().bulk<TopicDocument>({
      operations: topics.flatMap((topic) => [
        {
          index: {
            _index: INDEX_TOPICS,
            _id: topic.id,
          },
        },
        topic,
      ]),
    });
  }

  async deleteTopic(id: TopicId): Promise<void> {
    await this.getClient().delete({
      id,
      index: INDEX_TOPICS,
    });
  }

  async deleteLanguageWords(languageId: LanguageId): Promise<void> {
    await this.deleteLanguageInIndex(INDEX_WORDS, languageId);
  }

  async deleteLanguageTopics(languageId: LanguageId): Promise<void> {
    await this.deleteLanguageInIndex(INDEX_TOPICS, languageId);
  }

  async onApplicationBootstrap() {
    await this.createIndices();

    Logger.log('Search indices created');
  }

  private getClient() {
    return this.elasticClientManager.getClient();
  }

  async createIndices(): Promise<void> {
    for (const [index, mappings] of Object.entries(INDEX_TO_MAPPING)) {
      const indexExists = await this.indexExists(index);
      if (!indexExists) {
        await this.getClient().indices.create({
          index,
          mappings,
          settings: INDEX_SETTINGS,
        });
      }
    }
  }

  async deleteIndices(): Promise<void> {
    await this.getClient().indices.delete({
      index: [INDEX_WORDS, INDEX_TOPICS],
    });
  }

  private async deleteLanguageInIndex(
    index: IndexType,
    languageId: LanguageId,
  ): Promise<void> {
    const indexExists = await this.indexExists(index);
    if (indexExists) {
      await this.getClient().deleteByQuery({
        index,
        query: {
          match: {
            languageId,
          },
        },
      });
    }
  }

  private async indexExists(index: IndexType): Promise<boolean> {
    return await this.getClient().indices.exists({
      index,
    });
  }

  private wordToDocument(word: Word): WordDocument {
    return {
      id: word.id,
      original: word.original.toLowerCase(),
      translation: word.translation.toLowerCase(),
      languageId: word.languageId,
      partOfSpeech: word.partOfSpeech,
      properties: word.properties
        ? [...word.properties.values()]
            .filter((value): value is TextPropertyValue =>
              isTextPropertyValue(value),
            )
            .map((value) => value.text.toLowerCase())
        : undefined,
      ...(word.topics && {
        topics: word.topics.map((topic) => topic.id),
      }),
    };
  }

  private toPage<T>(
    searchResponse: SearchResponse<T>,
    start: number,
    limit: number,
  ) {
    return {
      items: searchResponse.hits.hits.map((doc) => doc._id),
      ...((searchResponse.hits.total as number) > start + limit && {
        nextCursor: encodeCursor<StartCursor>({ start: start + limit }),
      }),
    };
  }
}
