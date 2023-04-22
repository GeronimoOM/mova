import { Injectable } from '@nestjs/common';
import { DbConnectionManager } from './DbConnectionManager';
import { WordId } from 'models/Word';
import * as maps from 'utils/maps';
import { Topic, TopicId } from 'models/Topic';
import { TopicTable } from 'knex/types/tables';
import { Page, PageArgs, mapPage, toPage } from 'models/Page';
import { LanguageId } from 'models/Language';

const TABLE_TOPICS = 'topics';
export const TABLE_TOPICS_WORDS = 'topics_words';

export interface GetTopicPageParams extends Required<PageArgs> {
    languageId: LanguageId;
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
        start,
        limit,
    }: GetTopicPageParams): Promise<Page<Topic>> {
        const topics = await this.connectionManager
            .getConnection()(TABLE_TOPICS)
            .where({
                language_id: languageId,
            })
            .offset(start)
            .limit(limit + 1)
            .orderBy('added_at', 'desc');

        return mapPage(toPage(topics, limit), (topicRow) =>
            this.mapToTopic(topicRow),
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

    async getForWords(wordIds: WordId[]): Promise<Map<WordId, Topic[]>> {
        const topicWordRows = await this.connectionManager
            .getConnection()(TABLE_TOPICS_WORDS)
            .leftJoin<TopicTable>(TABLE_TOPICS, 'topic_id', 'id')
            .whereIn('word_id', wordIds);

        return maps.groupByKeyAndMap(
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

    private mapToTopic(row: TopicTable): Topic {
        return {
            id: row.id,
            name: row.name,
            languageId: row.language_id,
        };
    }
}