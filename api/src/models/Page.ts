export interface Page<T> {
    items: T[];
    hasMore: boolean;
}

export interface PageArgs {
    start?: number;
    limit?: number;
}

export function mapPage<T, S>(page: Page<T>, mapping: (item: T) => S): Page<S> {
    return {
        items: page.items.map(mapping),
        hasMore: page.hasMore,
    };
}
