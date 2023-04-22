import { Injectable } from '@nestjs/common';
import { WordTable } from 'knex/types/tables';
import { LanguageId } from 'models/Language';
import { mapPage, Page, PageArgs, toPage } from 'models/Page';
import { PropertyId } from 'models/Property';
import { PropertyValue } from 'models/PropertyValue';
import { PartOfSpeech, Word, WordId, WordOrder } from 'models/Word';
import { DbConnectionManager } from './DbConnectionManager';
import { TopicId } from 'models/Topic';
import { TABLE_TOPICS_WORDS } from './TopicRepository';

const TABLE_WORDS = 'words';

const BATCH_SIZE = 100;

export interface WordWithoutProperties extends Omit<Word, 'properties'> {
    properties?: Map<PropertyId, Omit<PropertyValue, 'property'>>;
}

export interface GetWordPageParams extends Required<PageArgs> {
    languageId: LanguageId;
    partOfSpeech?: PartOfSpeech;
    topic?: TopicId;
    order: WordOrder;
}

@Injectable()
export class WordRepository {
    constructor(private connectionManager: DbConnectionManager) {}

    async getById(id: WordId): Promise<WordWithoutProperties | null> {
        const wordRow = await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .where({
                id,
            })
            .first();

        return wordRow ? this.mapToWord(wordRow) : null;
    }

    async getPage({
        languageId,
        partOfSpeech,
        topic,
        start,
        limit,
        order,
    }: GetWordPageParams): Promise<Page<WordWithoutProperties>> {
        const connection = this.connectionManager.getConnection();

        let query = connection(TABLE_WORDS)
            .where({
                language_id: languageId,
                ...(partOfSpeech && { part_of_speech: partOfSpeech }),
            })
            .offset(start)
            .limit(limit + 1)
            .orderBy(
                order === WordOrder.Chronological ? 'added_at' : 'original',
                order === WordOrder.Chronological ? 'desc' : 'asc',
            );

        if (topic) {
            query = query.whereExists((query) =>
                query.from(TABLE_TOPICS_WORDS).where({
                    word_id: connection.ref(`${TABLE_WORDS}.id`),
                    topic_id: topic,
                }),
            );
        }

        const wordRows = await query;

        return mapPage(toPage(wordRows, limit), (wordRow) =>
            this.mapToWord(wordRow),
        );
    }

    async getByIds(ids: WordId[]): Promise<WordWithoutProperties[]> {
        const wordRows = await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .whereIn('id', ids);

        return wordRows.map((wordRow) => this.mapToWord(wordRow));
    }

    async *getBatches(
        languageId: LanguageId,
        batchSize: number = BATCH_SIZE,
    ): AsyncGenerator<WordWithoutProperties[]> {
        let offset = 0;

        do {
            const wordRows = await this.connectionManager
                .getConnection()(TABLE_WORDS)
                .where({
                    language_id: languageId,
                })
                .offset(offset)
                .limit(batchSize + 1);

            yield wordRows
                .slice(0, batchSize)
                .map((wordRow) => this.mapToWord(wordRow));

            if (wordRows.length <= batchSize) {
                break;
            }

            offset += batchSize;
        } while (true);
    }

    async create(word: Word): Promise<void> {
        await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .insert({
                id: word.id,
                original: word.original,
                translation: word.translation,
                language_id: word.languageId,
                part_of_speech: word.partOfSpeech,
                properties: this.mapToWordRowProperties(word.properties),
            });
    }

    async update(word: Word): Promise<void> {
        await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .update({
                original: word.original,
                translation: word.translation,
                properties: this.mapToWordRowProperties(word.properties),
            })
            .where({ id: word.id });
    }

    async delete(id: WordId): Promise<void> {
        await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .where({ id })
            .delete();
    }

    async deleteForLanguage(languageId: LanguageId): Promise<void> {
        await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .where({ language_id: languageId })
            .delete();
    }

    private mapToWord(row: WordTable): WordWithoutProperties {
        return {
            id: row.id,
            original: row.original,
            translation: row.translation,
            languageId: row.language_id,
            partOfSpeech: row.part_of_speech,
            properties: this.mapToWordProperties(row.properties),
        };
    }

    private mapToWordProperties(
        rowProperties: string | undefined,
    ): WordWithoutProperties['properties'] {
        return rowProperties
            ? new Map(Object.entries(JSON.parse(rowProperties)))
            : undefined;
    }

    private mapToWordRowProperties(
        propertyValues: Word['properties'],
    ): string | undefined {
        return propertyValues
            ? JSON.stringify(
                  Object.fromEntries(
                      Array.from(propertyValues).map(
                          ([propertyId, { property, ...propertyValue }]) => [
                              propertyId,
                              propertyValue,
                          ],
                      ),
                  ),
              )
            : undefined;
    }
}
