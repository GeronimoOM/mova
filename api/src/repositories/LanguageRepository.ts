import { Injectable } from '@nestjs/common';
import { Language, LanguageId } from 'models/Language';
import { DbConnectionManager } from './DbConnectionManager';
import { LanguageTable, WordTable } from 'knex/types/tables';

const TABLE_LANGUAGES = 'languages';

@Injectable()
export class LanguageRepository {
  constructor(private connectionManager: DbConnectionManager) {}

  async getAll(): Promise<Language[]> {
    return await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .orderBy('added_at', 'asc');
  }

  async getById(id: LanguageId): Promise<Language | null> {
    return await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .where({ id })
      .first();
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
}
