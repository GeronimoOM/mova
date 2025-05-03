export async function waitAtLeast<T>(
  promise: Promise<T>,
  durationMs: number,
): Promise<T> {
  const [result] = await Promise.all([promise, wait(durationMs)]);

  return result;
}

export function wait(durationMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, durationMs));
}
