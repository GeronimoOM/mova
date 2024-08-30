import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Context } from 'models/Context';
import { Language, LanguageId } from 'models/Language';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { copy } from 'utils/copy';
import { v1 as uuid } from 'uuid';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';
import { PropertyService } from './PropertyService';
import { WordService } from './WordService';

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

export interface DeleteLanguageParams {
  id: LanguageId;
}

@Injectable()
export class LanguageService {
  constructor(
    private languageRepository: LanguageRepository,
    @Inject(forwardRef(() => PropertyService))
    private propertyService: PropertyService,
    @Inject(forwardRef(() => WordService))
    private wordService: WordService,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
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

  async create(ctx: Context, params: CreateLanguageParams): Promise<Language> {
    const language: Language = {
      id: params.id ?? uuid(),
      name: params.name.trim(),
      addedAt: params.addedAt ?? DateTime.utc(),
    };

    await this.connectionManager.transactionally(async () => {
      await this.languageRepository.create(language);
      await this.changeService.create(
        this.changeBuilder.buildCreateLanguageChange(ctx, language),
      );
    });

    return language;
  }

  async update(ctx: Context, params: UpdateLanguageParams): Promise<Language> {
    const language = await this.getById(params.id);
    const currentLanguage = copy(language);

    language.name = params.name.trim();

    const change = this.changeBuilder.buildUpdateLanguageChange(
      ctx,
      language,
      currentLanguage,
    );

    if (change) {
      await this.connectionManager.transactionally(async () => {
        await this.languageRepository.update(language);
        await this.changeService.create(change);
      });
    }

    return language;
  }

  async delete(ctx: Context, { id }: DeleteLanguageParams): Promise<Language> {
    const language = await this.getById(id);

    const wordCount = await this.wordService.getCount(language.id);
    if (wordCount > LANGUAGE_DELETION_WORDS_THRESHOLD) {
      throw new Error('Language has too many words');
    }

    await this.connectionManager.transactionally(async () => {
      await this.wordService.deleteForLanguage(id);
      await this.propertyService.deleteForLanguage(id);
      await this.languageRepository.delete(id);
      await this.changeService.create(
        this.changeBuilder.buildDeleteLanguageChange(ctx, language),
      );
    });

    return language;
  }
}
