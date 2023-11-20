export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry(
  func: () => Promise<void>,
  ms: number,
): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await func();
      break;
    } catch (err) {
      console.log('Retrying due to error');
      await sleep(ms);
    }
  }
}
