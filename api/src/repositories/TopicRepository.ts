import { Injectable } from '@nestjs/common';
import { DbConnectionManager } from './DbConnectionManager';
import { WordId } from 'models/Word';
import * as records from 'utils/records';
import { Topic, TopicId, TopicSortedCursor } from 'models/Topic';
import { TopicTable, TopicWordTable } from 'knex/types/tables';
import { Page, mapPage, toPage } from 'models/Page';
import { LanguageId } from 'models/Language';

const TABLE_TOPICS = 'topics';
export const TABLE_TOPICS_WORDS = 'topics_words';

export interface GetTopicPageParams {
  languageId: LanguageId;
  cursor?: TopicSortedCursor;
  limit?: number;
}

@Injectable()
export class TopicRepository {
  constructor(private connectionManager: DbConnectionManager) {}

  async getById(id: TopicId): Promise<Topic | null> {
    const topicRow = await this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .where({ id })
      .first();

    return topicRow ? this.mapToTopic(topicRow) : null;
  }

  async getPage({
    languageId,
    cursor,
    limit,
  }: GetTopicPageParams): Promise<Page<Topic, TopicSortedCursor>> {
    const addedAt = cursor?.addedAt;

    const query = this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .where({
        language_id: languageId,
      })
      .limit(limit + 1)
      .orderBy([
        { column: 'added_at', order: 'desc' },
        { column: 'id', order: 'desc' },
      ]);

    if (addedAt) {
      query
        .where('added_at', '<=', addedAt)
        .andWhere((query) =>
          query.where('id', '<', cursor.id).orWhere('added_at', '<', addedAt),
        );
    }

    const topics = await query;

    return mapPage(
      toPage(topics, limit, (topic) => ({
        addedAt: topic.added_at,
        id: topic.id,
      })),
      (topicRow) => this.mapToTopic(topicRow),
    );
  }

  async getByIds(ids: TopicId[]): Promise<Topic[]> {
    const topicsRows = await this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .whereIn('id', ids);

    return topicsRows.map((topicRow) => this.mapToTopic(topicRow));
  }

  async getForWord(wordId: WordId): Promise<Topic[]> {
    const topicWordRows = await this.connectionManager
      .getConnection()(TABLE_TOPICS_WORDS)
      .leftJoin<TopicTable>(TABLE_TOPICS, 'topic_id', 'id')
      .where({ word_id: wordId });

    return topicWordRows.map((row) => this.mapToTopic(row));
  }

  async getForWords(wordIds: WordId[]): Promise<Record<WordId, Topic[]>> {
    const topicWordRows = await this.connectionManager
      .getConnection()(TABLE_TOPICS_WORDS)
      .leftJoin<TopicTable>(TABLE_TOPICS, 'topic_id', 'id')
      .whereIn('word_id', wordIds);

    return records.groupByKeyAndMap(
      topicWordRows,
      (row) => row.word_id,
      (row) => this.mapToTopic(row),
    );
  }

  async create(topic: Topic): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_TOPICS).insert({
      id: topic.id,
      name: topic.name,
      language_id: topic.languageId,
    });
  }

  async addWord(topicId: TopicId, wordId: WordId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS_WORDS)
      .insert({
        topic_id: topicId,
        word_id: wordId,
      })
      .onConflict()
      .ignore();
  }

  async removeWord(topicId: TopicId, wordId: WordId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS_WORDS)
      .where({
        topic_id: topicId,
        word_id: wordId,
      })
      .delete();
  }

  async delete(id: TopicId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .where({ id })
      .delete();
  }

  async deleteForLanguage(languageId: LanguageId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .where({ language_id: languageId })
      .delete();
  }

  streamRecords(): AsyncIterable<TopicTable> {
    return this.connectionManager.getConnection()(TABLE_TOPICS).stream();
  }

  streamWordRecords(): AsyncIterable<TopicWordTable> {
    return this.connectionManager.getConnection()(TABLE_TOPICS_WORDS).stream();
  }

  async insertBatch(batch: TopicTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async insertWordsBatch(batch: TopicWordTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_TOPICS_WORDS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_TOPICS_WORDS).delete();

    await this.connectionManager.getConnection()(TABLE_TOPICS).delete();
  }

  private mapToTopic(row: TopicTable): Topic {
    return {
      id: row.id,
      name: row.name,
      languageId: row.language_id,
    };
  }
}
