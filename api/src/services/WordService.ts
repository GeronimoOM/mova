import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { SearchClient, SearchWordsParams } from 'clients/SearchClient';
import { DateTime } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Direction, mapPage, Page } from 'models/Page';
import { ProgressType } from 'models/Progress';
import {
  isOptionProperty,
  isTextProperty,
  OptionId,
  Property,
  PropertyId,
} from 'models/Property';
import { PartOfSpeech, Word, WordCursor, WordId, WordOrder } from 'models/Word';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { Serializer } from 'repositories/Serializer';
import {
  GetWordPageParams as RepoGetWordPageParams,
  WordRepository,
} from 'repositories/WordRepository';
import { QUERY_MIN_LENGTH } from 'utils/constants';
import * as records from 'utils/records';
import { v1 as uuid } from 'uuid';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';
import { LanguageService } from './LanguageService';
import { ProgressService } from './ProgressService';
import { PropertyService } from './PropertyService';

export interface GetWordPageParams {
  languageId: LanguageId | LanguageId[];
  partsOfSpeech?: PartOfSpeech[];
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
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private progressService: ProgressService,
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getById(ctx: Context, wordId: WordId): Promise<Word> {
    const word = await this.wordRepository.getById(wordId);
    if (!word || !(await this.languageService.exists(ctx, word.languageId))) {
      throw new Error(`Word does not exist (id:${wordId})`);
    }

    return word;
  }

  async getPage(
    ctx: Context,
    params: GetWordPageParams,
  ): Promise<Page<Word, WordCursor>> {
    if (Array.isArray(params.languageId)) {
      await this.languageService.getByIds(ctx, params.languageId);
    } else {
      await this.languageService.getById(ctx, params.languageId);
    }

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

  async getByOriginal(
    languageId: LanguageId,
    original: string,
  ): Promise<Word | null> {
    return await this.wordRepository.getByOriginal(languageId, original);
  }

  async create(ctx: Context, params: CreateWordParams): Promise<Word> {
    await this.languageService.getById(ctx, params.languageId);

    const word: Word = {
      id: params.id ?? uuid(),
      original: params.original,
      translation: params.translation,
      languageId: params.languageId,
      partOfSpeech: params.partOfSpeech,
      mastery: 0,
      addedAt: params.addedAt ?? DateTime.utc(),
    };

    if (params.properties) {
      const properties = await this.propertyService.getByLanguageId(
        ctx,
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
      await this.progressService.saveProgress(word.languageId, {
        id: word.id,
        type: ProgressType.Words,
        date: word.addedAt,
      });
    });

    await this.searchClient.indexWord(word);

    return word;
  }

  async update(ctx: Context, params: UpdateWordParams): Promise<Word> {
    const word = await this.getById(ctx, params.id);
    const currentWord = this.serializer.copy(word);

    if (params.original) {
      word.original = params.original.trim();
    }

    if (params.translation) {
      word.translation = params.translation.trim();
    }

    if (params.properties) {
      const properties = await this.propertyService.getByLanguageId(
        ctx,
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
    const word = await this.getById(ctx, id);

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.delete(id);
      await this.changeService.create(
        this.changeBuilder.buildDeleteWordChange(ctx, word),
      );
      await this.progressService.deleteProgress(word.id);
    });

    await this.searchClient.deleteWord(id);

    return word;
  }

  async indexLanguage(languageId: LanguageId): Promise<void> {
    await this.searchClient.deleteLanguageWords(languageId);

    for await (const wordsBatch of this.wordRepository.getBatches(languageId)) {
      await this.searchClient.indexWords(wordsBatch);
    }
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.wordRepository.deleteForLanguage(languageId);
    await this.searchClient.deleteLanguageWords(languageId);
  }

  async getCount(languageId: LanguageId): Promise<number> {
    return await this.wordRepository.getCount(languageId);
  }

  async getCountByProperty(
    languageId: LanguageId,
    propertyId: PropertyId,
    partOfSpeech: PartOfSpeech,
  ): Promise<number> {
    return await this.wordRepository.getCountByProperty(
      languageId,
      propertyId,
      partOfSpeech,
    );
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
        throw new Error(
          `Property is not valid for word (wordId:${word.id},propertyId:${propertyId})`,
        );
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
          throw new Error('Option is not valid for property');
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
