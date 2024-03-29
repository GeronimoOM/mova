import { v1 as uuid } from 'uuid';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {
  TopicRepository,
  GetTopicPageParams as RepoGetTopicPageParams,
} from 'repositories/TopicRepository';
import { Page, mapPage } from 'models/Page';
import { LanguageId } from 'models/Language';
import { Topic, TopicCursor, TopicId } from 'models/Topic';
import { SearchClient, SearchTopicsParams } from 'clients/SearchClient';
import { WordId } from 'models/Word';
import { WordService } from './WordService';
import { QUERY_MIN_LENGTH } from 'utils/constants';
import * as records from 'utils/records';

export interface GetTopicPageParms {
  languageId: LanguageId;
  query?: string;
  cursor?: TopicCursor;
  limit?: number;
}

export interface CreateTopicParams {
  name: string;
  languageId: LanguageId;
}

@Injectable()
export class TopicService {
  constructor(
    private topicRepository: TopicRepository,
    private searchClient: SearchClient,
    @Inject(forwardRef(() => WordService))
    private wordService: WordService,
  ) {}

  async getById(id: TopicId): Promise<Topic> {
    const topic = await this.topicRepository.getById(id);
    if (!topic) {
      throw new Error('Topic does not exist');
    }
    return topic;
  }

  async getPage(params: GetTopicPageParms): Promise<Page<Topic, TopicCursor>> {
    let topics: Page<Topic, TopicCursor>;
    if (params.query && params.query.length >= QUERY_MIN_LENGTH) {
      const topicIds = await this.searchClient.searchTopics(
        params as SearchTopicsParams,
      );
      const repoTopics = await this.topicRepository.getByIds(topicIds.items);
      const topicById = records.byKey(repoTopics, (topic) => topic.id);
      topics = mapPage(topicIds, (topicId) => topicById[topicId]);
    } else {
      topics = await this.topicRepository.getPage(
        params as RepoGetTopicPageParams,
      );
    }

    return topics;
  }

  async getForWord(wordId: WordId): Promise<Topic[]> {
    return this.topicRepository.getForWord(wordId);
  }

  async getForWords(wordIds: WordId[]): Promise<Record<WordId, Topic[]>> {
    return this.topicRepository.getForWords(wordIds);
  }

  async create(params: CreateTopicParams): Promise<Topic> {
    const topic: Topic = {
      id: uuid(),
      name: params.name,
      languageId: params.languageId,
    };
    await this.topicRepository.create(topic);

    await this.searchClient.indexTopic(topic);

    return topic;
  }

  async delete(id: TopicId): Promise<Topic> {
    const topic = this.getById(id);

    await this.topicRepository.delete(id);

    await this.searchClient.deleteTopic(id);

    return topic;
  }

  async addWord(topicId: TopicId, wordId: WordId): Promise<Topic> {
    await this.topicRepository.getById(topicId);
    await this.wordService.getById(wordId);

    await this.topicRepository.addWord(topicId, wordId);

    await this.wordService.index(wordId);

    return await this.topicRepository.getById(topicId);
  }

  async removeWord(topicId: TopicId, wordId: WordId): Promise<Topic> {
    await this.topicRepository.getById(topicId);
    await this.wordService.getById(wordId);

    await this.topicRepository.removeWord(topicId, wordId);

    await this.wordService.index(wordId);

    return await this.topicRepository.getById(topicId);
  }

  async indexLanguage(languageId: LanguageId): Promise<void> {
    await this.searchClient.deleteLanguageTopics(languageId);

    // TODO use paging
    const topics = await this.topicRepository.getPage({
      languageId,
      limit: 1000,
    });

    await this.searchClient.indexTopics(topics.items);
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.topicRepository.deleteForLanguage(languageId);
    await this.searchClient.deleteLanguageTopics(languageId);
  }
}
