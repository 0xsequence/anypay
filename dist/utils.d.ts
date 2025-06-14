export declare function requestWithTimeout<T>(client: {
    request: (...args: any[]) => Promise<T>;
}, args: Parameters<typeof client.request>, timeoutMs: number): Promise<T>;
//# sourceMappingURL=utils.d.ts.map