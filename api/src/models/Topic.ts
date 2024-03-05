import { Flavor } from 'utils/flavor';
import { LanguageId } from './Language';
import { Static, Type } from '@sinclair/typebox';
import { StartCursor } from './Page';
import { DATETIME_FORMAT_REGEX } from 'utils/constants';

export type TopicId = Flavor<string, 'Topic'>;

export interface Topic {
  id: TopicId;
  name: string;
  languageId: LanguageId;
}

export type TopicSortedCursor = Static<typeof TopicSortedCursor>;
export const TopicSortedCursor = Type.Object({
  addedAt: Type.RegExp(DATETIME_FORMAT_REGEX),
  id: Type.String(),
});

export type TopicCursor = TopicSortedCursor | StartCursor;
export const TopicCursor = Type.Union([TopicSortedCursor, StartCursor]);
