import { v1 as uuid } from 'uuid';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import { mapPage, Page, PageArgs } from 'models/Page';
import { PartOfSpeech, Word, WordId, WordOrder, WordsStats } from 'models/Word';
import {
  WordRepository,
  WordWithoutProperties,
  GetWordPageParams as RepoGetWordPageParams,
} from 'repositories/WordRepository';
import {
  isOptionProperty,
  isTextProperty,
  OptionId,
  Property,
  PropertyId,
} from 'models/Property';
import { PropertyValue } from 'models/PropertyValue';
import { PropertyService } from './PropertyService';
import { LanguageService } from './LanguageService';
import { SearchClient, SearchWordsParams } from 'clients/SearchClient';
import { TopicService } from './TopicService';
import { TopicId } from 'models/Topic';
import { DateTime } from 'luxon';
import { DEFAULT_LIMIT, MAX_LIMIT, QUERY_MIN_LENGTH } from 'utils/constants';

export interface GetWordPageParams extends PageArgs {
  languageId: LanguageId;
  partsOfSpeech?: PartOfSpeech[];
  topics?: TopicId[];
  query?: string;
  order?: WordOrder;
  from?: DateTime;
  until?: DateTime;
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
    private searchClient: SearchClient,
    private propertyService: PropertyService,
    @Inject(forwardRef(() => TopicService))
    private topicService: TopicService,
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
  ) {}

  async getById(wordId: WordId): Promise<Word> {
    const repoWord = await this.wordRepository.getById(wordId);
    if (!repoWord) {
      throw new Error('Word does not exist');
    }

    const properties = await this.propertyService.getByLanguageId(
      repoWord.languageId,
      repoWord.partOfSpeech,
    );

    return this.withProperties(repoWord, properties);
  }

  async getPage(params: GetWordPageParams): Promise<Page<Word>> {
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
      const wordIds = await this.searchClient.searchWords(
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
    await this.languageService.getById(params.languageId);

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

    await this.wordRepository.create(word);

    await this.searchClient.indexWord(word);

    return word;
  }

  async update(params: UpdateWordParams): Promise<Word> {
    const wordWithoutProperties = await this.wordRepository.getById(params.id);
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

    await this.wordRepository.update(word);

    await this.searchClient.indexWord(word);

    return word;
  }

  async delete(id: WordId): Promise<Word> {
    const word = this.getById(id);

    await this.wordRepository.delete(id);

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

    const properties = await this.propertyService.getByLanguageId(languageId);

    for await (const wordsBatch of this.wordRepository.getBatches(languageId)) {
      const topicsByWords = await this.topicService.getForWords(
        wordsBatch.map((word) => word.id),
      );

      const words = wordsBatch.map((word) => ({
        ...this.withProperties(word, properties),
        topics: topicsByWords.get(word.id),
      }));

      await this.searchClient.indexWords(words);
    }
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.wordRepository.deleteForLanguage(languageId);
    await this.searchClient.deleteLanguageWords(languageId);
  }

  async getStats(
    languageId: LanguageId,
    days: number = DateTime.now().diff(DateTime.now().minus({ months: 3 }), 'days').days,
    from: DateTime = DateTime.now().minus({ days }).plus({ day: 1 }),
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
    for (const property of properties) {
      const propertyValue = word.properties.get(property.id);
      if (!propertyValue) {
        continue;
      }

      propertyValues.set(property.id, {
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
