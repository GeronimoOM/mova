import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AiClient } from 'clients/AiClient';
import { AiOutputType } from 'models/AiOutput';
import { AISentences, AiWordOverview } from 'models/AiWordOverview';
import { Context } from 'models/Context';
import { PartOfSpeech, WordId } from 'models/Word';
import { AiOutputsRepository } from 'repositories/AiOutputsRepository';
import { localeToName } from 'utils/locale';
import { LanguageService } from './LanguageService';
import { RateLimitBucket, RateLimitService } from './RateLimitService';
import { UserService } from './UserService';
import { WordService } from './WordService';

type InferOverviewParams = {
  userLanguage: string;
  wordLanguage: string;
  word: string;
  partOfSpeech: PartOfSpeech;
};

const INFER_WORD_OVERVIEW_INSTRUCTION = `
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

type InferSentencesFixParams = {
  language: string;
  sentences: string[];
  word: string;
};

const INFER_SENTENCES_FIX_INSTRUCTION = `
  You are assisting at language learning.
  As an input you will receieve several sentences in the target language.
  The input is in JSON format and has the following properties:
  - language - the target language (the one the user is learning)
  - sentences - array of sentences in the target language
  - word - key word that must be present in all of the sentences

  Given this input, fix all the sentences to be gramatically and stylistically correct. Try to make sure that the fixed version of the sentence
  remains similar to the original one. Additional key requirement is that each sentence has to contain the key word provided in the input
  or some form of that word (e.g., conjugated, in specific tense, etc.) as required by the grammar rules.
  If a sentence is already correct, simply return it without any changes.
  Return an array of fixed sentences of the same length as the length of the input array (fixed sentence on the same position as its original sentence)
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

  async getOverview(
    ctx: Context,
    wordId: WordId,
  ): Promise<AiWordOverview | null> {
    const type = AiOutputType.WordOverview;
    const key = `${type}:${wordId}`;

    return await this.getAiOutput(ctx, key, type, async () => {
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

      const overview = await this.aiClient.infer({
        instruction: INFER_WORD_OVERVIEW_INSTRUCTION,
        input: {
          userLanguage,
          wordLanguage: wordLanguage.name,
          word: word.original,
          partOfSpeech: word.partOfSpeech,
        } as InferOverviewParams,
        outputSchema: AiWordOverview,
      });

      if (!overview) {
        return null;
      }

      const fixedSentences = await this.aiClient.infer({
        instruction: INFER_SENTENCES_FIX_INSTRUCTION,
        input: {
          language: wordLanguage.name,
          sentences: overview.interpretations.map(({ example }) => example),
          word: word.original,
        } as InferSentencesFixParams,
        outputSchema: AISentences,
      });

      if (fixedSentences?.length !== overview.interpretations.length) {
        return overview;
      }

      fixedSentences.forEach((fixedSentence, idx) => {
        overview.interpretations[idx].example = fixedSentence;
      });

      return overview;
    });
  }

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

  private async getAiOutput<T>(
    ctx: Context,
    key: string,
    type: AiOutputType,
    inferOutput: () => Promise<T | null>,
  ): Promise<T | null> {
    const cachedOutput = await this.aiOutputsRepository.getByKey<T>(key);

    if (cachedOutput) {
      return cachedOutput;
    }

    if (this.isRateLimited(ctx)) {
      Logger.warn('Rate limit reached for user', ctx.user.id);

      return null;
    }

    const inferredOutput = await inferOutput();
    if (inferredOutput) {
      await this.aiOutputsRepository.create(key, type, inferredOutput);
    }

    return inferredOutput;
  }

  private isRateLimited(ctx: Context): boolean {
    const actor = ctx.user.id;

    return (
      this.rateLimiter.isRateLimited(AI_DAILY_RATE_LIMIT_KEY, actor) ||
      this.rateLimiter.isRateLimited(AI_HOURLY_RATE_LIMIT_KEY, actor)
    );
  }
}
