export function seq(n: number): number[] {
  return Array(n).fill(undefined).map((_, idx) => idx);
}
