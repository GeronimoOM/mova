import { Injectable } from '@nestjs/common';
import { WordTable } from 'knex/types/tables';
import { LanguageId } from 'models/Language';
import { mapPage, Page, PageArgs, toPage } from 'models/Page';
import { PropertyId } from 'models/Property';
import { PropertyValue } from 'models/PropertyValue';
import {
  PartOfSpeech,
  Word,
  WordId,
  WordOrder,
  WordsDateStats,
  WordSortedCursor,
} from 'models/Word';
import { DbConnectionManager } from './DbConnectionManager';
import { TopicId } from 'models/Topic';
import { TABLE_TOPICS_WORDS } from './TopicRepository';
import { DateTime } from 'luxon';
import { DATE_FORMAT, DEFAULT_LIMIT, MAX_LIMIT } from 'utils/constants';
import { decodeCursor, encodeCursor } from 'utils/cursors';

const TABLE_WORDS = 'words';

const BATCH_SIZE = 100;

export interface WordWithoutProperties extends Omit<Word, 'properties'> {
  properties?: Map<PropertyId, Omit<PropertyValue, 'property'>>;
}

export interface GetWordPageParams extends PageArgs {
  languageId: LanguageId;
  order: WordOrder;
  partsOfSpeech?: PartOfSpeech[];
  topics?: TopicId[];
  from?: DateTime;
  until?: DateTime;
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
    partsOfSpeech,
    topics,
    order = WordOrder.Chronological,
    cursor,
    limit = DEFAULT_LIMIT,
    from,
    until,
  }: GetWordPageParams): Promise<Page<WordWithoutProperties>> {
    const connection = this.connectionManager.getConnection();

    let query = connection(TABLE_WORDS).where({
      language_id: languageId,
    });

    limit = Math.min(MAX_LIMIT, limit);

    if (order === WordOrder.Random) {
      query.limit(limit + 1).orderByRaw('RAND()');
    } else {
      const decodedCursor = cursor
        ? decodeCursor(cursor, WordSortedCursor)
        : null;
      order = decodedCursor?.order ?? order;

      const cursorKey =
        order === WordOrder.Chronological ? 'added_at' : 'original';
      const orderDirection = order === WordOrder.Chronological ? 'desc' : 'asc';
      const cursorValue =
        decodedCursor?.order === WordOrder.Chronological
          ? decodedCursor?.added_at
          : decodedCursor?.original;

      query.limit(limit + 1).orderBy(cursorKey, orderDirection);

      if (cursorValue) {
        query.where(
          cursorKey,
          orderDirection === 'asc' ? '>' : '<',
          cursorValue,
        );
      }
    }

    if (partsOfSpeech?.length) {
      query.whereIn('part_of_speech', partsOfSpeech);
    }

    if (topics?.length) {
      query = query.whereExists((query) =>
        query
          .from(TABLE_TOPICS_WORDS)
          .where({ word_id: connection.ref(`${TABLE_WORDS}.id`) })
          .whereIn('topic_id', topics),
      );
    }

    if (from) {
      query.where(
        connection.raw('date(added_at)'),
        '>=',
        from.toFormat(DATE_FORMAT),
      );
    }

    if (until) {
      query.where(
        connection.raw('date(added_at)'),
        '<',
        until.toFormat(DATE_FORMAT),
      );
    }

    const wordRows = await query;

    const toNextCursor = (word: WordTable) =>
      encodeCursor(
        order === WordOrder.Chronological
          ? {
              order,
              added_at: word.added_at,
            }
          : {
              order,
              original: word.original,
            },
      );

    return mapPage(toPage(wordRows, limit, toNextCursor), (wordRow) =>
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

  async getCount(languageId: LanguageId): Promise<number> {
    const [{ count }] = await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .where({ language_id: languageId })
      .count('id', { as: 'count' });

    return Number(count);
  }

  async getDateStats(
    languageId: LanguageId,
    from: DateTime,
    until: DateTime,
  ): Promise<WordsDateStats[]> {
    const fromFormatted = from.toFormat(DATE_FORMAT);
    const untilFormatted = until.toFormat(DATE_FORMAT);

    const connection = this.connectionManager.getConnection();
    const countsByDates = await connection(TABLE_WORDS)
      .select({
        date: connection.raw('date(added_at)'),
        words: connection.raw('count(id)'),
      })
      .where('language_id', languageId)
      .andWhere(connection.raw('date(added_at)'), '>=', fromFormatted)
      .andWhere(connection.raw('date(added_at)'), '<', untilFormatted)
      .groupByRaw('date(added_at)');

    return countsByDates.map(({ date, words }) => ({
      date: DateTime.fromFormat(date, DATE_FORMAT),
      words,
    }));
  }

  streamRecords(): AsyncIterable<WordTable> {
    return this.connectionManager.getConnection()(TABLE_WORDS).stream();
  }

  async insertBatch(batch: WordTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_WORDS).delete();
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
