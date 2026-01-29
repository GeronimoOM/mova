import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { ProgressType } from 'models/Progress';
import {
  Word,
  WordConfidence,
  WordId,
  WordMasteries,
  WordMastery,
  WordOrder,
} from 'models/Word';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { WordRepository } from 'repositories/WordRepository';
import { shuffle } from 'utils/arrays';
import * as records from 'utils/records';
import { v1 as uuid } from 'uuid';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';
import { LanguageService } from './LanguageService';
import { ProgressService } from './ProgressService';

const DEFAULT_EXERCISE_WORDS_TOTAL = 20;

// percentage of exercise words
const MASTERY_BASE_DISTRIBUTION_COEF = 0.4;

const MASTERY_DELAY_BASE: Record<WordMastery, Duration> = {
  [WordMastery.None]: Duration.fromObject({ hours: 1 }),
  [WordMastery.Basic]: Duration.fromObject({ hours: 12 }),
  [WordMastery.Intermediate]: Duration.fromObject({ hours: 24 * 3 }),
  [WordMastery.Advanced]: Duration.fromObject({ hours: 24 * 7 }),
};

export const CONFIDENCE_DELAY_MULTIPLIER: Record<WordConfidence, number> = {
  [WordConfidence.Lowest]: 0.2,
  [WordConfidence.Low]: 0.6,
  [WordConfidence.Normal]: 1,
  [WordConfidence.High]: 1.5,
  [WordConfidence.Higher]: 2,
  [WordConfidence.Highest]: 3,
};

export type GetExerciseWordsParams = {
  languageId: LanguageId;
  total?: number;
};

export type AttemptMasteryParams = {
  wordId: WordId;
  success: boolean;
};

@Injectable()
export class ExerciseService {
  constructor(
    private languageService: LanguageService,
    private wordRepository: WordRepository,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private progressService: ProgressService,
    @Inject(forwardRef(() => ChangeBuilder))
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
  ) {}

  async getWords(
    ctx: Context,
    {
      languageId,
      total = DEFAULT_EXERCISE_WORDS_TOTAL,
    }: GetExerciseWordsParams,
  ): Promise<Word[]> {
    if (!(await this.languageService.exists(ctx, languageId))) {
      throw new Error(`Language does not exist (id:${languageId})`);
    }

    const wordsByMasteryTuples = await Promise.all(
      WordMasteries.map(
        async (mastery) =>
          [
            mastery,
            await this.getWordsByMastery(languageId, mastery, total),
          ] as [WordMastery, Word[]],
      ),
    );
    const wordsByMastery = Object.fromEntries(
      wordsByMasteryTuples.filter(([, words]) => words.length),
    ) as Record<WordMastery, Word[]>;

    if (!Object.keys(wordsByMastery).length) {
      return [];
    }

    const totalByMastery = await this.getTotalByMastery(
      languageId,
      total,
      wordsByMastery,
    );

    const words: Word[] = Object.entries(totalByMastery).flatMap(
      ([mastery, count]) => wordsByMastery[mastery]?.slice(0, count) ?? [],
    );

    return ctx.sortExercises
      ? words.toSorted((w1, w2) => (w1.id < w2.id ? -1 : 1))
      : shuffle(words);
  }

  async getCount(ctx: Context, languageId: LanguageId): Promise<number> {
    if (!(await this.languageService.exists(ctx, languageId))) {
      throw new Error(`Language does not exist (id:${languageId})`);
    }

    return await this.wordRepository.getCount(languageId, {
      masteryAttemptOlderThan: {
        masteryDelayBase: MASTERY_DELAY_BASE,
        confidenceDelayMultiplier: CONFIDENCE_DELAY_MULTIPLIER,
      },
      excludeMaxMasteryConfidence: true,
    });
  }

  async attemptMastery(
    ctx: Context,
    params: AttemptMasteryParams,
  ): Promise<Word> {
    const currentWord = await this.wordRepository.getById(params.wordId);
    if (!currentWord) {
      throw new Error(`Word does not exist (wordId:${params.wordId})`);
    }

    if (this.getNextExerciseAt(currentWord) > DateTime.utc()) {
      throw new Error(
        `Word exercise cannot be attempted yet (wordId:${params.wordId})`,
      );
    }

    const now = DateTime.utc();
    const word = {
      ...currentWord,
      masteryAttemptAt: now,
    };

    if (params.success) {
      if (word.confidence < WordConfidence.Normal) {
        word.confidence += 1;
      } else if (word.mastery === WordMastery.Advanced) {
        word.confidence = Math.min(word.confidence + 1, WordConfidence.Highest);
      } else {
        word.mastery += 1;
      }
    } else {
      if (word.confidence === WordConfidence.Lowest) {
        word.mastery = Math.max(word.mastery - 1, WordMastery.None);
      } else {
        word.confidence = word.confidence - 1;
      }
    }

    const change = this.changeBuilder.buildUpdateWordChange(
      ctx,
      word,
      currentWord,
    );

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.update(word);
      if (change) {
        change.changedAt = now;
        await this.changeService.create(change);
      }

      if (params.success) {
        await this.progressService.saveProgress(word.languageId, {
          id: uuid(),
          type: ProgressType.Mastery,
          date: now,
        });
      }
    });

    return word;
  }

  async resetConfidence(ctx: Context, wordId: WordId): Promise<Word> {
    const currentWord = await this.wordRepository.getById(wordId);
    if (!currentWord) {
      throw new Error(`Word does not exist (wordId:${wordId})`);
    }

    if (
      currentWord.mastery !== WordMastery.Advanced ||
      currentWord.confidence !== WordConfidence.Highest
    ) {
      throw new Error(
        `Word exercise cannot be attempted yet (wordId:${wordId})`,
      );
    }

    const now = DateTime.utc();
    const word = {
      ...currentWord,
      confidence: WordConfidence.Normal,
    };

    const change = this.changeBuilder.buildUpdateWordChange(
      ctx,
      word,
      currentWord,
    );

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.update(word);
      if (change) {
        change.changedAt = now;
        await this.changeService.create(change);
      }
    });

    return word;
  }

  getNextExerciseAt(
    word: Pick<Word, 'mastery' | 'confidence' | 'addedAt' | 'masteryAttemptAt'>,
  ): DateTime {
    return (word.masteryAttemptAt ?? word.addedAt).plus(
      MASTERY_DELAY_BASE[word.mastery] *
        CONFIDENCE_DELAY_MULTIPLIER[word.confidence],
    );
  }

  private async getWordsByMastery(
    languageId: LanguageId,
    mastery: WordMastery,
    total: number,
  ): Promise<Word[]> {
    return (
      await this.wordRepository.getPage({
        languageId,
        limit: total,
        order: WordOrder.Confidence,
        mastery,
        masteryAttemptOlderThan: {
          masteryDelayBase: MASTERY_DELAY_BASE,
          confidenceDelayMultiplier: CONFIDENCE_DELAY_MULTIPLIER,
        },
        excludeMaxMasteryConfidence: true,
      })
    ).items;
  }

  private async getTotalByMastery(
    languageId: LanguageId,
    total: number,
    wordsByMastery: Record<WordMastery, Word[]>,
  ): Promise<Record<WordMastery, number>> {
    const countByMastery = await this.wordRepository.getCountByMastery(
      languageId,
      {
        masteryAttemptOlderThan: {
          masteryDelayBase: MASTERY_DELAY_BASE,
          confidenceDelayMultiplier: CONFIDENCE_DELAY_MULTIPLIER,
        },
        excludeMaxMasteryConfidence: true,
      },
    );
    const countsSum = Object.values(countByMastery).reduce(
      (count, sum) => count + sum,
      0,
    );
    const percentageByMasteryFromTotal = records.mapValues(
      countByMastery,
      (count) =>
        (countsSum ? count / countsSum : 0) *
        (1 - MASTERY_BASE_DISTRIBUTION_COEF),
    );

    const basePercentageByMastery =
      (1 / Object.keys(wordsByMastery).length) * MASTERY_BASE_DISTRIBUTION_COEF;
    const totalByMastery = records.map(
      wordsByMastery,
      ([mastery, masteryWords]) => [
        mastery,
        Math.min(
          Math.floor(
            total *
              (basePercentageByMastery +
                (percentageByMasteryFromTotal[mastery] ?? 0)),
          ),
          masteryWords.length,
        ),
      ],
    ) as Record<WordMastery, number>;

    let currentTotal = Object.values(totalByMastery).reduce(
      (sum, value) => sum + value,
      0,
    );
    for (const mastery of WordMasteries) {
      if (currentTotal >= total) {
        break;
      }

      const extraMasteryTotal = Math.min(
        (wordsByMastery[mastery]?.length ?? 0) - totalByMastery[mastery],
        total - currentTotal,
      );

      totalByMastery[mastery] += extraMasteryTotal;
      currentTotal += extraMasteryTotal;
    }

    return totalByMastery;
  }
}
