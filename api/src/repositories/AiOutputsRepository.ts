import { Injectable } from '@nestjs/common';
import { AiOutputsTable } from 'knex/types/tables';
import { AiOutputKey, AiOutputType } from 'models/AiOutput';
import { DbConnectionManager } from './DbConnectionManager';
import { Serializer } from './Serializer';

const TABLE_AI_OUTPUTS = 'ai_outputs';

@Injectable()
export class AiOutputsRepository {
  constructor(
    private connectionManager: DbConnectionManager,
    private serializer: Serializer,
  ) {}

  async getByKey<T>(key: AiOutputKey): Promise<T | null> {
    const aiOutputRow = await this.connectionManager
      .getConnection()(TABLE_AI_OUTPUTS)
      .where({
        key,
      })
      .first();

    return aiOutputRow ? this.serializer.deserialize(aiOutputRow.data) : null;
  }

  async create<T>(
    key: AiOutputKey,
    type: AiOutputType,
    value: T,
  ): Promise<void> {
    const aiOutput: AiOutputsTable = {
      key,
      type,
      data: this.serializer.serialize(value),
    };

    await this.connectionManager
      .getConnection()(TABLE_AI_OUTPUTS)
      .insert(aiOutput)
      .onConflict()
      .ignore();
  }

  async delete(key: AiOutputKey): Promise<void> {
    await this.connectionManager
      .getConnection()(TABLE_AI_OUTPUTS)
      .where({ key })
      .delete();
  }

  async deleteAll(): Promise<void> {
    await this.connectionManager.getConnection()(TABLE_AI_OUTPUTS).delete();
  }
}
