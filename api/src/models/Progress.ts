import { DateTime } from 'luxon';
import { Flavor } from 'utils/flavor';
import { WordId } from './Word';

export type ProgressId = Flavor<string, 'Progress'> | WordId;

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

export interface ProgressInstance {
  id: ProgressId;
  date: DateTime;
  type: ProgressType;
}

export interface ProgressHistory {
  cadence: ProgressCadence;
  from: DateTime;
  until: DateTime;
  instances: Progress[];
}

export enum ProgressCadence {
  Daily = 'daily',
  Weekly = 'weekly',
}
