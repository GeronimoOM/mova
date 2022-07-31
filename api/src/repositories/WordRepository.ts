import { Injectable } from '@nestjs/common';
import { WordTable } from 'knex/types/tables';
import { LanguageId } from 'src/models/Language';
import { mapPage, Page, PageArgs } from 'src/models/Page';
import { PropertyId } from 'src/models/Property';
import { PropertyValue } from 'src/models/PropertyValue';
import { Word, WordId, WordOrder } from 'src/models/Word';
import { DbConnectionManager } from './DbConnectionManager';

const TABLE_WORDS = 'words';

export interface WordWithoutProperties extends Omit<Word, 'properties'> {
    properties?: Map<PropertyId, Omit<PropertyValue, 'property'>>;
}

export interface GetWordPageParams extends Required<PageArgs> {
    languageId: LanguageId;
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
        start,
        limit,
        order,
    }: GetWordPageParams): Promise<Page<WordWithoutProperties>> {
        const wordRows = await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .where({
                language_id: languageId,
            })
            .offset(start)
            .limit(limit + 1)
            .orderBy(
                order === WordOrder.Chronological ? 'added_at' : 'original',
                'asc',
            );

        const page: Page<WordTable> = {
            items:
                wordRows.length > limit
                    ? wordRows.slice(0, wordRows.length - 1)
                    : wordRows,
            hasMore: wordRows.length > limit,
        };

        return mapPage(page, (wordRow) => this.mapToWord(wordRow));
    }

    async getByIds(ids: WordId[]): Promise<WordWithoutProperties[]> {
        const wordRows = await this.connectionManager
            .getConnection()(TABLE_WORDS)
            .whereIn('id', ids);

        return wordRows.map((wordRow) => this.mapToWord(wordRow));
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

    private mapToWordRowProperties(propertyValues: Word['properties']): string {
        return JSON.stringify(
            Object.fromEntries(
                Array.from(propertyValues).map(
                    ([propertyId, { property, ...propertyValue }]) => [
                        propertyId,
                        propertyValue,
                    ],
                ),
            ),
        );
    }
}
