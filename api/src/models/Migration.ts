import {
  GoalTable,
  LanguageTable,
  ProgressTable,
  PropertyTable,
  WordTable,
} from 'knex/types/tables';

export enum MigrationRecordType {
  Language = 'l',
  Property = 'p',
  Word = 'w',
  Goal = 'g',
  Progress = 'r',
}

export const MigrationRecordTypes = [
  MigrationRecordType.Language,
  MigrationRecordType.Property,
  MigrationRecordType.Word,
  MigrationRecordType.Goal,
  MigrationRecordType.Progress,
];

export type MigrationRecord =
  | MigrationLanguageRecord
  | MigrationPropertyRecord
  | MigrationWordRecord
  | MigrationGoalRecord
  | MigrationProgressRecord;

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

export type MigrationGoalRecord = {
  type: MigrationRecordType.Goal;
  record: GoalTable;
};

export type MigrationProgressRecord = {
  type: MigrationRecordType.Progress;
  record: ProgressTable;
};
