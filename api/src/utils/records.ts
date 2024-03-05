export function byKey<K extends string | number, V>(
  items: V[],
  getKey: (item: V) => K,
): Record<K, V> {
  return Object.fromEntries(
    items.map((item) => [getKey(item), item]),
  ) as Record<K, V>;
}

export function groupByKeyAndMap<K extends string | number, V1, V2>(
  items: V1[],
  getKey: (item: V1) => K,
  map: (item: V1) => V2,
): Record<K, V2[]> {
  const grouped = {} as Record<K, V2[]>;
  for (const item of items) {
    const key = getKey(item);

    let group = grouped[key];
    if (!group) {
      group = [];
      grouped[key] = group;
    }

    group.push(map(item));
  }

  return grouped;
}

export function mapValues<K extends string | number, V1, V2>(
  record: Record<K, V1>,
  mapFn: (value: V1) => V2,
): Record<K, V2> {
  return Object.fromEntries(
    Object.entries<V1>(record).map(([k, v]) => [k, mapFn(v)]),
  ) as Record<K, V2>;
}

export type RecordDiff<K extends string | number, V> = {
  added: Record<K, V>;
  updated: Record<K, V>;
  deleted: Record<K, V>;
};

export function diff<K extends string | number, V>(
  target: Record<K, V> | null,
  source: Record<K, V> | null,
  areValuesEqual: (value1: V, value2: V) => boolean = (v1, v2) => v1 === v2,
): RecordDiff<K, V> | null {
  const diff = {
    added: {},
    updated: {},
    deleted: {},
  } as RecordDiff<K, V>;

  for (const [key, value] of Object.entries<V>(source ?? {})) {
    if (!target || !(key in target)) {
      diff.deleted[key] = value;
    }
  }

  for (const [key, value] of Object.entries<V>(target ?? {})) {
    if (!source || !(key in source)) {
      diff.added[key] = value;
    } else if (!areValuesEqual(value, source[key])) {
      diff.updated[key] = value;
    }
  }

  return isDiffEmpty(diff) ? null : diff;
}

function isDiffEmpty<K extends string | number, V>(
  diff: RecordDiff<K, V>,
): boolean {
  return (
    !Object.keys(diff.added).length &&
    !Object.keys(diff.updated).length &&
    !Object.keys(diff.deleted).length
  );
}
