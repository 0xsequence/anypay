export async function requestWithTimeout<T>(
  client: { request: (...args: any[]) => Promise<T> },
  args: Parameters<typeof client.request>,
  timeoutMs: number,
): Promise<T> {
  return Promise.race([
    client.request(...args),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs),
    ),
  ])
}
