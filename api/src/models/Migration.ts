import {
  GoalTable,
  LanguageTable,
  ProgressTable,
  PropertyTable,
  UserTable,
  WordLinkTable,
  WordTable,
} from 'knex/types/tables';

export enum MigrationRecordType {
  User = 'u',
  Language = 'l',
  Property = 'p',
  Word = 'w',
  Goal = 'g',
  Progress = 'r',
  WordLink = 'wl',
}

export type MigrationRecord =
  | MigrationLanguageRecord
  | MigrationPropertyRecord
  | MigrationWordRecord
  | MigrationGoalRecord
  | MigrationProgressRecord
  | MigrationUserRecord
  | MigrationWordLinkRecord;

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

export type MigrationWordLinkRecord = {
  type: MigrationRecordType.WordLink;
  record: WordLinkTable;
};
