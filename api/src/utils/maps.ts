export function groupByKeyAndMap<K, V1, V2>(
    items: V1[],
    getKey: (item: V1) => K,
    map: (item: V1) => V2,
): Map<K, V2[]> {
    const grouped = new Map<K, V2[]>();
    for (const item of items) {
        const key = getKey(item);

        let group = grouped.get(key);
        if (!group) {
            group = [];
            grouped.set(key, group);
        }

        group.push(map(item));
    }

    return grouped;
}
