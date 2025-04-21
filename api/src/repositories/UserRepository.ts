import { Injectable } from '@nestjs/common';
import { UserTable } from 'knex/types/tables';
import { User, UserId, UserSettings } from 'models/User';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_USERS = 'users';
const TABLE_USER_SETTINGS = 'user_settings';

@Injectable()
export class UserRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getById(id: UserId): Promise<User | null> {
    const userRow = await this.connectionManager
      .getConnection()(TABLE_USERS)
      .where({
        id,
      })
      .first();

    return userRow ? this.mapToUser(userRow) : null;
  }

  async getByName(name: string): Promise<User | null> {
    const userRow = await this.connectionManager
      .getConnection()(TABLE_USERS)
      .where({
        name,
      })
      .first();

    return userRow ? this.mapToUser(userRow) : null;
  }

  async create(user: User): Promise<void> {
    const userRow: UserTable = {
      id: user.id,
      name: user.name,
      password: user.password,
    };

    await this.connectionManager
      .getConnection()(TABLE_USERS)
      .insert(userRow)
      .onConflict()
      .ignore();
  }

  async delete(id: UserId): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_USERS)
      .where({ id })
      .delete();
  }

  streamRecords(): AsyncIterable<UserTable> {
    return this.connectionManager.getConnection()(TABLE_USERS).stream();
  }

  async insertBatch(batch: UserTable[]): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_USERS)
      .insert(batch)
      .onConflict()
      .merge();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_USERS).delete();
  }

  async getSettings(userId: UserId): Promise<UserSettings> {
    const connection = this.connectionManager.getConnection();
    const result = await connection(TABLE_USER_SETTINGS)
      .select('settings')
      .where({ user_id: userId })
      .first();

    return result?.settings ? this.serializer.deserialize(result.settings) : {};
  }

  async updateSettings(
    userId: UserId,
    settings: Partial<UserSettings>,
  ): Promise<void> {
    const connection = this.connectionManager.getConnection();

    const updateValues: string[] = [];
    for (const [key, value] of Object.entries(settings)) {
      updateValues.push(`'$.${key}', ${this.serializer.serialize(value)}`);
    }

    await connection(TABLE_USER_SETTINGS)
      .insert({
        user_id: userId,
        settings: connection.raw(`json_set('{}', ${updateValues.join(', ')})`),
      })
      .onConflict()
      .merge({
        settings: connection.raw(
          `json_set(settings, ${updateValues.join(', ')})`,
        ),
      });
  }

  async deleteAllSettings(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_USER_SETTINGS).delete();
  }

  private mapToUser(row: UserTable): User {
    return {
      id: row.id,
      name: row.name,
      password: row.password,
    };
  }
}
