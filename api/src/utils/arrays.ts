export function diff<T>(array1: T[], array2: T[]): T[] {
  const diffElements: T[] = [];

  for (const a of array1) {
    if (!array2.includes(a)) {
      diffElements.push(a);
    }
  }

  for (const b of array2) {
    if (!array1.includes(b)) {
      diffElements.push(b);
    }
  }

  return diffElements;
}
