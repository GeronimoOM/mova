import { LanguageTable, PropertyTable, WordTable } from 'knex/types/tables';

export enum MigrationRecordType {
  Language = 'l',
  Property = 'p',
  Word = 'w',
}

export const MigrationRecordTypes = [
  MigrationRecordType.Language,
  MigrationRecordType.Property,
  MigrationRecordType.Word,
];

export type MigrationRecord =
  | MigrationLanguageRecord
  | MigrationPropertyRecord
  | MigrationWordRecord;

export type MigrationLanguageRecord = {
  type: MigrationRecordType.Language;
  record: LanguageTable;
};

export type MigrationPropertyRecord = {
  type: MigrationRecordType.Property;
  record: PropertyTable;
};

export type MigrationWordRecord = {
  type: MigrationRecordType.Word;
  record: WordTable;
};
