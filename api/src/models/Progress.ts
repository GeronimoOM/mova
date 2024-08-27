import { DateTime } from 'luxon';

export enum ProgressType {
  Mastery = 'mastery',
  Words = 'words',
}

export const ProgressTypes = [
  ProgressType.Words,
  ProgressType.Mastery,
] as const;

export interface Progress {
  date: DateTime;
  type: ProgressType;
  cadence: ProgressCadence;
  points: number;
}

export enum ProgressCadence {
  Daily = 'daily',
  Weekly = 'weekly',
}
