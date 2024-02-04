import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';
import { Static, Type } from '@sinclair/typebox';

export type TopicId = Flavor<string, 'Topic'>;

export interface Topic {
  id: TopicId;
  name: string;
  languageId: LanguageId;
}

export type TopicSortedCursor = Static<typeof TopicSortedCursor>;
export const TopicSortedCursor = Type.Object({
  added_at: Type.Integer({ exclusiveMinimum: 0 }),
});
