import { ContractVerificationStatus as k } from "./node_modules/.pnpm/@0xsequence_indexer@2.3.17/node_modules/@0xsequence/indexer/dist/0xsequence-indexer.esm.js";
import { useQuery as y } from "./node_modules/.pnpm/@tanstack_react-query@5.80.7_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useQuery.js";
import { useState as T, useEffect as A } from "react";
import { zeroAddress as I, formatUnits as L } from "viem";
import * as C from "./node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/index.js";
import { useAPIClient as x } from "./apiClient.js";
import { useIndexerGatewayClient as E } from "./indexerClient.js";
import { useTokenPrices as N } from "./prices.js";
const b = { page: 1, pageSize: 10, more: !1 };
function d(e) {
  return !("contractAddress" in e);
}
function P(e, n) {
  const a = e.balanceUsd ?? 0, r = n.balanceUsd ?? 0;
  if (a !== r)
    return r - a;
  if (d(e) && !d(n)) return -1;
  if (!d(e) && d(n)) return 1;
  try {
    const s = BigInt(e.balance), t = BigInt(n.balance);
    if (s > t) return -1;
    if (s < t) return 1;
  } catch {
    return 0;
  }
  return 0;
}
function z(e, n, a) {
  const r = n ?? E(), s = a ?? x(), {
    data: t,
    isLoading: m,
    error: S
  } = y({
    queryKey: ["tokenBalances", e],
    queryFn: async () => {
      if (!e)
        return console.warn("No account address or indexer client"), {
          balances: [],
          nativeBalances: [],
          page: b
        };
      try {
        const c = await r.getTokenBalancesSummary({
          filter: {
            accountAddresses: [e],
            contractStatus: k.VERIFIED,
            contractTypes: ["ERC20"],
            omitNativeBalances: !1
          }
        });
        return {
          page: c.page,
          balances: c.balances.flatMap((i) => i.results),
          nativeBalances: c.nativeBalances.flatMap(
            (i) => i.results
          )
        };
      } catch (c) {
        return console.error("Failed to fetch token balances:", c), {
          balances: [],
          nativeBalances: [],
          page: b
        };
      }
    },
    enabled: !!e,
    staleTime: 3e4,
    retry: 1
  }), { data: f, isLoading: p } = N(
    ((t == null ? void 0 : t.balances) ?? []).map((c) => {
      var i, o;
      return {
        tokenId: (i = c.contractInfo) == null ? void 0 : i.symbol,
        contractAddress: c.contractAddress,
        chainId: (o = c.contractInfo) == null ? void 0 : o.chainId
      };
    }).concat(
      ((t == null ? void 0 : t.nativeBalances) ?? []).map((c) => ({
        tokenId: c.symbol,
        contractAddress: I,
        chainId: c.chainId
      }))
    ) ?? [],
    s
  ), { data: F = [], isLoading: v } = y({
    queryKey: ["sortedTokens", t, f],
    queryFn: () => !t || !f ? [] : [
      ...t.nativeBalances,
      ...t.balances
    ].filter((o) => {
      try {
        return BigInt(o.balance) > 0n;
      } catch {
        return !1;
      }
    }).map((o) => {
      const B = d(o), u = f.find(
        (l) => {
          var g;
          return l.token.contractAddress === (B ? I : o.contractAddress) && l.token.chainId === (B ? o.chainId : (g = o.contractInfo) == null ? void 0 : g.chainId);
        }
      );
      if (u != null && u.price) {
        const l = { ...o, price: u.price };
        return l.balanceUsd = h(
          o,
          u.price
        ), l.balanceUsdFormatted = U(
          o,
          u.price
        ), l;
      }
      return o;
    }).sort(P),
    enabled: !m && !p && !!t && !!f
  });
  return {
    tokenBalancesData: t,
    isLoadingBalances: m,
    isLoadingPrices: p,
    isLoadingSortedTokens: v || m || p,
    balanceError: S,
    sortedTokens: F
  };
}
async function w() {
  return [
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
    "ARB"
  ];
}
function G() {
  const [e, n] = T([]);
  return A(() => {
    w().then(n);
  }, []), e;
}
function q(e, n = 18) {
  try {
    const a = L(BigInt(e), n), r = parseFloat(a);
    return r === 0 ? "0" : r < 1e-4 ? r.toExponential(2) : r < 1 ? r.toFixed(6) : r < 1e3 ? r.toFixed(4) : r.toLocaleString(void 0, { maximumFractionDigits: 2 });
  } catch (a) {
    return console.error("Error formatting balance:", a), e;
  }
}
function H(e) {
  return Object.values(C).find((n) => n.id === e) || null;
}
function h(e, n) {
  var t;
  const a = d(e), r = q(
    e.balance,
    a ? 18 : (t = e.contractInfo) == null ? void 0 : t.decimals
  ), s = Number(n.value) ?? 0;
  return Number(r) * s;
}
function U(e, n) {
  const a = h(e, n);
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(a);
}
function X(e, n) {
  const [a, r] = T("");
  return A(() => {
    const s = U(e, n);
    r(s);
  }, [e, n]), a;
}
export {
  q as formatBalance,
  H as getChainInfo,
  w as getSourceTokenList,
  h as getTokenBalanceUsd,
  U as getTokenBalanceUsdFormatted,
  P as sortTokensByPriority,
  G as useSourceTokenList,
  X as useTokenBalanceUsdFormat,
  z as useTokenBalances
};
