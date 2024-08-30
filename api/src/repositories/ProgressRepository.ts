import { Injectable } from '@nestjs/common';
import { GoalsTable } from 'knex/types/tables';
import { DateTime } from 'luxon';
import { Goal } from 'models/Goal';
import { LanguageId } from 'models/Language';
import {
  Progress,
  ProgressCadence,
  ProgressId,
  ProgressInstance,
  ProgressType,
} from 'models/Progress';
import { DATE_FORMAT, YEARWEEK_FORMAT } from 'utils/constants';
import { toTimestamp } from 'utils/datetime';
import { DbConnectionManager } from './DbConnectionManager';

const TABLE_PROGRESS = 'progress';
const TABLE_GOALS = 'goals';

const UTC_OFFSET = '+00:00';

export interface GetProgressHistoryParams {
  languageId: LanguageId;
  type: ProgressType;
  cadence: ProgressCadence;
  from: DateTime;
  until: DateTime;
  timezoneOffset: string;
}

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

  async getProgressHistory({
    languageId,
    type,
    cadence,
    from,
    until,
    timezoneOffset,
  }: GetProgressHistoryParams): Promise<Progress[]> {
    const isDailyCadence = cadence === ProgressCadence.Daily;

    const connection = this.connectionManager.getConnection();
    const cadenceStart = connection.raw(
      isDailyCadence
        ? 'date(convert_tz(date, ?, ?))'
        : 'yearweek(convert_tz(date, ?, ?), 3)',
      [UTC_OFFSET, timezoneOffset],
    );
    const fromFormatted = from.toFormat(
      isDailyCadence ? DATE_FORMAT : YEARWEEK_FORMAT,
    );
    const untilFormatted = until.toFormat(
      isDailyCadence ? DATE_FORMAT : YEARWEEK_FORMAT,
    );

    const countsByCadence = await connection(TABLE_PROGRESS)
      .select({
        cadence_start: cadenceStart,
        points: connection.raw('count(id)'),
      })
      .where({
        language_id: languageId,
        type,
      })
      .andWhere(cadenceStart, '>=', fromFormatted)
      .andWhere(cadenceStart, '<', untilFormatted)
      .groupBy('cadence_start')
      .orderBy('cadence_start');

    return countsByCadence.map(({ cadence_start: cadenceStart, points }) => ({
      type,
      cadence,
      date: isDailyCadence
        ? DateTime.fromFormat(cadenceStart, DATE_FORMAT)
        : DateTime.fromObject({
            weekYear: Number(String(cadenceStart).slice(0, 4)),
            weekNumber: Number(String(cadenceStart).slice(4)),
          }),
      points,
    }));
  }

  async saveProgress(
    languageId: LanguageId,
    progress: ProgressInstance | ProgressInstance[],
  ): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROGRESS)
      .insert(
        (Array.isArray(progress) ? progress : [progress]).map((p) => ({
          language_id: languageId,
          id: p.id,
          date: toTimestamp(p.date),
          type: p.type,
        })),
      )
      .onConflict()
      .merge();
  }

  async deleteProgress(id: ProgressId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROGRESS)
      .where({
        id,
      })
      .delete();
  }

  async deleteProgressByType(
    languageId: LanguageId,
    type: ProgressType,
  ): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_PROGRESS)
      .where({
        language_id: languageId,
        type,
      })
      .delete();
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
