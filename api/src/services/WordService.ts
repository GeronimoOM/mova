import { v1 as uuid } from 'uuid';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import { Direction, mapPage, Page } from 'models/Page';
import {
  PartOfSpeech,
  Word,
  WordCursor,
  WordId,
  WordOrder,
  WordsStats,
} from 'models/Word';
import {
  WordRepository,
  GetWordPageParams as RepoGetWordPageParams,
} from 'repositories/WordRepository';
import {
  isOptionProperty,
  isTextProperty,
  OptionId,
  Property,
  PropertyId,
} from 'models/Property';
import { PropertyService } from './PropertyService';
import { LanguageService } from './LanguageService';
import { SearchClient, SearchWordsParams } from 'clients/SearchClient';
import { TopicService } from './TopicService';
import { TopicId } from 'models/Topic';
import { DateTime } from 'luxon';
import { QUERY_MIN_LENGTH } from 'utils/constants';
import * as records from 'utils/records';
import { ChangeService } from './ChangeService';
import { ChangeBuilder } from './ChangeBuilder';
import { copy } from 'utils/copy';
import { Context } from 'models/Context';
import { DbConnectionManager } from 'repositories/DbConnectionManager';

export interface GetWordPageParams {
  languageId?: LanguageId;
  partsOfSpeech?: PartOfSpeech[];
  topics?: TopicId[];
  query?: string;
  order?: WordOrder;
  direction?: Direction;
  cursor?: WordCursor;
  limit?: number;
  from?: DateTime;
  until?: DateTime;
}

export interface CreateWordParams {
  id?: WordId;
  original: string;
  translation: string;
  languageId: LanguageId;
  partOfSpeech: PartOfSpeech;
  addedAt?: DateTime;
  properties?: Record<PropertyId, UpdatePropertyValueParams>;
}

export interface UpdateWordParams {
  id: WordId;
  original?: string;
  translation?: string;
  properties?: Record<PropertyId, UpdatePropertyValueParams>;
}

export interface UpdatePropertyValueParams {
  text?: string;
  option?: OptionId;
}

export interface DeleteWordParams {
  id: WordId;
}

@Injectable()
export class WordService {
  constructor(
    @Inject(forwardRef(() => WordRepository))
    private wordRepository: WordRepository,
    private searchClient: SearchClient,
    @Inject(forwardRef(() => PropertyService))
    private propertyService: PropertyService,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
  ) {}

  async getById(wordId: WordId): Promise<Word> {
    const word = await this.wordRepository.getById(wordId);
    if (!word) {
      throw new Error('Word does not exist');
    }

    return word;
  }

  async getPage(params: GetWordPageParams): Promise<Page<Word, WordCursor>> {
    let words: Page<Word, WordCursor>;

    if (params.query && params.query.length >= QUERY_MIN_LENGTH) {
      const wordIds = await this.searchClient.searchWords(
        params as SearchWordsParams,
      );
      const wordsByIds = await this.wordRepository.getByIds(wordIds.items);
      const wordById = records.byKey(wordsByIds, (word) => word.id);
      words = mapPage(wordIds, (wordId) => wordById[wordId]);
    } else {
      words = await this.wordRepository.getPage(
        params as RepoGetWordPageParams,
      );
    }

    return words;
  }

  async create(ctx: Context, params: CreateWordParams): Promise<Word> {
    await this.languageService.getById(params.languageId);

    const word: Word = {
      id: params.id ?? uuid(),
      original: params.original,
      translation: params.translation,
      languageId: params.languageId,
      partOfSpeech: params.partOfSpeech,
      addedAt: params.addedAt ?? DateTime.utc(),
    };

    if (params.properties) {
      const properties = await this.propertyService.getByLanguageId(
        word.languageId,
        word.partOfSpeech,
      );

      this.setPropertyValues(word, properties, params.properties);
    }

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.create(word);
      await this.changeService.create(
        this.changeBuilder.buildCreateWordChange(ctx, word),
      );
    });

    await this.searchClient.indexWord(word);

    return word;
  }

  async update(ctx: Context, params: UpdateWordParams): Promise<Word> {
    const word = await this.getById(params.id);
    const currentWord = copy(word);

    if (params.original) {
      word.original = params.original.trim();
    }

    if (params.translation) {
      word.translation = params.translation.trim();
    }

    if (params.properties) {
      const properties = await this.propertyService.getByLanguageId(
        word.languageId,
        word.partOfSpeech,
      );

      this.setPropertyValues(word, properties, params.properties);
    }

    const change = this.changeBuilder.buildUpdateWordChange(
      ctx,
      word,
      currentWord,
    );

    if (change) {
      await this.connectionManager.transactionally(async () => {
        await this.wordRepository.update(word);
        await this.changeService.create(change);
      });
    }

    await this.searchClient.indexWord(word);

    return word;
  }

  async delete(ctx: Context, { id }: DeleteWordParams): Promise<Word> {
    const word = await this.getById(id);

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.delete(id);
      await this.changeService.create(
        this.changeBuilder.buildDeleteWordChange(ctx, word),
      );
    });

    await this.searchClient.deleteWord(id);

    return word;
  }

  async index(wordId: WordId): Promise<void> {
    const word = await this.getById(wordId);

    word.topics = await this.topicService.getForWord(word.id);

    await this.searchClient.indexWord(word);
  }

  async indexLanguage(languageId: LanguageId): Promise<void> {
    await this.searchClient.deleteLanguageWords(languageId);

    for await (const wordsBatch of this.wordRepository.getBatches(languageId)) {
      const topicsByWords = await this.topicService.getForWords(
        wordsBatch.map((word) => word.id),
      );

      const words = wordsBatch.map((word) => ({
        ...word,
        topics: topicsByWords[word.id],
      }));

      await this.searchClient.indexWords(words);
    }
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.wordRepository.deleteForLanguage(languageId);
    await this.searchClient.deleteLanguageWords(languageId);
  }

  async getCount(languageId: LanguageId): Promise<number> {
    return await this.wordRepository.getCount(languageId);
  }

  async getStats(
    languageId: LanguageId,
    days: number = DateTime.utc().diff(
      DateTime.utc().minus({ months: 3 }),
      'days',
    ).days,
    from: DateTime = DateTime.utc().minus({ days }).plus({ day: 1 }),
  ): Promise<WordsStats> {
    const until = from.plus({ days });
    const [count, dates] = await Promise.all([
      this.wordRepository.getCount(languageId),
      this.wordRepository.getDateStats(languageId, from, until),
    ]);

    return {
      total: {
        words: count,
      },
      byDate: {
        from,
        until,
        dates,
      },
    };
  }

  private setPropertyValues(
    word: Word,
    properties: Property[],
    propertyValues: Record<PropertyId, UpdatePropertyValueParams>,
  ): void {
    word.properties = word.properties ?? {};

    for (const [propertyId, propertyValue] of Object.entries(propertyValues)) {
      const property = properties.find(
        (property) => property.id === propertyId,
      );
      if (!property) {
        throw new Error('Property is not valid for word');
      }

      if (isTextProperty(property)) {
        if (!propertyValue.text) {
          delete word.properties[propertyId];
        } else {
          word.properties[propertyId] = {
            property,
            text: propertyValue.text.trim(),
          };
        }
      } else if (isOptionProperty(property)) {
        if (!propertyValue.option) {
          delete word.properties[propertyId];
        } else if (!property.options[propertyValue.option]) {
          throw new Error('Options is not valid for property');
        } else {
          word.properties[propertyId] = {
            property,
            option: propertyValue.option,
          };
        }
      }
    }

    if (!Object.keys(word.properties).length) {
      delete word.properties;
    }
  }
}
