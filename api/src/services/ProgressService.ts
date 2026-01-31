import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DateTime, Duration } from 'luxon';
import { Context } from 'models/Context';
import { Goal } from 'models/Goal';
import { LanguageId } from 'models/Language';
import {
  Progress,
  ProgressCadence,
  ProgressHistory,
  ProgressId,
  ProgressInstance,
  ProgressType,
  ProgressTypes,
} from 'models/Progress';
import { WordsStats } from 'models/WordsStats';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { ProgressRepository } from 'repositories/ProgressRepository';
import { WordRepository } from 'repositories/WordRepository';
import { TIMEZONE_OFFSET_FORMAT } from 'utils/constants';
import { LanguageService } from './LanguageService';

const DEFAULT_GOALS: Record<ProgressType, Omit<Goal, 'languageId'>> = {
  [ProgressType.Mastery]: {
    type: ProgressType.Mastery,
    cadence: ProgressCadence.Daily,
    points: 5,
  },
  [ProgressType.Words]: {
    type: ProgressType.Words,
    cadence: ProgressCadence.Weekly,
    points: 30,
  },
};

const DEFAULT_HISTORY_SPAN = Duration.fromObject({ months: 3 });

@Injectable()
export class ProgressService {
  constructor(
    @Inject(forwardRef(() => LanguageService))
    private languageService: LanguageService,
    @Inject(forwardRef(() => WordRepository))
    private wordRepository: WordRepository,
    private progressRepository: ProgressRepository,
    private dbConnectionManager: DbConnectionManager,
  ) {}

  async getStats(languageId: LanguageId): Promise<WordsStats> {
    const [total, mastery, confidence, partsOfSpeech] = await Promise.all([
      this.wordRepository.getCount(languageId),
      this.wordRepository.getCountByMastery(languageId),
      this.wordRepository.getCountByConfidence(languageId),
      this.wordRepository.getCountByPartOfSpeech(languageId),
    ]);

    return {
      total,
      mastery,
      confidence,
      partsOfSpeech,
    };
  }

  async getGoal(
    ctx: Context,
    languageId: LanguageId,
    type: ProgressType,
  ): Promise<Goal> {
    const goals = await this.getGoals(ctx, languageId);

    return goals.find((goal) => goal.type === type)!;
  }

  async getGoals(ctx: Context, languageId: LanguageId): Promise<Goal[]> {
    if (!(await this.languageService.exists(ctx, languageId))) {
      throw new Error(`Language does not exist (id:${languageId})`);
    }

    const goals = await this.progressRepository.getGoals(languageId);

    return ProgressTypes.map(
      (type) =>
        goals.find((goal) => goal.type === type) ?? {
          ...DEFAULT_GOALS[type],
          languageId,
        },
    );
  }

  async setGoals(goals: Goal[]): Promise<Goal[]> {
    await this.progressRepository.saveGoals(goals);

    return await this.progressRepository.getGoals(goals[0].languageId);
  }

  async getProgressHistory(
    ctx: Context,
    languageId: LanguageId,
    type: ProgressType,
    cadence?: ProgressCadence,
  ): Promise<ProgressHistory> {
    if (!cadence) {
      const goal = await this.getGoal(ctx, languageId, type);
      cadence = goal.cadence;
    }

    const isDailyCadence = cadence === ProgressCadence.Daily;
    const today = DateTime.utc().setZone(ctx.timezone);
    const from = today
      .minus(DEFAULT_HISTORY_SPAN)
      .startOf(isDailyCadence ? 'day' : 'week');
    const until = today
      .plus(isDailyCadence ? { days: 1 } : { week: 1 })
      .startOf(isDailyCadence ? 'day' : 'week');
    const timezoneOffset = today.toFormat(TIMEZONE_OFFSET_FORMAT);

    const instances = await this.progressRepository.getProgressHistory({
      languageId,
      type,
      cadence,
      from,
      until,
      timezoneOffset,
    });

    return {
      cadence,
      from,
      until,
      instances,
    };
  }

  async getCurrentProgress(
    ctx: Context,
    languageId: LanguageId,
    type: ProgressType,
    cadence: ProgressCadence,
  ): Promise<Progress> {
    const isDailyCadence = cadence === ProgressCadence.Daily;
    const today = DateTime.utc().setZone(ctx.timezone);
    const from = today.startOf(isDailyCadence ? 'day' : 'week');
    const until = today
      .plus(isDailyCadence ? { days: 1 } : { week: 1 })
      .startOf(isDailyCadence ? 'day' : 'week');
    const timezoneOffset = today.toFormat(TIMEZONE_OFFSET_FORMAT);

    const [instance] = await this.progressRepository.getProgressHistory({
      languageId,
      type,
      cadence,
      from,
      until,
      timezoneOffset,
    });

    return (
      instance ?? {
        date: from,
        type,
        cadence,
        points: 0,
      }
    );
  }

  async getProgressStreak(
    ctx: Context,
    languageId: LanguageId,
    type: ProgressType,
  ): Promise<number> {
    const goal = await this.getGoal(ctx, languageId, type);
    const { cadence } = goal;
    const isDailyCadence = cadence === ProgressCadence.Daily;

    // TODO check more history if full streak
    const { until, instances } = await this.getProgressHistory(
      ctx,
      languageId,
      type,
      cadence,
    );

    if (!instances.length) {
      return 0;
    }

    const previousDate = (date: DateTime) =>
      date.minus(isDailyCadence ? { day: 1 } : { week: 1 });

    const currentDate = previousDate(until);
    const startsWithCurrent = currentDate.hasSame(
      instances[instances.length - 1].date,
      'day',
    );

    let expectedDate = currentDate;
    if (!startsWithCurrent) {
      expectedDate = previousDate(expectedDate);
    }

    let streak = 0;
    for (
      let i = instances.length - 1;
      i >= 0;
      i--, expectedDate = previousDate(expectedDate)
    ) {
      const { date, points } = instances[i];

      if (points >= goal.points && expectedDate.hasSame(date, 'day')) {
        streak++;
        continue;
      }

      // check if not current date
      if (i === instances.length - 1 && startsWithCurrent) {
        continue;
      }

      break;
    }

    return streak;
  }

  async saveProgress(
    languageId: LanguageId,
    progress: ProgressInstance,
  ): Promise<void> {
    await this.progressRepository.saveProgress(languageId, progress);
  }

  async deleteProgress(id: ProgressId) {
    await this.progressRepository.deleteProgress(id);
  }

  async syncAllWordsProgress(languageId: LanguageId): Promise<void> {
    await this.dbConnectionManager.transactionally(async () => {
      await this.progressRepository.deleteProgressByType(
        languageId,
        ProgressType.Words,
      );

      for await (const wordsBatch of this.wordRepository.getBatches(
        languageId,
      )) {
        const progress: ProgressInstance[] = wordsBatch.map((word) => ({
          id: word.id,
          date: word.addedAt,
          type: ProgressType.Words,
        }));

        await this.progressRepository.saveProgress(languageId, progress);
      }
    });
  }
}
