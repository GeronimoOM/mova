export function seq(n: number): number[] {
  return Array(n)
    .fill(undefined)
    .map((_, idx) => idx);
}

export function toRecord<T, K extends string>(
  arr: T[],
  getKey: (item: T) => K,
): Record<string, T> {
  return arr.reduce(
    (record, item) => {
      record[getKey(item)] = item;
      return record;
    },
    {} as Record<string, T>,
  );
}
