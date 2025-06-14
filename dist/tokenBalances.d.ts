import type { Page, Price, SequenceAPIClient } from "@0xsequence/api";
import { type GetTokenBalancesSummaryReturn, type NativeTokenBalance, type SequenceIndexerGateway, type TokenBalance } from "@0xsequence/indexer";
import type { Address } from "ox";
import { type Chain } from "viem";
export type { NativeTokenBalance, TokenBalance };
export interface TokenBalanceWithPrice extends TokenBalance {
    price?: Price;
    balanceUsd?: number;
    balanceUsdFormatted?: string;
}
export interface NativeTokenBalanceWithPrice extends NativeTokenBalance {
    price?: Price;
    balanceUsd?: number;
    balanceUsdFormatted?: string;
    symbol?: string;
}
export type TokenBalanceExtended = TokenBalanceWithPrice | NativeTokenBalanceWithPrice;
export declare function sortTokensByPriority(a: TokenBalanceExtended, b: TokenBalanceExtended): number;
export interface GetTokenBalancesWithPrice {
    page: Page;
    nativeBalances: Array<NativeTokenBalance & {
        price?: Price;
        symbol?: string;
        balanceUsd?: number;
        balanceUsdFormatted?: string;
    }>;
    balances: Array<TokenBalance & {
        price?: Price;
        balanceUsd?: number;
        balanceUsdFormatted?: string;
    }>;
}
export declare function useTokenBalances(address: Address.Address, indexerGatewayClient?: SequenceIndexerGateway, sequenceApiClient?: SequenceAPIClient): {
    tokenBalancesData: GetTokenBalancesSummaryReturn | undefined;
    isLoadingBalances: boolean;
    isLoadingPrices: boolean;
    isLoadingSortedTokens: boolean;
    balanceError: Error | null;
    sortedTokens: TokenBalanceExtended[];
};
export declare function getSourceTokenList(): Promise<string[]>;
export declare function useSourceTokenList(): string[];
export declare function formatBalance(balance: string, decimals?: number): string;
export declare function getChainInfo(chainId: number): Chain | null;
export declare function getTokenBalanceUsd(token: TokenBalance | NativeTokenBalance, tokenPrice: Price): number;
export declare function getTokenBalanceUsdFormatted(token: TokenBalance | NativeTokenBalance, tokenPrice: Price): string;
export declare function useTokenBalanceUsdFormat(token: TokenBalance | NativeTokenBalance, tokenPrice: Price): string;
//# sourceMappingURL=tokenBalances.d.ts.map