import { DateTime } from 'luxon';
import { Flavor } from 'utils/flavor';
import { UserId } from './User';

export type LanguageId = Flavor<string, 'Language'>;

export interface Language {
  id: LanguageId;
  userId: UserId;
  name: string;
  addedAt: DateTime;
}

export interface LanguageUpdate {
  id: LanguageId;
  name: string;
}
