import { v1 as uuid } from 'uuid';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Language, LanguageId } from 'models/Language';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { PropertyService } from './PropertyService';
import { TopicService } from './TopicService';
import { WordService } from './WordService';
import { DateTime } from 'luxon';
import { ChangeService } from './ChangeService';
import { copy } from 'utils/copy';
import { ChangeBuilder } from './ChangeBuilder';

const LANGUAGE_DELETION_WORDS_THRESHOLD = 50;

export interface CreateLanguageParams {
  id?: LanguageId;
  name: string;
  addedAt?: DateTime;
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
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private changeBuilder: ChangeBuilder,
  ) {}

  async getAll(): Promise<Language[]> {
    return await this.languageRepository.getAll();
  }

  async getById(id: LanguageId): Promise<Language> {
    const language = await this.languageRepository.getById(id);
    if (!language) {
      throw new Error('Language does not exist');
    }
    return language;
  }

  async create(params: CreateLanguageParams): Promise<Language> {
    const language: Language = {
      id: params.id ?? uuid(),
      name: params.name.trim(),
      addedAt: params.addedAt ?? DateTime.utc(),
    };
    await this.languageRepository.create(language);
    await this.changeService.create(
      this.changeBuilder.buildCreateLanguageChange(language),
    );
    return language;
  }

  async update(params: UpdateLanguageParams): Promise<Language> {
    const language = await this.getById(params.id);
    const currentLanguage = copy(language);

    language.name = params.name.trim();

    const change = this.changeBuilder.buildUpdateLanguageChange(
      language,
      currentLanguage,
    );
    if (change) {
      await this.languageRepository.update(language);
      await this.changeService.create(change);
    }

    return language;
  }

  async delete(id: LanguageId): Promise<Language> {
    const language = await this.getById(id);

    const wordCount = await this.wordService.getCount(language.id);
    if (wordCount > LANGUAGE_DELETION_WORDS_THRESHOLD) {
      throw new Error('Language has too many words');
    }

    await this.wordService.deleteForLanguage(id);
    await this.topicService.deleteForLanguage(id);
    await this.propertyService.deleteForLanguage(id);
    await this.languageRepository.delete(id);
    await this.changeService.create(
      this.changeBuilder.buildDeleteLanguageChange(language),
    );
    return language;
  }
}
