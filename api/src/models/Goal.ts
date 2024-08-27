import { LanguageId } from './Language';
import { ProgressCadence, ProgressType } from './Progress';

export interface Goal {
  type: ProgressType;
  cadence: ProgressCadence;
  points: number;
  languageId: LanguageId;
}
