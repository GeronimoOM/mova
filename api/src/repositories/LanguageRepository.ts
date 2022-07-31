import { Injectable } from '@nestjs/common';
import { Language, LanguageId } from 'src/models/Language';
import { DbConnectionManager } from './DbConnectionManager';

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
}
