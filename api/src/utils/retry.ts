export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry(
  func: () => Promise<void>,
  ms: number,
  onError: () => void,
): Promise<void> {
  while (true) {
    try {
      await func();
      break;
    } catch {
      onError();
      await sleep(ms);
    }
  }
}
