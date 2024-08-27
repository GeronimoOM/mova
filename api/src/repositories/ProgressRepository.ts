import { Injectable } from '@nestjs/common';
import { GoalsTable } from 'knex/types/tables';
import { Goal } from 'models/Goal';
import { LanguageId } from 'models/Language';
import { DbConnectionManager } from './DbConnectionManager';

// const TABLE_PROGRESS = 'progress';
const TABLE_GOALS = 'goals';

@Injectable()
export class ProgressRepository {
  constructor(private connectionManager: DbConnectionManager) {}

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

  // async getProgressHistory(
  //   languageId: LanguageId,
  //   from: DateTime,
  //   until: DateTime,
  //   timezone?: string;
  // ): Promise<WordsDateStats[]> {
  //   const fromFormatted = from.toFormat(DATE_FORMAT);
  //   const untilFormatted = until.toFormat(DATE_FORMAT);

  //   const connection = this.connectionManager.getConnection();
  //   const countsByDates = await connection(TABLE_WORDS)
  //     .select({
  //       date: connection.raw('date(added_at)'),
  //       words: connection.raw('count(id)'),
  //     })
  //     .where('language_id', languageId)
  //     .andWhere(connection.raw('date(added_at)'), '>=', fromFormatted)
  //     .andWhere(connection.raw('date(added_at)'), '<', untilFormatted)
  //     .groupByRaw('date(added_at)');

  //   return countsByDates.map(({ date, words }) => ({
  //     date: DateTime.fromFormat(date, DATE_FORMAT),
  //     words,
  //   }));
  // }

  private mapToGoal(goal: GoalsTable): Goal {
    return {
      type: goal.type,
      cadence: goal.cadence,
      points: goal.points,
      languageId: goal.language_id,
    };
  }
}
