export interface Page<T> {
  items: T[];
  hasMore: boolean;
}

export interface PageArgs {
  start?: number;
  limit?: number;
}

export function emptyPage<T>(): Page<T> {
  return {
    items: [],
    hasMore: false,
  };
}

export function toPage<T>(items: T[], limit: number): Page<T> {
  return {
    items: items.length > limit ? items.slice(0, items.length - 1) : items,
    hasMore: items.length > limit,
  };
}

export function mapPage<T, S>(page: Page<T>, mapping: (item: T) => S): Page<S> {
  return {
    items: page.items.map(mapping),
    hasMore: page.hasMore,
  };
}
