export function seq(n: number): number[] {
  return Array(n)
    .fill(undefined)
    .map((_, idx) => idx);
}

export function toRecord<T, K extends string>(
  arr: T[],
  getKey: (item: T) => K,
): Record<K, T> {
  return arr.reduce(
    (record, item) => {
      record[getKey(item)] = item;
      return record;
    },
    {} as Record<K, T>,
  );
}

export function toGroupedRecord<T, K extends string>(
  arr: T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  return arr.reduce(
    (record, item) => {
      const key = getKey(item);
      if (!record[key]) {
        record[key] = [];
      }
      record[getKey(item)].push(item);

      return record;
    },
    {} as Record<K, T[]>,
  );
}

export function areEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item, idx) => item === arr2[idx]);
}

export function sequence(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export function splitByPredicate<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): [trueArr: T[], falseArr: T[]] {
  const trueArr: T[] = [];
  const falseArr: T[] = [];
  for (const item of arr) {
    if (predicate(item)) {
      trueArr.push(item);
    } else {
      falseArr.push(item);
    }
  }

  return [trueArr, falseArr];
}
