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
  toCursor: (item: T) => C,
): Page<T, C> {
  let hasMore = false;
  if (items.length > limit) {
    items = items.slice(0, items.length - 1);
    hasMore = true;
  }

  return {
    items,
    ...(hasMore && {
      nextCursor: toCursor(items[items.length - 1]),
    }),
  };
}

export function mapPage<T, S, C>(
  page: Page<T, C>,
  mapping: (item: T) => S,
): Page<S, C> {
  return {
    ...page,
    items: page.items.map(mapping),
  };
}

export function mapCursor<T, C, K>(
  page: Page<T, C>,
  mapping: (cursor: C) => K,
): Page<T, K> {
  return {
    items: page.items,
    ...(page.nextCursor && {
      nextCursor: mapping(page.nextCursor),
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
