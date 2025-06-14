import { ContractVerificationStatus, } from "@0xsequence/indexer";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { formatUnits, zeroAddress } from "viem";
import * as chains from "viem/chains";
import { useAPIClient } from "./apiClient.js";
import { useIndexerGatewayClient } from "./indexerClient.js";
import { useTokenPrices } from "./prices.js";
// Default empty page info for query fallback
const defaultPage = { page: 1, pageSize: 10, more: false };
// Type guard for native token balance
function isNativeToken(token) {
    if ("contractAddress" in token) {
        return false;
    }
    return true;
}
export function sortTokensByPriority(a, b) {
    // First sort by USD balance if available
    const aUsdBalance = a.balanceUsd ?? 0;
    const bUsdBalance = b.balanceUsd ?? 0;
    if (aUsdBalance !== bUsdBalance) {
        return bUsdBalance - aUsdBalance; // Higher USD balance first
    }
    // Then sort by native token status
    if (isNativeToken(a) && !isNativeToken(b))
        return -1;
    if (!isNativeToken(a) && isNativeToken(b))
        return 1;
    // Finally sort by token balance
    try {
        const balanceA = BigInt(a.balance);
        const balanceB = BigInt(b.balance);
        if (balanceA > balanceB)
            return -1;
        if (balanceA < balanceB)
            return 1;
    }
    catch {
        // If balance comparison fails, maintain current order
        return 0;
    }
    return 0;
}
export function useTokenBalances(address, indexerGatewayClient, sequenceApiClient) {
    const indexerClient = indexerGatewayClient ?? useIndexerGatewayClient();
    const apiClient = sequenceApiClient ?? useAPIClient();
    // Fetch token balances
    const { data: tokenBalancesData, isLoading: isLoadingBalances, error: balanceError, } = useQuery({
        queryKey: ["tokenBalances", address],
        queryFn: async () => {
            if (!address) {
                console.warn("No account address or indexer client");
                return {
                    balances: [],
                    nativeBalances: [],
                    page: defaultPage,
                };
            }
            try {
                const summaryFromGateway = await indexerClient.getTokenBalancesSummary({
                    filter: {
                        accountAddresses: [address],
                        contractStatus: ContractVerificationStatus.VERIFIED,
                        contractTypes: ["ERC20"],
                        omitNativeBalances: false,
                    },
                });
                return {
                    page: summaryFromGateway.page,
                    balances: summaryFromGateway.balances.flatMap((b) => b.results),
                    nativeBalances: summaryFromGateway.nativeBalances.flatMap((b) => b.results),
                };
            }
            catch (error) {
                console.error("Failed to fetch token balances:", error);
                return {
                    balances: [],
                    nativeBalances: [],
                    page: defaultPage,
                };
            }
        },
        enabled: !!address,
        staleTime: 30000,
        retry: 1,
    });
    const { data: tokenPrices, isLoading: isLoadingPrices } = useTokenPrices((tokenBalancesData?.balances ?? [])
        .map((b) => {
        return {
            tokenId: b.contractInfo?.symbol,
            contractAddress: b.contractAddress,
            chainId: b.contractInfo?.chainId,
        };
    })
        .concat((tokenBalancesData?.nativeBalances ?? []).map((b) => {
        return {
            tokenId: b.symbol,
            contractAddress: zeroAddress,
            chainId: b.chainId,
        };
    })) ?? [], apiClient);
    const { data: sortedTokens = [], isLoading: isLoadingSortedTokens } = useQuery({
        queryKey: ["sortedTokens", tokenBalancesData, tokenPrices],
        queryFn: () => {
            if (!tokenBalancesData || !tokenPrices) {
                return [];
            }
            const balances = [
                ...tokenBalancesData.nativeBalances,
                ...tokenBalancesData.balances,
            ].filter((token) => {
                try {
                    return BigInt(token.balance) > 0n;
                }
                catch {
                    return false;
                }
            });
            // First pass: add prices to all tokens
            const tokensWithPrices = balances.map((token) => {
                const isNative = isNativeToken(token);
                const priceData = tokenPrices.find((p) => p.token.contractAddress ===
                    (isNative ? zeroAddress : token.contractAddress) &&
                    p.token.chainId ===
                        (isNative ? token.chainId : token.contractInfo?.chainId));
                if (priceData?.price) {
                    const tokenWithPrice = { ...token, price: priceData.price };
                    tokenWithPrice.balanceUsd = getTokenBalanceUsd(token, priceData.price);
                    tokenWithPrice.balanceUsdFormatted = getTokenBalanceUsdFormatted(token, priceData.price);
                    return tokenWithPrice;
                }
                return token;
            });
            return tokensWithPrices.sort(sortTokensByPriority);
        },
        enabled: !isLoadingBalances &&
            !isLoadingPrices &&
            !!tokenBalancesData &&
            !!tokenPrices,
    });
    return {
        tokenBalancesData,
        isLoadingBalances,
        isLoadingPrices,
        isLoadingSortedTokens: isLoadingSortedTokens || isLoadingBalances || isLoadingPrices,
        balanceError,
        sortedTokens,
    };
}
// TODO: make this dynamic
export async function getSourceTokenList() {
    const allowedTokens = [
        "ETH",
        "WETH",
        "USDC",
        "USDT",
        "DAI",
        "OP",
        "ARB",
        "MATIC",
        "XDAI",
        "AVAX",
        "BNB",
        "OKB",
        "BAT",
        "ARB",
    ];
    return allowedTokens;
}
export function useSourceTokenList() {
    const [list, setList] = useState([]);
    useEffect(() => {
        getSourceTokenList().then(setList);
    }, []);
    return list;
}
// Helper to format balance
export function formatBalance(balance, decimals = 18) {
    try {
        const formatted = formatUnits(BigInt(balance), decimals);
        const num = parseFloat(formatted);
        if (num === 0)
            return "0";
        if (num < 0.0001)
            return num.toExponential(2);
        if (num < 1)
            return num.toFixed(6);
        if (num < 1000)
            return num.toFixed(4);
        return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    catch (e) {
        console.error("Error formatting balance:", e);
        return balance;
    }
}
// Helper to get chain info
export function getChainInfo(chainId) {
    // TODO: Add proper type
    return (Object.values(chains).find((chain) => chain.id === chainId) || null);
}
export function getTokenBalanceUsd(token, tokenPrice) {
    const isNative = isNativeToken(token);
    const formattedBalance = formatBalance(token.balance, isNative ? 18 : token.contractInfo?.decimals);
    const priceUsd = Number(tokenPrice.value) ?? 0;
    return Number(formattedBalance) * priceUsd;
}
export function getTokenBalanceUsdFormatted(token, tokenPrice) {
    const balanceUsd = getTokenBalanceUsd(token, tokenPrice);
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(balanceUsd);
}
export function useTokenBalanceUsdFormat(token, tokenPrice) {
    const [format, setFormat] = useState("");
    useEffect(() => {
        const formattedBalance = getTokenBalanceUsdFormatted(token, tokenPrice);
        setFormat(formattedBalance);
    }, [token, tokenPrice]);
    return format;
}
