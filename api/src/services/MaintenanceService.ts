import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import {
  MigrationRecordType,
  MigrationRecord,
  MigrationRecordTypes,
} from 'models/Migration';
import { LanguageRepository } from 'repositories/LanguageRepository';
import { PropertyRepository } from 'repositories/PropertyRepository';
import { TopicRepository } from 'repositories/TopicRepository';
import { WordRepository } from 'repositories/WordRepository';
import {
  LanguageTable,
  PropertyTable,
  TopicTable,
  TopicWordTable,
  WordTable,
} from 'knex/types/tables';
import { Language, LanguageId } from 'models/Language';
import { LanguageService } from './LanguageService';
import { WordService } from './WordService';
import { TopicService } from './TopicService';
import { SearchClient } from 'clients/SearchClient';

const RECORDS_BATCH = 1000;

@Injectable()
export class MaintenanceService {
  constructor(
    private languageService: LanguageService,
    private wordService: WordService,
    private topicService: TopicService,

    private languageRepository: LanguageRepository,
    private propertyRepository: PropertyRepository,
    private topicRepository: TopicRepository,
    private wordRepository: WordRepository,

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
    await this.topicRepository.deleteAll();
    await this.wordRepository.deleteAll();
    await this.propertyRepository.deleteAll();
    await this.languageRepository.deleteAll();
    await this.searchClient.deleteIndices();
  }

  async reindexLanguage(languageId: LanguageId): Promise<Language> {
    const language = await this.languageService.getById(languageId);

    await Promise.all([
      this.wordService.indexLanguage(languageId),
      this.topicService.indexLanguage(languageId),
    ]);

    return language;
  }

  private async *exportRecords(): AsyncGenerator<MigrationRecord> {
    for await (const language of this.languageRepository.streamRecords()) {
      yield { type: MigrationRecordType.Language, record: language };
    }

    for await (const property of this.propertyRepository.streamRecords()) {
      yield { type: MigrationRecordType.Property, record: property };
    }

    for await (const topic of this.topicRepository.streamRecords()) {
      yield { type: MigrationRecordType.Topic, record: topic };
    }

    for await (const word of this.wordRepository.streamRecords()) {
      yield { type: MigrationRecordType.Word, record: word };
    }

    for await (const topicWord of this.topicRepository.streamWordRecords()) {
      yield { type: MigrationRecordType.TopicWord, record: topicWord };
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

        case MigrationRecordType.Topic:
          await this.topicRepository.insertBatch(
            records.map(({ record }) => record) as TopicTable[],
          );
          break;

        case MigrationRecordType.Word:
          await this.wordRepository.insertBatch(
            records.map(({ record }) => record) as WordTable[],
          );
          break;

        case MigrationRecordType.TopicWord:
          await this.topicRepository.insertWordsBatch(
            records.map(({ record }) => record) as TopicWordTable[],
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
