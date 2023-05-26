import { Flavor } from 'utils/flavor';

export type LanguageId = Flavor<string, 'Language'>;

export interface Language {
  id: LanguageId;
  name: string;
}
