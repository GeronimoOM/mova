import { Injectable } from '@nestjs/common';
import { GoalsTable } from 'knex/types/tables';
import { LanguageId } from 'models/Language';
import { Goal, ProgressType } from 'models/Progress';
import { DbConnectionManager } from './DbConnectionManager';

// const TABLE_PROGRESS = 'progress';
const TABLE_GOALS = 'goals';

@Injectable()
export class ProgressRepository {
  constructor(private connectionManager: DbConnectionManager) {}

  async getGoal(
    languageId: LanguageId,
    type: ProgressType,
  ): Promise<Goal | null> {
    const goal = await this.connectionManager
      .getConnection()(TABLE_GOALS)
      .where('language_id', languageId)
      .where('type', type)
      .first();

    return goal ? this.mapToGoal(goal) : null;
  }

  async getGoals(languageId: LanguageId): Promise<Goal[]> {
    const goals = await this.connectionManager
      .getConnection()(TABLE_GOALS)
      .where('language_id', languageId);

    return goals.map((goal) => this.mapToGoal(goal));
  }

  async saveGoals(goals: Goal[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_GOALS)
      .insert(
        goals.map((goal) => ({
          language_id: goal.languageId,
          type: goal.type,
          cadence: goal.cadence,
          points: goal.points,
        })),
      )
      .onConflict('type')
      .merge();
  }

  private mapToGoal(goal: GoalsTable): Goal {
    return {
      type: goal.type,
      cadence: goal.cadence,
      points: goal.points,
      languageId: goal.language_id,
    };
  }
}
