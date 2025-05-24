import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { ProgressType } from 'models/Progress';
import {
  MaxWordMastery,
  Word,
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
import { ProgressService } from './ProgressService';
import { UserService } from './UserService';

const DEFAULT_EXERCISE_WORDS_TOTAL = 20;

const MASTERY_BASE_DISTRIBUTION_COEF = 0.4;

const MASTERY_INC_DELAY: Record<WordMastery, Duration> = {
  0: Duration.fromObject({ hours: 1 }),
  1: Duration.fromObject({ hours: 12 }),
  2: Duration.fromObject({ hours: 24 * 3 }),
  3: Duration.fromObject({ hours: 24 * 28 }),
};

const MASTERY_ATTEMPT_DELAY = Duration.fromObject({ hours: 1 });

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
    private wordRepository: WordRepository,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
    private progressService: ProgressService,
    private userService: UserService,
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
    const includeMastered = await this.getIncludeMastered(ctx);
    const wordsByMasteryTuples = await Promise.all(
      WordMasteries.filter(
        (mastery) => includeMastered || mastery < MaxWordMastery,
      ).map(
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

    return shuffle(words);
  }

  async getCount(ctx: Context, languageId: LanguageId): Promise<number> {
    const includeMastered = await this.getIncludeMastered(ctx);

    const counts = await Promise.all(
      WordMasteries.filter(
        (mastery) => includeMastered || mastery < MaxWordMastery,
      ).map(
        async (mastery) =>
          await this.wordRepository.getExerciseCount({
            languageId,
            mastery,
            masteryIncOlderThan: MASTERY_INC_DELAY[mastery],
            masteryAttemptOlderThan: MASTERY_ATTEMPT_DELAY,
          }),
      ),
    );

    return counts.reduce((sum, count) => sum + count, 0);
  }

  async attemptMastery(
    ctx: Context,
    params: AttemptMasteryParams,
  ): Promise<Word> {
    const currentWord = await this.wordRepository.getById(params.wordId);
    if (!currentWord) {
      throw new Error(`Word does not exist (wordId:${params.wordId})`);
    }

    if (
      (params.success &&
        (currentWord.masteryIncAt ?? currentWord.addedAt).plus(
          MASTERY_INC_DELAY[currentWord.mastery],
        ) >= DateTime.utc()) ||
      (currentWord.masteryAttemptAt &&
        currentWord.masteryAttemptAt.plus(MASTERY_ATTEMPT_DELAY) >=
          DateTime.utc())
    ) {
      throw new Error(
        `Word mastery cannot be increased yet (wordId:${params.wordId})`,
      );
    }

    const now = DateTime.utc();
    const word = {
      ...currentWord,
      masteryAttemptAt: now,
      ...(params.success && {
        masteryIncAt: now,
        mastery: Math.min(currentWord.mastery + 1, MaxWordMastery),
      }),
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

  getNextExerciseAt(
    word: Pick<
      Word,
      'mastery' | 'addedAt' | 'masteryIncAt' | 'masteryAttemptAt'
    >,
  ): DateTime {
    const masteryDelayUntil = (word.masteryIncAt ?? word.addedAt).plus(
      MASTERY_INC_DELAY[word.mastery],
    );
    const attemptDelayUntil = word.masteryAttemptAt?.plus(
      MASTERY_ATTEMPT_DELAY,
    );
    const maxDelayUntil = attemptDelayUntil
      ? DateTime.max(masteryDelayUntil, attemptDelayUntil)
      : masteryDelayUntil;

    return maxDelayUntil;
  }

  private async getWordsByMastery(
    languageId: LanguageId,
    mastery: number,
    total: number,
  ): Promise<Word[]> {
    return (
      await this.wordRepository.getPage({
        languageId,
        limit: total,
        order: WordOrder.Random,
        mastery,
        masteryIncOlderThan: MASTERY_INC_DELAY[mastery],
        masteryAttemptOlderThan: MASTERY_ATTEMPT_DELAY,
      })
    ).items;
  }

  private async getIncludeMastered(ctx: Context): Promise<boolean> {
    const settings = await this.userService.getSettings(ctx.user.id);
    return settings.includeMastered ?? true;
  }

  private async getTotalByMastery(
    languageId: LanguageId,
    total: number,
    wordsByMastery: Record<WordMastery, Word[]>,
  ): Promise<Record<WordMastery, number>> {
    const basePercentageByMastery =
      (1 / Object.keys(wordsByMastery).length) * MASTERY_BASE_DISTRIBUTION_COEF;

    const countByMastery =
      await this.wordRepository.getCountByMastery(languageId);
    delete countByMastery[MaxWordMastery];
    const totalCount = Object.values(countByMastery).reduce(
      (count, sum) => count + sum,
      0,
    );
    const percentageByMasteryFromTotal = records.mapValues(
      countByMastery,
      (count) =>
        (totalCount ? count / totalCount : 0) *
        (1 - MASTERY_BASE_DISTRIBUTION_COEF),
    );

    const totalByMastery = Object.fromEntries(
      Object.entries(wordsByMastery).map(([mastery, masteryWords]) => [
        mastery,
        Math.min(
          Math.floor(
            total *
              (basePercentageByMastery +
                (percentageByMasteryFromTotal[mastery] ?? 0)),
          ),
          masteryWords.length,
        ),
      ]),
    ) as Record<WordMastery, number>;

    let currentTotal = Object.values(totalByMastery).reduce(
      (value, sum) => sum + value,
      0,
    );
    for (const [mastery, masteryWords] of Object.entries(wordsByMastery)) {
      if (currentTotal >= total) {
        break;
      }

      if (Number(mastery) === MaxWordMastery) {
        continue;
      }

      const extraMasteryTotal = Math.min(
        masteryWords.length - totalByMastery[mastery],
        total - currentTotal,
      );

      totalByMastery[mastery] += extraMasteryTotal;
      currentTotal += extraMasteryTotal;
    }

    return totalByMastery;
  }
}
