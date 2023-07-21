import { Readable } from 'stream';
import { chain } from 'stream-chain';
import { Injectable, Logger } from '@nestjs/common';
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
import { UpdatePropertyValueParams, WordService } from './WordService';
import { TopicService } from './TopicService';
import { PropertyType, PropertyId, OptionProperty } from 'models/Property';
import { PartOfSpeech } from 'models/Word';
import { PropertyService } from './PropertyService';

const RECORDS_BATCH = 1000;

@Injectable()
export class MaintenanceService {
  constructor(
    private languageService: LanguageService,
    private propertyService: PropertyService,
    private wordService: WordService,
    private topicService: TopicService,

    private languageRepository: LanguageRepository,
    private propertyRepository: PropertyRepository,
    private topicRepository: TopicRepository,
    private wordRepository: WordRepository,
  ) {}

  export(): Readable {
    return Readable.from(this.exportRecords(), { objectMode: true });
  }

  async import(recordStream: Readable): Promise<void> {
    await this.insertRecords(recordStream);

    const languages = await this.languageService.getAll();
    await Promise.all(
      languages.map((language) => this.reindexLanguage(language.id)),
    );
  }

  async reindexLanguage(languageId: LanguageId): Promise<Language> {
    const language = await this.languageService.getById(languageId);

    await Promise.all([
      this.wordService.indexLanguage(languageId),
      this.topicService.indexLanguage(languageId),
    ]);

    return language;
  }

  async generateLanguage(name: string): Promise<Language> {
    const language = await this.languageService.create({ name });
    await this.generateLanguageData(language);

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
    let types = MigrationRecordTypes[Symbol.iterator]();
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

  private async generateLanguageData(language: Language): Promise<void> {
    const [nounTextProp, nounOptionProp, adjTextProp] = await Promise.all([
      this.propertyService.create({
        name: `Noun Text Property (${name})`,
        type: PropertyType.Text,
        partOfSpeech: PartOfSpeech.Noun,
        languageId: language.id,
      }),
      this.propertyService.create({
        name: `Noun Option Property (${name})`,
        type: PropertyType.Option,
        partOfSpeech: PartOfSpeech.Noun,
        languageId: language.id,
        options: ['Red', 'Blue', 'Green'],
      }),
      this.propertyService.create({
        name: `Adjective Text Property (${name})`,
        type: PropertyType.Text,
        partOfSpeech: PartOfSpeech.Adj,
        languageId: language.id,
      }),
    ]);

    await Promise.all(
      Object.values(PartOfSpeech).flatMap((pos) =>
        Array.from(Array(5).keys()).map((i) =>
          this.propertyService.create({
            name: `${pos} property ${i + 1}`,
            type: PropertyType.Text,
            partOfSpeech: pos,
            languageId: language.id,
          }),
        ),
      ),
    );

    const [animals, sports] = await Promise.all([
      this.topicService.create({
        name: 'Animals',
        languageId: language.id,
      }),
      this.topicService.create({
        name: 'Sports',
        languageId: language.id,
      }),
    ]);

    const [dog, swim, run] = await Promise.all([
      this.wordService.create({
        original: `koer (${name})`,
        translation: 'dog',
        partOfSpeech: PartOfSpeech.Noun,
        languageId: language.id,
        properties: new Map<PropertyId, UpdatePropertyValueParams>([
          [
            nounTextProp.id,
            {
              text: 'koera',
            },
          ],
          [
            nounOptionProp.id,
            {
              option: (nounOptionProp as OptionProperty).options.keys().next()
                .value,
            },
          ],
        ]),
      }),

      this.wordService.create({
        original: `ujuma (${name})`,
        translation: 'to swim',
        partOfSpeech: PartOfSpeech.Verb,
        languageId: language.id,
      }),

      this.wordService.create({
        original: `jooskma (${name})`,
        translation: 'to run',
        partOfSpeech: PartOfSpeech.Verb,
        languageId: language.id,
      }),

      this.wordService.create({
        original: `väike (${name})`,
        translation: 'small',
        partOfSpeech: PartOfSpeech.Adj,
        languageId: language.id,
        properties: new Map<PropertyId, UpdatePropertyValueParams>([
          [
            adjTextProp.id,
            {
              text: 'väikse',
            },
          ],
        ]),
      }),

      this.wordService.create({
        original: `suur (${name})`,
        translation: 'big',
        partOfSpeech: PartOfSpeech.Adj,
        languageId: language.id,
      }),

      this.wordService.create({
        original: `isegi (${name})`,
        translation: 'even',
        partOfSpeech: PartOfSpeech.Misc,
        languageId: language.id,
      }),
    ]);

    await Promise.all(
      Array.from(Array(30).keys()).map((i) =>
        this.wordService.create({
          original: `word ${i + 1}`,
          translation: `translation ${i + 1}`,
          partOfSpeech: PartOfSpeech.Noun,
          languageId: language.id,
        }),
      ),
    );

    await Promise.all([
      this.topicService.addWord(animals.id, dog.id),
      this.topicService.addWord(sports.id, swim.id),
      this.topicService.addWord(sports.id, run.id),
    ]);
  }
}
