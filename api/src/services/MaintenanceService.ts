import { Injectable } from '@nestjs/common';
import { SearchClient } from 'clients/SearchClient';
import {
  GoalTable,
  LanguageTable,
  ProgressTable,
  PropertyTable,
  WordTable,
} from 'knex/types/tables';
import { Language, LanguageId } from 'models/Language';
import {
  MigrationRecord,
  MigrationRecordType,
  MigrationRecordTypes,
} from 'models/Migration';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { ProgressRepository } from 'repositories/ProgressRepository';
import { PropertyRepository } from 'repositories/PropertyRepository';
import { WordRepository } from 'repositories/WordRepository';
import { Readable } from 'stream';
import { LanguageService } from './LanguageService';
import { ProgressService } from './ProgressService';
import { WordService } from './WordService';

const RECORDS_BATCH = 1000;

@Injectable()
export class MaintenanceService {
  constructor(
    private languageService: LanguageService,
    private wordService: WordService,
    private progressService: ProgressService,

    private languageRepository: LanguageRepository,
    private propertyRepository: PropertyRepository,
    private wordRepository: WordRepository,
    private progressRepository: ProgressRepository,

    private searchClient: SearchClient,
  ) {}

  export(): Readable {
    return Readable.from(this.exportRecords(), { objectMode: true });
  }

  async import(recordStream: Readable): Promise<void> {
    await this.insertRecords(recordStream);

    const languages = await this.languageService.getAll();
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
    await this.searchClient.deleteIndices();
  }

  async reindexLanguage(languageId: LanguageId): Promise<Language> {
    const language = await this.languageService.getById(languageId);

    await this.wordService.indexLanguage(languageId);

    return language;
  }

  async resyncProgress(languageId: LanguageId): Promise<void> {
    await this.progressService.syncAllWordsProgress(languageId);
  }

  private async *exportRecords(): AsyncGenerator<MigrationRecord> {
    for await (const language of this.languageRepository.streamRecords()) {
      yield { type: MigrationRecordType.Language, record: language };
    }

    for await (const property of this.propertyRepository.streamRecords()) {
      yield { type: MigrationRecordType.Property, record: property };
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
        yield [type, batch];
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
