export function pickN<T>(items: T[], total: number): T[] {
  const picked: T[] = [];
  let remaining = [...items];
  while (remaining.length && picked.length < total) {
    const randomIndex = Math.floor(Math.random() * remaining.length);
    picked.push(remaining[randomIndex]);
    remaining = remaining.toSpliced(randomIndex, 1);
  }

  return picked;
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
