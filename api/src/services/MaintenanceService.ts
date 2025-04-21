import { Injectable } from '@nestjs/common';
import { SearchClient } from 'clients/SearchClient';
import {
  GoalTable,
  LanguageTable,
  ProgressTable,
  PropertyTable,
  UserTable,
  WordTable,
} from 'knex/types/tables';
import { Context } from 'models/Context';
import { Language, LanguageId } from 'models/Language';
import {
  MigrationRecord,
  MigrationRecordType,
  MigrationRecordTypes,
} from 'models/Migration';
import { PropertyType } from 'models/Property';
import { User, UserId } from 'models/User';
import { PartOfSpeech } from 'models/Word';
import { ChangeRepository } from 'repositories/ChangeRepository';
import { DbConnectionManager } from 'repositories/DbConnectionManager';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { ProgressRepository } from 'repositories/ProgressRepository';
import { PropertyRepository } from 'repositories/PropertyRepository';
import { UserRepository } from 'repositories/UserRepository';
import { WordRepository } from 'repositories/WordRepository';
import { Readable } from 'stream';
import * as etPreset from '../utils/presets/et';
import { LanguageService } from './LanguageService';
import { ProgressService } from './ProgressService';
import { PropertyService } from './PropertyService';
import { CreateUserParams, UserService } from './UserService';
import { WordService } from './WordService';

const RECORDS_BATCH = 1000;

@Injectable()
export class MaintenanceService {
  constructor(
    private userService: UserService,
    private wordService: WordService,
    private progressService: ProgressService,
    private propertyService: PropertyService,
    private languageService: LanguageService,

    private userRepository: UserRepository,
    private languageRepository: LanguageRepository,
    private propertyRepository: PropertyRepository,
    private wordRepository: WordRepository,
    private progressRepository: ProgressRepository,
    private changeRepository: ChangeRepository,

    private searchClient: SearchClient,
    private dbConnectionManager: DbConnectionManager,
  ) {}

  export(): Readable {
    return Readable.from(this.exportRecords(), { objectMode: true });
  }

  async import(recordStream: Readable): Promise<void> {
    await this.insertRecords(recordStream);

    const languages = await Array.fromAsync(
      this.languageRepository.streamRecords(),
    );
    await Promise.all(
      languages.map((language) => this.resyncProgress(language.id)),
    );

    await this.searchClient.createIndices();
    await Promise.all(
      languages.map((language) => this.reindexLanguage(language.id)),
    );
  }

  async destroy(): Promise<void> {
    await this.progressRepository.deleteAll();
    await this.wordRepository.deleteAll();
    await this.propertyRepository.deleteAll();
    await this.languageRepository.deleteAll();
    await this.changeRepository.deleteAll();
    await this.userRepository.deleteAll();
    await this.userRepository.deleteAllSettings();
    await this.searchClient.deleteIndices();
  }

  async createUser(params: CreateUserParams): Promise<User> {
    return await this.userService.create(params);
  }

  async deleteUser(id: UserId): Promise<User> {
    return await this.userService.delete(id);
  }

  async reindexLanguage(languageId: LanguageId): Promise<Language> {
    const language = await this.languageRepository.getById(languageId);
    if (!language) {
      throw new Error('Language does not exist');
    }

    await this.wordService.indexLanguage(languageId);

    return language;
  }

  async resyncProgress(languageId: LanguageId): Promise<void> {
    await this.progressService.syncAllWordsProgress(languageId);
  }

  async initEstonian(ctx: Context, userId: UserId): Promise<void> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }

    ctx.user = user;
    await this.dbConnectionManager.transactionally(async () => {
      const language = await this.languageService.create(ctx, {
        name: etPreset.name,
      });
      for (const [partOfSpeech, properties] of Object.entries(
        etPreset.properties,
      )) {
        for (const propertyName of properties) {
          await this.propertyService.create(ctx, {
            languageId: language.id,
            name: propertyName,
            partOfSpeech: partOfSpeech as PartOfSpeech,
            type: PropertyType.Text,
          });
        }
      }
    });
  }

  private async *exportRecords(): AsyncGenerator<MigrationRecord> {
    for await (const user of this.userRepository.streamRecords()) {
      yield { type: MigrationRecordType.User, record: user };
    }

    for await (const language of this.languageRepository.streamRecords()) {
      yield { type: MigrationRecordType.Language, record: language };
    }

    for await (const property of this.propertyRepository.streamRecords()) {
      yield { type: MigrationRecordType.Property, record: property };
    }

    for await (const word of this.wordRepository.streamRecords()) {
      yield { type: MigrationRecordType.Word, record: word };
    }

    for await (const goal of this.progressRepository.streamGoals()) {
      yield { type: MigrationRecordType.Goal, record: goal };
    }

    for await (const progress of this.progressRepository.streamRecords()) {
      yield { type: MigrationRecordType.Progress, record: progress };
    }
  }

  private async insertRecords(recordStream: Readable) {
    const recordBatches = this.batchRecords(recordStream);
    for await (const [type, records] of recordBatches) {
      switch (type) {
        case MigrationRecordType.User:
          await this.userRepository.insertBatch(
            records.map(({ record }) => record) as UserTable[],
          );
          break;

        case MigrationRecordType.Language:
          await this.languageRepository.insertBatch(
            records.map(({ record }) => record) as LanguageTable[],
          );
          break;

        case MigrationRecordType.Property:
          await this.propertyRepository.insertBatch(
            records.map(({ record }) => record) as PropertyTable[],
          );
          break;

        case MigrationRecordType.Word:
          await this.wordRepository.insertBatch(
            records.map(({ record }) => record) as WordTable[],
          );
          break;

        case MigrationRecordType.Goal:
          await this.progressRepository.insertGoals(
            records.map(({ record }) => record) as GoalTable[],
          );
          break;

        case MigrationRecordType.Progress:
          await this.progressRepository.insertBatch(
            records.map(({ record }) => record) as ProgressTable[],
          );
          break;
      }
    }
  }

  private async *batchRecords(
    recordStream: Readable,
  ): AsyncGenerator<[MigrationRecordType, MigrationRecord[]]> {
    let batch: MigrationRecord[] = [];
    const types = MigrationRecordTypes[Symbol.iterator]();
    let type: MigrationRecordType = types.next().value;
    for await (const { value } of recordStream) {
      const record = value as MigrationRecord;
      if (record.type !== type) {
        if (batch.length) {
          yield [type, batch];
        }

        batch = [];
        type = types.next().value;
      } else {
        batch.push(record);

        if (batch.length === RECORDS_BATCH) {
          yield [type, batch];
          batch = [];
        }
      }
    }
    if (batch.length) {
      yield [type, batch];
    }
  }
}
