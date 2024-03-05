import { Static, Type } from '@sinclair/typebox';
import { encodeCursor } from 'utils/cursors';

export interface Page<T, C> {
  items: T[];
  nextCursor?: C;
}

export enum Direction {
  Asc = 'asc',
  Desc = 'desc',
}

export type StartCursor = Static<typeof StartCursor>;
export const StartCursor = Type.Object({
  start: Type.Integer({ exclusiveMinimum: 0 }),
});

export function emptyPage<T, C>(): Page<T, C> {
  return {
    items: [],
  };
}

export function toPage<T, C>(
  items: T[],
  limit: number,
  toNextCursor: (item: T) => C,
): Page<T, C> {
  let hasMore = false;
  if (items.length > limit) {
    items = items.slice(0, items.length - 1);
    hasMore = true;
  }

  return {
    items,
    ...(hasMore && {
      nextCursor: toNextCursor(items[items.length - 1]),
    }),
  };
}

export function mapPage<T, S, C>(
  page: Page<T, C>,
  mapping: (item: T) => S,
): Page<S, C> {
  return {
    items: page.items.map(mapping),
    ...(page.nextCursor && {
      nextCursor: page.nextCursor,
    }),
  };
}

export function encodePageCursor<T, C>(page: Page<T, C>): Page<T, string> {
  return {
    items: page.items,
    ...(page.nextCursor && {
      nextCursor: encodeCursor(page.nextCursor),
    }),
  };
}
