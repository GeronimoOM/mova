import { v1 as uuid } from 'uuid';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Language, LanguageId } from 'models/Language';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { PropertyService } from './PropertyService';
import { TopicService } from './TopicService';
import { WordService } from './WordService';

export interface CreateLanguageParams {
    name: string;
}

export interface UpdateLanguageParams {
    id: LanguageId;
    name: string;
}

@Injectable()
export class LanguageService {
    constructor(
        private languageRepository: LanguageRepository,
        @Inject(forwardRef(() => PropertyService))
        private propertyService: PropertyService,
        @Inject(forwardRef(() => TopicService))
        private topicService: TopicService,
        @Inject(forwardRef(() => WordService))
        private wordService: WordService,
    ) {}

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

        await this.wordService.deleteForLanguage(id);
        await this.topicService.deleteForLanguage(id);
        await this.propertyService.deleteForLanguage(id);
        await this.languageRepository.delete(id);
        return language;
    }
}
