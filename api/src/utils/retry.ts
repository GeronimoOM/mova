export async function sleep(ms: number): Promise<void> {
    await new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export async function retry(
    func: () => Promise<void>,
    ms: number,
): Promise<void> {
    while (true) {
        try {
            await func();
            break;
        } catch (err) {
            console.log('Retrying due to error', err);
            await sleep(ms);
        }
    }
}
