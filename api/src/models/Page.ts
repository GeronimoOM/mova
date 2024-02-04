import { Static, Type } from '@sinclair/typebox';

export interface Page<T> {
  items: T[];
  nextCursor?: string;
}

export interface PageArgs {
  cursor?: string;
  limit?: number;
}

export type StartCursor = Static<typeof StartCursor>;
export const StartCursor = Type.Object({
  start: Type.Integer({ exclusiveMinimum: 0 }),
});

export function emptyPage<T>(): Page<T> {
  return {
    items: [],
  };
}

export function toPage<T>(
  items: T[],
  limit: number,
  toNextCursor: (item: T) => string,
): Page<T> {
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

export function mapPage<T, S>(page: Page<T>, mapping: (item: T) => S): Page<S> {
  return {
    items: page.items.map(mapping),
    ...(page.nextCursor && {
      nextCursor: page.nextCursor,
    }),
  };
}
