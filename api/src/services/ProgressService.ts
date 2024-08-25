import { Injectable } from '@nestjs/common';
import { LanguageId } from 'models/Language';
import {
  Goal,
  ProgressCadence,
  ProgressType,
  ProgressTypes,
} from 'models/Progress';
import { ProgressRepository } from 'repositories/ProgressRepository';

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
  constructor(private progressRepository: ProgressRepository) {}

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
}
