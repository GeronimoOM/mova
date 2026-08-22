import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AiClient } from 'clients/AiClient';
import { AiOutputType } from 'models/AiOutput';
import { Context } from 'models/Context';
import { PartOfSpeech, WordId } from 'models/Word';
import { WordUsage } from 'models/WordUsage';
import { AiOutputsRepository } from 'repositories/AiOutputsRepository';
import { localeToName } from 'utils/locale';
import { LanguageService } from './LanguageService';
import { RateLimitBucket, RateLimitService } from './RateLimitService';
import { UserService } from './UserService';
import { WordService } from './WordService';

type InferUsageParams = {
  userLanguage: string;
  wordLanguage: string;
  word: string;
  partOfSpeech: PartOfSpeech;
};

const INFER_USAGE_INSTRUCTION = `
  You are assisting at language learning.
  As an input you will receive information about a word from a user's personal dictionary.
  The input is in JSON format and has the following properties:
  - userLanguage - the user language (the language in which to provide translation, extra information, etc);
  - wordLanguage - the target language (the one the user is learning)
  - word - word in the target language
  - partOfSpeech - part of speech to which the word belongs (use as an extra hint to disambiguate)

  Given this input, provide examples of using the word in the target language. If the word has multiple interpretations,
  separate the output per interpretation (using the 'interpretations' property; provide up to 3 most common and at least 1). For each interpretation, provide:
  - interpretation: short title/description of the interpretation (in user language)
  - example: short sentence in the target language using the word
  - translation: translation of the whole sentence (in user language)
  Additionally, if there are some extra insights about using the word, include those in the optional 'extra' output property (in user language).
`;

export const DEFAULT_USER_LANGUAGE = 'English';

const AI_DAILY_RATE_LIMIT_KEY = 'ai_daily_limit';
const AI_DAILY_RATE_LIMIT_LIMIT = 200;
const AI_HOURLY_RATE_LIMIT_KEY = 'ai_hourly_limit';
const AI_HOURLY_RATE_LIMIT_LIMIT = 50;

@Injectable()
export class AiWordService implements OnApplicationBootstrap {
  constructor(
    private aiClient: AiClient,
    private languageService: LanguageService,
    private wordService: WordService,
    private userService: UserService,
    private aiOutputsRepository: AiOutputsRepository,
    private rateLimiter: RateLimitService,
  ) {}

  onApplicationBootstrap() {
    this.rateLimiter.register({
      key: AI_DAILY_RATE_LIMIT_KEY,
      bucket: RateLimitBucket.Daily,
      limit: AI_DAILY_RATE_LIMIT_LIMIT,
    });
    this.rateLimiter.register({
      key: AI_HOURLY_RATE_LIMIT_KEY,
      bucket: RateLimitBucket.Hourly,
      limit: AI_HOURLY_RATE_LIMIT_LIMIT,
    });
  }

  async getUsage(ctx: Context, wordId: WordId): Promise<WordUsage | null> {
    const usageKey = `${AiOutputType.WordUsage}:${wordId}`;
    const cachedUsage =
      await this.aiOutputsRepository.getByKey<WordUsage>(usageKey);

    if (cachedUsage) {
      return cachedUsage;
    }

    const inferredUsage = await this.inferUsage(ctx, wordId);
    if (inferredUsage) {
      await this.aiOutputsRepository.create(
        usageKey,
        AiOutputType.WordUsage,
        inferredUsage,
      );
    }

    return inferredUsage;
  }

  private async inferUsage(
    ctx: Context,
    wordId: WordId,
  ): Promise<WordUsage | null> {
    if (this.isRateLimited(ctx)) {
      Logger.warn('Rate limit reached for user', ctx.user.id);

      return null;
    }

    const [userSettings, word] = await Promise.all([
      this.userService.getSettings(ctx.user.id),
      this.wordService.getById(ctx, wordId),
    ]);
    const wordLanguage = await this.languageService.getById(
      ctx,
      word.languageId,
    );
    const userLanguage =
      localeToName[userSettings.selectedLocale as string] ??
      DEFAULT_USER_LANGUAGE;

    return await this.aiClient.infer<InferUsageParams, typeof WordUsage>({
      instruction: INFER_USAGE_INSTRUCTION,
      input: {
        userLanguage,
        wordLanguage: wordLanguage.name,
        word: word.original,
        partOfSpeech: word.partOfSpeech,
      },
      outputSchema: WordUsage,
    });
  }

  private isRateLimited(ctx: Context): boolean {
    const actor = ctx.user.id;

    return (
      this.rateLimiter.isRateLimited(AI_DAILY_RATE_LIMIT_KEY, actor) ||
      this.rateLimiter.isRateLimited(AI_HOURLY_RATE_LIMIT_KEY, actor)
    );
  }
}
