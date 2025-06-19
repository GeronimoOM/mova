import {
  QueryDslQueryContainer,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import { Page, StartCursor, emptyPage } from 'models/Page';
import { TextPropertyValue, isTextPropertyValue } from 'models/PropertyValue';
import { PartOfSpeech, Word, WordId } from 'models/Word';
import { DEFAULT_LIMIT } from 'utils/constants';
import { ElasticClientManager } from './ElasticClientManager';
import {
  INDEX_SETTINGS,
  INDEX_TO_MAPPING,
  INDEX_WORDS,
  IndexType,
} from './elasticConfig';

export type WordDocument = Pick<
  Word,
  'id' | 'original' | 'translation' | 'languageId' | 'partOfSpeech'
>;

export interface SearchWordsParams {
  languageId: LanguageId;
  query: string;
  partsOfSpeech?: PartOfSpeech[];
  cursor?: StartCursor;
  limit?: number;
}

@Injectable()
export class SearchClient implements OnApplicationBootstrap {
  constructor(private elasticClientManager: ElasticClientManager) {}

  async searchWords({
    languageId,
    query,
    partsOfSpeech,
    cursor,
    limit = DEFAULT_LIMIT,
  }: SearchWordsParams): Promise<Page<WordId, StartCursor>> {
    const indexExists = await this.indexExists(INDEX_WORDS);
    if (!indexExists) {
      return emptyPage();
    }

    const start = cursor?.start ?? 0;
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

    query = query.toLowerCase();

    const queryShould: QueryDslQueryContainer[] = [
      {
        match: {
          original: {
            query,
            fuzziness: 'AUTO',
            prefix_length: 2,
          },
        },
      },
      { prefix: { original: query } },
      {
        match: {
          translation: { query },
        },
      },
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

  async deleteLanguageWords(languageId: LanguageId): Promise<void> {
    await this.deleteLanguageInIndex(INDEX_WORDS, languageId);
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
      index: [INDEX_WORDS],
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
      original: [
        word.original.toLowerCase(),
        ...Object.values(word.properties ?? {})
          .filter((value): value is TextPropertyValue =>
            isTextPropertyValue(value),
          )
          .map((value) => value.text.toLowerCase()),
      ].join(' '),
      translation: word.translation.toLowerCase(),
      languageId: word.languageId,
      partOfSpeech: word.partOfSpeech,
    };
  }

  private toPage<T>(
    searchResponse: SearchResponse<T>,
    start: number,
    limit: number,
  ): Page<string, StartCursor> {
    return {
      items: searchResponse.hits.hits.map((doc) => doc._id as WordId),
      ...((searchResponse.hits.total as number) > start + limit && {
        nextCursor: {
          start: start + limit,
        },
      }),
    };
  }
}
