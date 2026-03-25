export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRateLimit<T>(
  fn: () => Promise<T>,
  delayMs: number = 500
): Promise<T> {
  const result = await fn();
  await delay(delayMs);
  return result;
}