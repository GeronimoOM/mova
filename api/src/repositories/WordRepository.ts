import { Injectable } from '@nestjs/common';
import { WordTable } from 'knex/types/tables';
import { DateTime, Duration } from 'luxon';
import { LanguageId } from 'models/Language';
import { Direction, Page, toPage } from 'models/Page';
import { Property, PropertyId } from 'models/Property';
import { PropertyValue } from 'models/PropertyValue';
import {
  AlphabeticalCursor,
  ChronologicalCursor,
  PartOfSpeech,
  Word,
  WordId,
  WordOrder,
  WordSortedCursor,
  WordsDateStats,
} from 'models/Word';
import { PropertyService } from 'services/PropertyService';
import {
  DATETIME_FORMAT,
  DATE_FORMAT,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from 'utils/constants';
import * as records from 'utils/records';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_WORDS = 'words';

const BATCH_SIZE = 100;

export interface GetWordPageParams {
  languageId?: LanguageId;
  order?: WordOrder;
  direction?: Direction;
  partsOfSpeech?: PartOfSpeech[];
  mastery?: number;
  addedAtOlderThan?: Duration;
  cursor?: WordSortedCursor;
  limit?: number;
}

type WordLite = Omit<Word, 'properties'> & {
  properties?: WordPropertiesLite;
};

type WordPropertiesLite = Record<PropertyId, Omit<PropertyValue, 'property'>>;

@Injectable()
export class WordRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private propertyService: PropertyService,
    private serializer: Serializer,
  ) {}

  async getById(id: WordId): Promise<Word | null> {
    const wordRow = await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .where({
        id,
      })
      .first();

    return wordRow ? await this.mapToWord(wordRow) : null;
  }

  async getPage({
    languageId,
    partsOfSpeech,
    order = WordOrder.Chronological,
    direction = Direction.Desc,
    cursor,
    limit = DEFAULT_LIMIT,
    mastery,
    addedAtOlderThan,
  }: GetWordPageParams): Promise<Page<Word, WordSortedCursor>> {
    const connection = this.connectionManager.getConnection();

    const query = connection(TABLE_WORDS);
    if (languageId) {
      query.where({ language_id: languageId });
    }

    limit = Math.min(MAX_LIMIT, limit);
    let cursorKey: string;
    let cursorValue: string | null;

    if (order === WordOrder.Random) {
      query.limit(limit + 1).orderByRaw('RAND()');
    } else {
      if (order === WordOrder.Chronological) {
        cursorKey = 'added_at';
        cursorValue = (cursor as ChronologicalCursor)?.addedAt;
      } else if (order === WordOrder.Alphabetical) {
        cursorKey = 'original';
        cursorValue = (cursor as AlphabeticalCursor)?.original;
        direction = Direction.Asc;
      }

      query.limit(limit + 1).orderBy([
        { column: cursorKey, order: direction },
        { column: 'id', order: direction },
      ]);

      if (cursorValue && cursor?.id) {
        query
          .where(
            cursorKey,
            direction === Direction.Asc ? '>=' : '<=',
            cursorValue,
          )
          .andWhere((query) =>
            query
              .where('id', direction === Direction.Asc ? '>' : '<', cursor.id)
              .orWhere(
                cursorKey,
                direction === Direction.Asc ? '>' : '<',
                cursorValue,
              ),
          );
      }
    }

    if (partsOfSpeech?.length) {
      query.whereIn('part_of_speech', partsOfSpeech);
    }

    if (mastery !== undefined) {
      query.where({ mastery });
    }

    if (addedAtOlderThan) {
      query.whereRaw(`date_add(added_at, interval ? day) <= now()`, [
        addedAtOlderThan.days,
      ]);
    }

    const wordRows = await query;

    const toNextCursor = (word: WordTable): WordSortedCursor => {
      switch (order) {
        case WordOrder.Chronological:
          return {
            addedAt: word.added_at,
            id: word.id,
          };
        case WordOrder.Alphabetical:
          return {
            original: word.original,
            id: word.id,
          };
        case WordOrder.Random:
          return null;
      }
    };

    const wordsPage = toPage(wordRows, limit, toNextCursor);
    return {
      ...wordsPage,
      items: await this.mapToWords(wordsPage.items),
    };
  }

  async getByIds(ids: WordId[]): Promise<Word[]> {
    const wordRows = await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .whereIn('id', ids);

    return await this.mapToWords(wordRows);
  }

  async *getBatches(
    languageId: LanguageId,
    batchSize: number = BATCH_SIZE,
  ): AsyncGenerator<Word[]> {
    let offset = 0;

    do {
      const wordRows = await this.connectionManager
        .getConnection()(TABLE_WORDS)
        .where({
          language_id: languageId,
        })
        .offset(offset)
        .limit(batchSize + 1);

      yield this.mapToWords(wordRows.slice(0, batchSize));

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
        added_at: word.addedAt.toFormat(DATETIME_FORMAT),
        properties: this.mapFromWordProperties(word.properties),
      })
      .onConflict()
      .ignore();
  }

  async update(word: Word): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .update({
        original: word.original,
        translation: word.translation,
        mastery: word.mastery,
        properties: this.mapFromWordProperties(word.properties),
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

  private async mapToWord(row: WordTable): Promise<Word> {
    const [word] = await this.mapToWords([row]);
    return word;
  }

  private async mapToWords(rows: WordTable[]): Promise<Word[]> {
    const words = rows.map((row) => this.mapToWordLite(row));

    const properties = await this.fetchPropertiesForWords(words);
    return words.map((word) => ({
      ...word,
      properties: this.mapToWordProperties(word.properties, properties),
    }));
  }

  private mapToWordLite(row: WordTable): WordLite {
    return {
      id: row.id,
      original: row.original,
      translation: row.translation,
      languageId: row.language_id,
      partOfSpeech: row.part_of_speech,
      mastery: row.mastery,
      addedAt: DateTime.fromFormat(row.added_at, DATETIME_FORMAT),
      ...(row.properties && {
        properties: this.serializer.deserialize(row.properties),
      }),
    };
  }

  private async fetchPropertiesForWords(
    words: WordLite[],
  ): Promise<Property[]> {
    const propertyIds = new Set<PropertyId>();
    for (const word of words) {
      for (const propertyId of Object.keys(word.properties ?? {})) {
        propertyIds.add(propertyId);
      }
    }

    return await this.propertyService.getByIds(Array.from(propertyIds));
  }

  private mapToWordProperties(
    wordProperties: WordPropertiesLite | undefined,
    properties: Property[],
  ): Word['properties'] {
    if (!wordProperties) {
      return;
    }

    const propertyValues: Record<PropertyId, PropertyValue> = {};
    for (const property of properties) {
      const propertyValue = wordProperties[property.id];
      if (!propertyValue) {
        continue;
      }

      propertyValues[property.id] = {
        property,
        ...propertyValue,
      } as PropertyValue;
    }

    if (!Object.keys(propertyValues).length) {
      return;
    }

    return propertyValues;
  }

  private mapFromWordProperties(
    propertyValues: Word['properties'],
  ): string | null {
    return propertyValues
      ? this.serializer.serialize(
          records.mapValues(
            propertyValues,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ property, ...propertyValue }) => propertyValue,
          ),
        )
      : null;
  }
}
