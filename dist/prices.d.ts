import type { SequenceAPIClient, Token } from "@0xsequence/api";
export declare const getTokenPrices: (apiClient: SequenceAPIClient, tokens: Token[]) => Promise<import("@0xsequence/api").TokenPrice[]>;
export declare const useTokenPrices: (tokens: Token[], apiClient: SequenceAPIClient) => import("@tanstack/react-query").UseQueryResult<import("@0xsequence/api").TokenPrice[], Error>;
//# sourceMappingURL=prices.d.ts.map