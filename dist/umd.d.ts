interface AnyPayGlobal {
    render: (element: HTMLElement, options: {
        sequenceApiKey: string;
        indexerUrl?: string;
        apiUrl?: string;
        env?: "local" | "cors-anywhere" | "dev" | "prod";
        toRecipient?: string;
        toAmount?: string;
        toChainId?: number | string;
        toToken?: "USDC" | "ETH";
        toCalldata?: string;
        theme?: "light" | "dark" | "auto";
    }) => void;
}
declare const AnyPayGlobal: AnyPayGlobal;
export default AnyPayGlobal;
declare global {
    interface Window {
        AnyPayWidget: AnyPayGlobal;
    }
}
//# sourceMappingURL=umd.d.ts.map