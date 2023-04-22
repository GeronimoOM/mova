import { v1 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Language, LanguageId } from 'models/Language';
import { LanguageRepository } from 'repositories/LanguageRepository';

export interface CreateLanguageParams {
    name: string;
}

export interface UpdateLanguageParams {
    id: LanguageId;
    name: string;
}

@Injectable()
export class LanguageService {
    constructor(private languageRepository: LanguageRepository) {}

    async getAll(): Promise<Language[]> {
        return await this.languageRepository.getAll();
    }

    async getById(id: LanguageId): Promise<Language | null> {
        return await this.languageRepository.getById(id);
    }

    async create(params: CreateLanguageParams): Promise<Language> {
        const language: Language = {
            id: uuid(),
            name: params.name,
        };
        await this.languageRepository.create(language);
        return language;
    }

    async update(params: UpdateLanguageParams): Promise<Language> {
        const language = await this.getById(params.id);
        if (!language) {
            throw new Error('Language does not exist');
        }

        language.name = params.name;
        await this.languageRepository.update(language);
        return language;
    }

    async delete(id: LanguageId): Promise<Language> {
        const language = await this.getById(id);
        if (!language) {
            throw new Error('Language does not exist');
        }

        await this.languageRepository.delete(id);
        return language;
    }
}
