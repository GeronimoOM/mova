import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';

export type UserId = Flavor<string, 'User'>;

export interface User {
  id: UserId;
  name: string;
  password: string;
  isAdmin?: boolean;
}

export interface UserAuth {
  userId: UserId;
}

export interface UserSettings {
  selectedLanguageId?: LanguageId;
  selectedLocale?: string;
  selectedFont?: string;
  includeMastered?: boolean;
}
