import { Injectable } from '@nestjs/common';
import { UserId, UserSettings } from 'models/User';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_USER_SETTINGS = 'user_settings';

@Injectable()
export class UserRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getSettings(userId: UserId): Promise<UserSettings> {
    const connection = this.connectionManager.getConnection();
    const result = await connection(TABLE_USER_SETTINGS)
      .select('settings')
      .where({ user_id: userId })
      .first();

    return result ? this.serializer.deserialize(result.settings) : {};
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
}
