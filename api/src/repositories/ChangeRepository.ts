import { Injectable } from '@nestjs/common';
import { ChangeTable } from 'knex/types/tables';
import { DateTime } from 'luxon';
import {
  BaseChange,
  Change,
  ChangeCursor,
  ChangePage,
  ChangeType,
  SyncType,
} from 'models/Change';
import { mapPage, toPage } from 'models/Page';
import { UserId } from 'models/User';
import { fromTimestamp, toTimestamp } from 'utils/datetime';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_CHANGES = 'changes';

export interface GetChangePageParams {
  userId: UserId;
  changedAt?: DateTime;
  cursor?: ChangeCursor;
  limit?: number;
  excludeClientId?: string;
}

@Injectable()
export class ChangeRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getPage({
    userId,
    changedAt,
    cursor,
    limit,
    excludeClientId,
  }: GetChangePageParams): Promise<ChangePage> {
    const connection = this.connectionManager.getConnection();
    const changedAtValue = cursor ? cursor.changedAt : toTimestamp(changedAt);
    const query = connection(TABLE_CHANGES)
      .limit(limit + 1)
      .where({ user_id: userId })
      .orderBy([
        { column: 'changed_at', order: 'asc' },
        { column: 'id', order: 'asc' },
      ]);
    if (changedAtValue) {
      if (cursor?.id) {
        query
          .where('changed_at', '>=', changedAtValue)
          .andWhere((query) =>
            query
              .where('id', '>', cursor.id)
              .orWhere('changed_at', '>', changedAtValue),
          );
      } else {
        query.where('changed_at', '>', changedAtValue);
      }
    }

    if (excludeClientId) {
      query.whereNot('client_id', excludeClientId);
    }

    const changeRows = await query;

    const toNextCursor = (change: ChangeTable) => ({
      changedAt: change.changed_at,
      id: change.id,
    });

    const changePage = mapPage(
      toPage(changeRows, limit, toNextCursor),
      (changeRow) => this.mapToChange(changeRow),
    );
    return {
      ...changePage,
      syncType: SyncType.Delta,
    };
  }

  async getOldestChangedAt(userId: UserId): Promise<DateTime | null> {
    const change: ChangeTable | null = await this.connectionManager
      .getConnection()(TABLE_CHANGES)
      .where({ user_id: userId })
      .limit(1)
      .orderBy('changed_at', 'asc')
      .first();

    return change ? fromTimestamp(change.changed_at) : null;
  }

  async create(change: Change): Promise<void> {
    const changeRow: ChangeTable = {
      id: change.id,
      changed_at: toTimestamp(change.changedAt),
      type: change.type,
      ...(change.clientId && { client_id: change.clientId }),
      data: this.mapDataFromChange(change),
      user_id: change.userId,
    };

    await this.connectionManager
      .getConnection()(TABLE_CHANGES)
      .insert(changeRow);
  }

  async deleteOlder(changeAt: DateTime): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_CHANGES)
      .where('changed_at', '<', toTimestamp(changeAt))
      .delete();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_CHANGES).delete();
  }

  private mapToChange(row: ChangeTable): Change {
    const baseChange: BaseChange = {
      id: row.id,
      changedAt: fromTimestamp(row.changed_at),
      type: row.type as ChangeType,
      clientId: row.client_id,
      userId: row.user_id,
    };

    const data = this.serializer.deserialize<Change>(row.data);
    return { ...baseChange, ...data };
  }

  private mapDataFromChange(change: Change): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, changedAt, type, clientId, ...changeData } = change;

    return this.serializer.serialize(changeData);
  }
}
