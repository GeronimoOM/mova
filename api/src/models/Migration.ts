import {
  GoalTable,
  LanguageTable,
  ProgressTable,
  PropertyTable,
  UserTable,
  WordTable,
} from 'knex/types/tables';

export enum MigrationRecordType {
  Language = 'l',
  Property = 'p',
  Word = 'w',
  Goal = 'g',
  Progress = 'r',
  User = 'u',
}

export const MigrationRecordTypes = [
  MigrationRecordType.Language,
  MigrationRecordType.Property,
  MigrationRecordType.Word,
  MigrationRecordType.Goal,
  MigrationRecordType.Progress,
  MigrationRecordType.User,
];

export type MigrationRecord =
  | MigrationLanguageRecord
  | MigrationPropertyRecord
  | MigrationWordRecord
  | MigrationGoalRecord
  | MigrationProgressRecord
  | MigrationUserRecord;

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

export type MigrationUserRecord = {
  type: MigrationRecordType.User;
  record: UserTable;
};
