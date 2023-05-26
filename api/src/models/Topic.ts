import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';

export type TopicId = Flavor<string, 'Topic'>;

export interface Topic {
  id: TopicId;
  name: string;
  languageId: LanguageId;
}
