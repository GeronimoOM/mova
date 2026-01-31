import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { WordLinkTable, WordTable } from 'knex/types/tables';
import { DateTime, Duration } from 'luxon';
import { LanguageId } from 'models/Language';
import { Direction, Page, toPage } from 'models/Page';
import { Option, OptionId, Property, PropertyId } from 'models/Property';
import { PropertyValue } from 'models/PropertyValue';
import {
  AlphabeticalCursor,
  ChronologicalCursor,
  PartOfSpeech,
  Word,
  WordConfidence,
  WordId,
  WordLink,
  WordLinkType,
  WordMastery,
  WordOrder,
  WordSortedCursor,
} from 'models/Word';
import { PropertyService } from 'services/PropertyService';
import { DATE_FORMAT, DEFAULT_LIMIT, MAX_LIMIT } from 'utils/constants';
import { fromTimestamp, toTimestamp } from 'utils/datetime';
import * as records from 'utils/records';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_WORDS = 'words';
const TABLE_WORD_LINKS = 'word_links';

const BATCH_SIZE = 100;

export interface GetWordPageParams {
  languageId: LanguageId | LanguageId[];
  order?: WordOrder;
  direction?: Direction;
  partsOfSpeech?: PartOfSpeech[];
  mastery?: WordMastery;
  masteryAttemptOlderThan?: MasteryAttemptDelay;
  excludeMaxMasteryConfidence?: boolean;
  addedAtDate?: DateTime;
  lowConfidence?: boolean;
  cursor?: WordSortedCursor;
  limit?: number;
}

type MasteryAttemptDelay = {
  masteryDelayBase: Record<WordMastery, Duration>;
  confidenceDelayMultiplier: Record<WordConfidence, number>;
};

export type GetCountParams = Pick<
  GetWordPageParams,
  'masteryAttemptOlderThan' | 'excludeMaxMasteryConfidence'
>;

type WordLite = Omit<Word, 'properties'> & {
  properties?: WordPropertiesLite;
};

type WordPropertiesLite = Record<PropertyId, Omit<PropertyValue, 'property'>>;

@Injectable()
export class WordRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    @Inject(forwardRef(() => PropertyService))
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
    order = WordOrder.Chronological,
    direction = Direction.Desc,
    partsOfSpeech,
    mastery,
    masteryAttemptOlderThan,
    excludeMaxMasteryConfidence,
    addedAtDate,
    lowConfidence,
    cursor,
    limit = DEFAULT_LIMIT,
  }: GetWordPageParams): Promise<Page<Word, WordSortedCursor>> {
    const connection = this.connectionManager.getConnection();

    const query = connection(TABLE_WORDS).whereIn(
      'language_id',
      Array.isArray(languageId) ? languageId : [languageId],
    );

    limit = Math.min(MAX_LIMIT, limit);
    let cursorKey: string;
    let cursorValue: string | null;

    if (order === WordOrder.Confidence) {
      query.limit(limit + 1).orderByRaw('confidence ASC, RAND()');
    } else {
      if (order === WordOrder.Chronological) {
        cursorKey = 'added_at';
        cursorValue = (cursor as ChronologicalCursor)?.addedAt;
      } else {
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

    if (lowConfidence) {
      query.where('confidence', '<', 0);
    }

    if (addedAtDate) {
      query.whereRaw(`date(added_at) = ?`, [addedAtDate.toFormat(DATE_FORMAT)]);
    }

    if (masteryAttemptOlderThan) {
      const delay = this.masteryAttemptDelaySecondsSql(
        masteryAttemptOlderThan,
        mastery,
      );

      query.whereRaw(
        `timestampadd(second, ${delay}, ifnull(mastery_attempt_at, added_at)) < now()`,
      );
    }

    if (excludeMaxMasteryConfidence) {
      query.whereNot((query) =>
        query.where({
          mastery: WordMastery.Advanced,
          confidence: WordConfidence.Highest,
        }),
      );
    }

    const wordRows = await query;

    const toNextCursor = (word: WordTable): WordSortedCursor | null => {
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
        default:
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

  async getByOriginal(
    languageId: LanguageId,
    original: string,
  ): Promise<Word | null> {
    const wordRow = await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .where({
        language_id: languageId,
        original,
      })
      .first();

    return wordRow ? await this.mapToWord(wordRow) : null;
  }

  async *getBatches(
    languageId: LanguageId,
    batchSize: number = BATCH_SIZE,
  ): AsyncGenerator<Word[]> {
    const connection = this.connectionManager.getConnection();
    let offset = 0;

    do {
      const wordRows = await connection(TABLE_WORDS)
        .where({
          language_id: languageId,
        })
        .orderBy('id')
        .offset(offset)
        .limit(batchSize + 1);

      const wordsBatch = await this.mapToWords(wordRows.slice(0, batchSize));
      if (wordsBatch.length) {
        yield wordsBatch;
      }

      if (wordRows.length <= batchSize) {
        break;
      }

      offset += batchSize;
    } while (true);
  }

  async getLinks(id: WordId, type: WordLinkType): Promise<WordId[]> {
    const links = await this.connectionManager
      .getConnection()(TABLE_WORD_LINKS)
      .where({ word1_id: id, type })
      .orWhere({ word2_id: id, type });

    return links.map((link) =>
      link.word1_id === id ? link.word2_id : link.word1_id,
    );
  }

  async getAllLinks(languageIds: LanguageId[]): Promise<WordLink[]> {
    const links = await this.connectionManager
      .getConnection()(TABLE_WORD_LINKS)
      .whereIn('language_id', languageIds);

    return links.map((link) => ({
      word1Id: link.word1_id,
      word2Id: link.word2_id,
      type: link.type,
      languageId: link.language_id,
    }));
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
        added_at: toTimestamp(word.addedAt),
        properties: this.mapFromWordProperties(word.properties) ?? undefined,
      })
      .onConflict()
      .ignore();
  }

  async createLink(wordLink: WordLink): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORD_LINKS)
      .insert({
        word1_id: wordLink.word1Id,
        word2_id: wordLink.word2Id,
        type: wordLink.type,
        language_id: wordLink.languageId,
      })
      .onConflict()
      .ignore();
  }

  async update(word: Word): Promise<void> {
    const properties = this.mapFromWordProperties(word.properties);

    await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .update({
        original: word.original,
        translation: word.translation,
        mastery: word.mastery,
        confidence: word.confidence,
        ...(word.masteryAttemptAt && {
          mastery_attempt_at: toTimestamp(word.masteryAttemptAt),
        }),
        ...(properties && { properties }),
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

  async deleteLink({ word1Id, word2Id, type }: WordLink): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORD_LINKS)
      .where({ word1_id: word1Id, word2_id: word2Id, type })
      .orWhere({ word1_id: word2Id, word2_id: word1Id, type })
      .delete();
  }

  async getCount(
    languageId: LanguageId,
    {
      masteryAttemptOlderThan,
      excludeMaxMasteryConfidence,
    }: GetCountParams = {},
  ): Promise<number> {
    const query = this.connectionManager
      .getConnection()(TABLE_WORDS)
      .where({ language_id: languageId })
      .count('id', { as: 'count' });

    if (masteryAttemptOlderThan) {
      const delay = this.masteryAttemptDelaySecondsSql(masteryAttemptOlderThan);
      query.whereRaw(
        `timestampadd(second, ${delay}, ifnull(mastery_attempt_at, added_at)) < now()`,
      );
    }

    if (excludeMaxMasteryConfidence) {
      query.whereNot((query) =>
        query.where({
          mastery: WordMastery.Advanced,
          confidence: WordConfidence.Highest,
        }),
      );
    }

    const [{ count }] = await query;
    return Number(count);
  }

  async getCountByMastery(
    languageId: LanguageId,
    {
      masteryAttemptOlderThan,
      excludeMaxMasteryConfidence,
    }: GetCountParams = {},
  ): Promise<Record<WordMastery, number>> {
    const connection = this.connectionManager.getConnection();

    const query = connection(TABLE_WORDS)
      .where({ language_id: languageId })
      .select(connection.raw('count(id) as count'), 'mastery');

    if (masteryAttemptOlderThan) {
      const delay = this.masteryAttemptDelaySecondsSql(masteryAttemptOlderThan);
      query.whereRaw(
        `timestampadd(second, ${delay}, ifnull(mastery_attempt_at, added_at)) < now()`,
      );
    }

    if (excludeMaxMasteryConfidence) {
      query.whereNot((query) =>
        query.where({
          mastery: WordMastery.Advanced,
          confidence: WordConfidence.Highest,
        }),
      );
    }

    const counts: Array<{ count: number; mastery: WordMastery }> =
      await query.groupBy('mastery');

    return Object.fromEntries(
      counts.map((count) => [count.mastery, count.count]),
    ) as Record<WordMastery, number>;
  }

  async getCountByConfidence(
    languageId: LanguageId,
  ): Promise<Record<WordConfidence, number>> {
    const connection = this.connectionManager.getConnection();

    const counts: Array<{ count: number; confidence: WordConfidence }> =
      await connection(TABLE_WORDS)
        .where({ language_id: languageId })
        .select(connection.raw('count(id) as count'), 'confidence')
        .groupBy('confidence');

    return Object.fromEntries(
      counts.map((count) => [count.confidence, count.count]),
    ) as Record<WordConfidence, number>;
  }

  async getCountByPartOfSpeech(
    languageId: LanguageId,
  ): Promise<Record<PartOfSpeech, number>> {
    const connection = this.connectionManager.getConnection();

    const counts: Array<{ count: number; part_of_speech: PartOfSpeech }> =
      await connection(TABLE_WORDS)
        .where({ language_id: languageId })
        .select(connection.raw('count(id) as count'), 'part_of_speech')
        .groupBy('part_of_speech');

    return Object.fromEntries(
      counts.map((count) => [count.part_of_speech, count.count]),
    ) as Record<PartOfSpeech, number>;
  }

  async getCountByProperty(
    languageId: LanguageId,
    propertyId: PropertyId,
    partOfSpeech: PartOfSpeech,
  ): Promise<number> {
    const [{ count }] = await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .where({ language_id: languageId, part_of_speech: partOfSpeech })
      .whereRaw(`properties->'$."${propertyId}"' is not null`)
      .count('id', { as: 'count' });

    return Number(count);
  }

  async getCountByPropertyOptions(
    languageId: LanguageId,
    propertyId: PropertyId,
    partOfSpeech: PartOfSpeech,
  ): Promise<Record<OptionId, number>> {
    const connection = this.connectionManager.getConnection();
    const counts: Array<{ option_id: string; count: number }> =
      await connection(TABLE_WORDS)
        .where({ language_id: languageId, part_of_speech: partOfSpeech })
        .whereRaw(`properties->'$."${propertyId}".option.id' is not null`)
        .select(
          connection.raw(
            `properties->>'$."${propertyId}".option.id' as option_id`,
          ),
        )
        .count('id', { as: 'count' })
        .groupBy('option_id');

    return Object.fromEntries(
      counts.map(({ option_id: optionId, count }) => [optionId, Number(count)]),
    );
  }

  streamRecords(): AsyncIterable<WordTable> {
    return this.connectionManager.getConnection()(TABLE_WORDS).stream();
  }

  streamLinkRecords(): AsyncIterable<WordLinkTable> {
    return this.connectionManager.getConnection()(TABLE_WORD_LINKS).stream();
  }

  async insertBatch(batch: WordTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORDS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async insertLinksBatch(batch: WordLinkTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_WORD_LINKS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_WORDS).delete();
  }

  async detachOption(
    languageId: LanguageId,
    propertyId: PropertyId,
    partOfSpeech: PartOfSpeech,
    optionId: OptionId,
    option: Option,
  ): Promise<void> {
    const connection = this.connectionManager.getConnection();

    await connection(TABLE_WORDS)
      .where({ language_id: languageId, part_of_speech: partOfSpeech })
      .whereRaw(`properties->'$."${propertyId}".option.id' = '${optionId}'`)
      .update(
        'properties',
        connection.raw(
          `JSON_SET(properties, '$."${propertyId}".option', CAST('${this.serializer.serialize(option)}' AS JSON))`,
        ),
      );
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
      addedAt: fromTimestamp(row.added_at),
      mastery: row.mastery,
      confidence: row.confidence,
      ...(row.mastery_attempt_at && {
        masteryAttemptAt: fromTimestamp(row.mastery_attempt_at),
      }),
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
            ({ property, ...propertyValue }) => propertyValue,
          ),
        )
      : null;
  }

  private masteryAttemptDelaySecondsSql(
    { masteryDelayBase, confidenceDelayMultiplier }: MasteryAttemptDelay,
    mastery?: WordMastery,
  ): string {
    const delayBase =
      mastery !== undefined
        ? masteryDelayBase[mastery].toMillis() / 1000
        : this.caseWhenThenSql(
            'mastery',
            Object.entries(masteryDelayBase).map(([mastery, delay]) => [
              Number(mastery),
              delay.toMillis() / 1000,
            ]),
          );

    const multiplier = this.caseWhenThenSql(
      'confidence',
      Object.entries(confidenceDelayMultiplier).map(
        ([confidence, multiplier]) => [Number(confidence), multiplier],
      ),
    );

    return `(${delayBase} * ${multiplier})`;
  }

  private caseWhenThenSql<K, V>(
    column: string,
    mappings: Array<[K, V]>,
  ): string {
    const whenThen = Array.from(
      mappings.map(([key, value]) => `WHEN ${key} THEN ${value}`),
    ).join(' ');

    return `CASE ${column} ${whenThen} END`;
  }
}
