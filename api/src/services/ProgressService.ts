import { Injectable } from '@nestjs/common';
import { Goal } from 'models/Goal';
import { LanguageId } from 'models/Language';
import {
  Progress,
  ProgressCadence,
  ProgressType,
  ProgressTypes,
} from 'models/Progress';
import { WordsStats } from 'models/WordsStats';
import { ProgressRepository } from 'repositories/ProgressRepository';
import { WordRepository } from 'repositories/WordRepository';
import { Context } from 'vm';

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

@Injectable()
export class ProgressService {
  constructor(
    private wordRepository: WordRepository,
    private progressRepository: ProgressRepository,
  ) {}

  async getStats(languageId: LanguageId): Promise<WordsStats> {
    const [total, mastery, partsOfSpeech] = await Promise.all([
      this.wordRepository.getCount(languageId),
      this.wordRepository.getCountByMastery(languageId),
      this.wordRepository.getCountByPartOfSpeech(languageId),
    ]);

    return {
      total,
      mastery,
      partsOfSpeech,
    };
  }

  async getGoals(languageId: LanguageId): Promise<Goal[]> {
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

  async getCurrentProgress(
    ctx: Context,
    languageId: LanguageId,
    type: ProgressType,
    cadence?: ProgressCadence,
  ): Promise<Progress> {
    if (!cadence) {
      const goals = await this.getGoals(languageId);
      const goal = goals.find((goal) => goal.type === type);
      cadence = goal.cadence;
    }

    throw new Error('not implemented');
  }

  async syncWordsProgress(languageId: LanguageId): Promise<void> {
    throw new Error('not implemented');
  }
}
