import { Injectable } from '@nestjs/common';
import { LanguageTable } from 'knex/types/tables';
import { Language, LanguageId } from 'models/Language';
import { UserId } from 'models/User';
import { fromTimestamp, toTimestamp } from 'utils/datetime';
import { DbConnectionManager } from './DbConnectionManager';

const TABLE_LANGUAGES = 'languages';

@Injectable()
export class LanguageRepository {
  constructor(private connectionManager: DbConnectionManager) {}

  async getAll(userId: UserId): Promise<Language[]> {
    const languages = await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .where({ user_id: userId })
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

  async getByIds(ids: LanguageId[]): Promise<Language[]> {
    const languages = await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .whereIn('id', ids);

    return languages.map((language) => this.mapToLanguage(language));
  }

  async create(language: Language): Promise<void> {
    const languageRow: LanguageTable = {
      id: language.id,
      name: language.name,
      added_at: toTimestamp(language.addedAt),
      user_id: language.userId,
    };

    await this.connectionManager
      .getConnection()(TABLE_LANGUAGES)
      .insert(languageRow)
      .onConflict()
      .ignore();
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
      addedAt: fromTimestamp(row.added_at),
      userId: row.user_id,
    };
  }
}
