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
import { v1 as uuid } from 'uuid';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';
import { ProgressService } from './ProgressService';

const DEFAULT_EXERCISE_WORDS_TOTAL = 20;

const MASTERY_DISTRIBUTION: Record<WordMastery, number> = {
  0: 0.5,
  1: 0.3,
  2: 0.15,
  3: 0.05,
};

const MASTERY_INC_DELAY: Record<WordMastery, Duration> = {
  0: Duration.fromObject({ hours: 1 }),
  1: Duration.fromObject({ hours: 24 }),
  2: Duration.fromObject({ hours: 24 * 5 }),
  3: Duration.fromObject({ hours: 24 * 5 }),
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
    private changeBuilder: ChangeBuilder,
    private connectionManager: DbConnectionManager,
  ) {}

  async getWords({
    languageId,
    total = DEFAULT_EXERCISE_WORDS_TOTAL,
  }: GetExerciseWordsParams): Promise<Word[]> {
    const wordsByMastery = Object.fromEntries(
      await Promise.all(
        WordMasteries.map(async (mastery) => [
          mastery,
          await this.getWordsByMastery(languageId, mastery, total),
        ]),
      ),
    ) as Record<WordMastery, Word[]>;

    const totalByMastery = Object.fromEntries(
      Object.entries(MASTERY_DISTRIBUTION).map(([mastery, distribution]) => [
        mastery,
        Math.min(
          Math.floor(distribution * total),
          wordsByMastery[mastery].length,
        ),
      ]),
    ) as Record<WordMastery, number>;

    let sum = Object.values(totalByMastery).reduce(
      (acc, value) => acc + value,
      0,
    );
    for (
      let mastery = 0;
      mastery < WordMasteries.length && sum < total;
      mastery++
    ) {
      const masteryDistributionExtra = Math.min(
        wordsByMastery[mastery].length - totalByMastery[mastery],
        total - sum,
      );

      totalByMastery[mastery] += masteryDistributionExtra;
      sum += masteryDistributionExtra;
    }

    const words: Word[] = Object.entries(totalByMastery).flatMap(
      ([mastery, count]) => wordsByMastery[Number(mastery)].slice(0, count),
    );

    return shuffle(words);
  }

  async attemptMastery(
    ctx: Context,
    params: AttemptMasteryParams,
  ): Promise<Word> {
    const currentWord = await this.wordRepository.getById(params.wordId);
    if (!currentWord) {
      throw new Error('Word does not exist');
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
      throw new Error('Word mastery cannot be increased yet');
    }

    if (!params.success) {
      const word = {
        ...currentWord,
        masteryAttemptAt: DateTime.utc(),
      };
      await this.wordRepository.update(word);

      return word;
    }

    const word = {
      ...currentWord,
      mastery: Math.min(currentWord.mastery + 1, MaxWordMastery),
    };

    const change = this.changeBuilder.buildUpdateWordChange(
      ctx,
      word,
      currentWord,
    );
    word.masteryIncAt = change?.changedAt ?? DateTime.utc();
    word.masteryAttemptAt = word.masteryIncAt;

    await this.connectionManager.transactionally(async () => {
      await this.wordRepository.update(word);
      change && (await this.changeService.create(change));
      await this.progressService.saveProgress(word.languageId, {
        id: uuid(),
        type: ProgressType.Mastery,
        date: change.changedAt,
      });
    });

    return word;
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
}
