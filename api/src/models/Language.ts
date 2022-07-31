import { Flavor } from 'src/utils/flavor';

export type LanguageId = Flavor<string, 'Language'>;

export interface Language {
    id: LanguageId;
    name: string;
}
