import {
  LanguageTable,
  PropertyTable,
  TopicTable,
  TopicWordTable,
  WordTable,
} from 'knex/types/tables';

export enum MigrationRecordType {
  Language = 'l',
  Property = 'p',
  Topic = 't',
  Word = 'w',
  TopicWord = 'tw',
}

export const MigrationRecordTypes = [
  MigrationRecordType.Language,
  MigrationRecordType.Property,
  MigrationRecordType.Topic,
  MigrationRecordType.Word,
  MigrationRecordType.TopicWord,
];

export type MigrationRecord =
  | MigrationLanguageRecord
  | MigrationPropertyRecord
  | MigrationTopicRecord
  | MigrationWordRecord
  | MigrationTopicWordRecord;

export type MigrationLanguageRecord = {
  type: MigrationRecordType.Language;
  record: LanguageTable;
};

export type MigrationPropertyRecord = {
  type: MigrationRecordType.Property;
  record: PropertyTable;
};

export type MigrationTopicRecord = {
  type: MigrationRecordType.Topic;
  record: TopicTable;
};

export type MigrationWordRecord = {
  type: MigrationRecordType.Word;
  record: WordTable;
};

export type MigrationTopicWordRecord = {
  type: MigrationRecordType.TopicWord;
  record: TopicWordTable;
};
