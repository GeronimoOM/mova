import { DateTime } from 'luxon';
import { LanguageId } from './Language';

export enum ProgressType {
  Mastery = 'mastery',
  Words = 'words',
}

export const ProgressTypes = [
  ProgressType.Mastery,
  ProgressType.Words,
] as const;

export interface Progress {
  date: DateTime;
  type: ProgressType;
  points: number;
  languageId: LanguageId;
}

export enum ProgressCadence {
  Daily = 'daily',
  Weekly = 'weekly',
}

export interface Goal {
  type: ProgressType;
  cadence: ProgressCadence;
  points: number;
  languageId: LanguageId;
}
