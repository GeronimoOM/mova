export function diffItems<T>(array1: T[], array2: T[]): T[] {
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

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
