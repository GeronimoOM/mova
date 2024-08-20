import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { Context } from 'models/Context';
import { LanguageId } from 'models/Language';
import { Word, WordMasteries, WordMastery, WordOrder } from 'models/Word';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { WordRepository } from 'repositories/WordRepository';
import { shuffle } from 'utils/arrays';
import { ChangeBuilder } from './ChangeBuilder';
import { ChangeService } from './ChangeService';

const DEFAULT_EXERCISE_WORDS_TOTAL = 20;

const MASTERY_DISTRIBUTION: Record<WordMastery, number> = {
  0: 0.5,
  1: 0.3,
  2: 0.15,
  3: 0.05,
};

const MASTERY_GAIN_DELAY: Record<WordMastery, Duration> = {
  0: Duration.fromObject({ days: 0 }),
  1: Duration.fromObject({ days: 1 }),
  2: Duration.fromObject({ days: 2 }),
  3: Duration.fromObject({ days: 5 }),
};

export type GetExerciseWordsParams = {
  languageId: LanguageId;
  total?: number;
};

@Injectable()
export class ExerciseService {
  constructor(
    private wordRepository: WordRepository,
    @Inject(forwardRef(() => ChangeService))
    private changeService: ChangeService,
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

    const words = Object.entries(totalByMastery).flatMap(([mastery, count]) =>
      wordsByMastery[Number(mastery)].slice(0, count),
    );

    return shuffle(words);
  }

  async increaseMastery(ctx: Context, wordId: string): Promise<Word> {
    const currentWord = await this.wordRepository.getById(wordId);
    if (!currentWord) {
      throw new Error('Word does not exist');
    }

    if (currentWord.mastery >= 3) {
      return currentWord;
    }

    if (
      currentWord.addedAt.plus(MASTERY_GAIN_DELAY[currentWord.mastery]) <
      DateTime.utc()
    ) {
      throw new Error('Word mastery cannot be increased yet');
    }

    const word = { ...currentWord, mastery: currentWord.mastery + 1 };

    const change = this.changeBuilder.buildUpdateWordChange(
      ctx,
      word,
      currentWord,
    );

    if (change) {
      await this.connectionManager.transactionally(async () => {
        await this.wordRepository.update(word);
        await this.changeService.create(change);
      });
    }

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
        addedAtOlderThan: MASTERY_GAIN_DELAY[mastery],
      })
    ).items;
  }
}
