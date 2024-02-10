import { Injectable } from '@nestjs/common';
import { Language, LanguageId } from 'models/Language';
import { DbConnectionManager } from './DbConnectionManager';
import { LanguageTable } from 'knex/types/tables';
import { DateTime } from 'luxon';
import { DATETIME_FORMAT } from 'utils/constants';

const TABLE_LANGUAGES = 'languages';

@Injectable()
export class LanguageRepository {
  constructor(private connectionManager: DbConnectionManager) {}

  async getAll(): Promise<Language[]> {
    const languages = await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .orderBy('added_at', 'asc');

    return languages.map((language) => this.mapToLanguage(language));
  }

  async getById(id: LanguageId): Promise<Language | null> {
    const language = await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .where({ id })
      .first();

    return language ? this.mapToLanguage(language) : null;
  }

  async create(language: Language): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .insert(language);
  }

  async update(language: Language): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .update({ name: language.name })
      .where({ id: language.id });
  }

  async delete(id: LanguageId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .where({ id })
      .delete();
  }

  streamRecords(): AsyncIterable<LanguageTable> {
    return this.connectionManager.getConnection()(TABLE_LANGUAGES).stream();
  }

  async insertBatch(batch: LanguageTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_LANGUAGES).delete();
  }

  private mapToLanguage(row: LanguageTable): Language {
    return {
      id: row.id,
      name: row.name,
      addedAt: DateTime.fromFormat(row.added_at, DATETIME_FORMAT),
    };
  }
}
