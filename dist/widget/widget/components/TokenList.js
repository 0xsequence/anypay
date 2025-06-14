import { jsxs as o, jsx as a } from "react/jsx-runtime";
import { TokenImage as P, NetworkImage as R } from "@0xsequence/design-system";
import { useState as E, useMemo as F } from "react";
import { zeroAddress as f, formatUnits as Q, isAddressEqual as D } from "viem";
import * as O from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/index.js";
import { useAccount as W } from "wagmi";
import { useTokenBalances as G, useSourceTokenList as J } from "../../tokenBalances.js";
import K from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-left.js";
import V from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/search.js";
import { from as B } from "../../node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/Address.js";
const w = (i) => Object.values(O).find((y) => y.id === i) || null, X = (i, y = 18) => {
  try {
    const x = Q(BigInt(i), y), r = parseFloat(x);
    return r === 0 ? "0" : r < 1e-4 ? r.toExponential(2) : r < 1 ? r.toFixed(6) : r < 1e3 ? r.toFixed(4) : r.toLocaleString(void 0, { maximumFractionDigits: 2 });
  } catch (x) {
    return console.error("Error formatting balance:", x), i;
  }
}, ce = ({
  onContinue: i,
  onBack: y,
  indexerGatewayClient: x,
  theme: r = "light"
}) => {
  const [m, H] = E(null), [h, j] = E(""), { address: q } = W(), {
    sortedTokens: $,
    isLoadingSortedTokens: k,
    balanceError: v
  } = G(q, x), T = J(), p = F(() => $.filter((e) => {
    var s;
    return !e.contractAddress || T.includes(((s = e.contractInfo) == null ? void 0 : s.symbol) || "");
  }), [$, T]), z = (e) => {
    var l, u, b, g;
    const s = !("contractAddress" in e), t = w(e.chainId), n = s ? f : e.contractAddress, c = `https://assets.sequence.info/images/tokens/small/${e.chainId}/${n}.webp`;
    let d;
    s ? d = {
      id: e.chainId,
      name: (t == null ? void 0 : t.nativeCurrency.name) || "Native Token",
      symbol: (t == null ? void 0 : t.nativeCurrency.symbol) || "ETH",
      balance: e.balance,
      imageUrl: c,
      chainId: e.chainId,
      contractAddress: f,
      balanceUsdFormatted: e.balanceUsdFormatted,
      tokenPriceUsd: ((l = e.price) == null ? void 0 : l.value) ?? 0,
      contractInfo: {
        decimals: 18,
        symbol: (t == null ? void 0 : t.nativeCurrency.symbol) || "ETH",
        name: (t == null ? void 0 : t.nativeCurrency.name) || "Native Token"
      }
    } : d = {
      id: e.chainId,
      name: ((u = e.contractInfo) == null ? void 0 : u.name) || "Unknown Token",
      symbol: ((b = e.contractInfo) == null ? void 0 : b.symbol) || "???",
      balance: e.balance,
      imageUrl: c,
      chainId: e.chainId,
      contractAddress: e.contractAddress,
      contractInfo: e.contractInfo,
      balanceUsdFormatted: e.balanceUsdFormatted,
      tokenPriceUsd: ((g = e.price) == null ? void 0 : g.value) ?? 0
    }, H(d), i(d);
  }, C = (e) => {
    if (!m) return !1;
    const s = !("contractAddress" in e);
    return m.chainId === e.chainId && (s ? m.contractAddress === f : D(
      B(m.contractAddress),
      B(e.contractAddress)
    ));
  }, A = F(() => {
    if (!h.trim())
      return p;
    const e = h.toLowerCase().trim();
    return p.filter((s) => {
      var d, l, u, b;
      const t = !("contractAddress" in s), n = w(s.chainId), c = (n == null ? void 0 : n.name) || "";
      if (t) {
        const g = (n == null ? void 0 : n.nativeCurrency.symbol) || "ETH", N = (n == null ? void 0 : n.nativeCurrency.name) || "Native Token";
        return g.toLowerCase().includes(e) || N.toLowerCase().includes(e) || c.toLowerCase().includes(e);
      }
      return ((l = (d = s.contractInfo) == null ? void 0 : d.symbol) == null ? void 0 : l.toLowerCase().includes(e)) || ((b = (u = s.contractInfo) == null ? void 0 : u.name) == null ? void 0 : b.toLowerCase().includes(e)) || c.toLowerCase().includes(e);
    });
  }, [p, h]);
  return /* @__PURE__ */ o("div", { className: "space-y-6", children: [
    /* @__PURE__ */ o("div", { className: "flex items-center relative", children: [
      /* @__PURE__ */ a(
        "button",
        {
          onClick: y,
          className: `absolute -left-2 p-2 rounded-full transition-colors cursor-pointer ${r === "dark" ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
          children: /* @__PURE__ */ a(K, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ a(
        "h2",
        {
          className: `text-lg font-semibold w-full text-center ${r === "dark" ? "text-white" : "text-gray-900"}`,
          children: "Select Token"
        }
      )
    ] }),
    /* @__PURE__ */ o("div", { className: "relative", children: [
      /* @__PURE__ */ a("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ a(
        V,
        {
          className: `h-5 w-5 ${r === "dark" ? "text-gray-500" : "text-gray-400"}`
        }
      ) }),
      /* @__PURE__ */ a(
        "input",
        {
          type: "text",
          value: h,
          onChange: (e) => j(e.target.value),
          placeholder: "Search tokens and chains",
          className: `block w-full pl-10 pr-3 py-2 border rounded-[24px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${r === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`
        }
      )
    ] }),
    k && /* @__PURE__ */ o("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ a(
        "div",
        {
          className: `animate-spin rounded-full h-8 w-8 border-b-2 mx-auto ${r === "dark" ? "border-white" : "border-black"}`
        }
      ),
      /* @__PURE__ */ a(
        "p",
        {
          className: `mt-2 ${r === "dark" ? "text-gray-400" : "text-gray-500"}`,
          children: "Loading your token balances..."
        }
      )
    ] }),
    v && /* @__PURE__ */ a(
      "div",
      {
        className: `border rounded-lg p-4 mb-4 ${r === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`,
        children: /* @__PURE__ */ o("div", { className: "flex items-start", children: [
          /* @__PURE__ */ a("div", { className: "flex-shrink-0", children: /* @__PURE__ */ a(
            "svg",
            {
              className: "h-5 w-5 text-red-400",
              viewBox: "0 0 20 20",
              fill: "currentColor",
              children: /* @__PURE__ */ a(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                  clipRule: "evenodd"
                }
              )
            }
          ) }),
          /* @__PURE__ */ o("div", { className: "ml-3", children: [
            /* @__PURE__ */ a(
              "h3",
              {
                className: `text-sm font-medium ${r === "dark" ? "text-red-200" : "text-red-800"}`,
                children: "Error loading balances"
              }
            ),
            /* @__PURE__ */ a(
              "p",
              {
                className: `text-sm mt-1 ${r === "dark" ? "text-red-200" : "text-red-700"}`,
                children: v instanceof Error ? v.message : "Failed to fetch token balances. Please try again."
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                onClick: () => window.location.reload(),
                className: `mt-2 text-sm font-medium underline ${r === "dark" ? "text-red-200 hover:text-red-100" : "text-red-700 hover:text-red-900"}`,
                children: "Refresh page"
              }
            )
          ] })
        ] })
      }
    ),
    !k && !v && A.length === 0 && /* @__PURE__ */ a(
      "div",
      {
        className: `text-center py-4 rounded-lg ${r === "dark" ? "bg-gray-800" : "bg-gray-50"}`,
        children: /* @__PURE__ */ a("p", { className: r === "dark" ? "text-gray-400" : "text-gray-500", children: h.trim() ? "No tokens found matching your search." : "No tokens found with balance greater than 0." })
      }
    ),
    /* @__PURE__ */ a(
      "div",
      {
        className: `divide-y ${r === "dark" ? "divide-gray-700/50" : "divide-gray-200"} max-h-[35vh] overflow-y-auto rounded-[16px] ${r === "dark" ? "bg-gray-800/50" : "bg-white"}`,
        children: A.map((e) => {
          var L, I, S, U;
          const s = !("contractAddress" in e), t = w(e.chainId), n = (t == null ? void 0 : t.nativeCurrency.symbol) || "ETH", c = s ? n : ((L = e.contractInfo) == null ? void 0 : L.symbol) || "???", d = s ? f : e.contractAddress;
          let l = d;
          c === "WETH" && (l = f);
          const u = `https://assets.sequence.info/images/tokens/small/${e.chainId}/${l}.webp`, b = s ? `${n} (${(t == null ? void 0 : t.name) || "Unknown Chain"})` : ((I = e.contractInfo) == null ? void 0 : I.name) || "Unknown Token", g = X(
            e.balance,
            s ? 18 : (S = e.contractInfo) == null ? void 0 : S.decimals
          ), N = Number((U = e.price) == null ? void 0 : U.value) ?? 0, M = e.balanceUsdFormatted ?? "";
          return /* @__PURE__ */ o(
            "div",
            {
              onClick: () => z(e),
              className: `py-2.5 px-3 flex items-center space-x-3 cursor-pointer transition-colors ${r === "dark" ? C(e) ? "bg-gray-800" : "hover:bg-gray-800/80" : C(e) ? "bg-gray-100" : "hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ o("div", { className: "relative flex-shrink-0", children: [
                  /* @__PURE__ */ a(
                    "div",
                    {
                      className: `w-7 h-7 rounded-full flex items-center justify-center ${r === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
                      children: d ? /* @__PURE__ */ a(P, { symbol: c, src: u }) : /* @__PURE__ */ a(
                        "span",
                        {
                          className: `text-base font-medium ${r === "dark" ? "text-gray-300" : "text-gray-600"}`,
                          children: c[0]
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ a("div", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ a(
                    R,
                    {
                      chainId: e.chainId,
                      size: "sm",
                      className: "w-3.5 h-3.5"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ o("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ a(
                    "h3",
                    {
                      className: `text-sm font-medium truncate ${r === "dark" ? "text-white" : "text-gray-900"}`,
                      children: b
                    }
                  ),
                  /* @__PURE__ */ a(
                    "p",
                    {
                      className: `text-xs ${r === "dark" ? "text-gray-400" : "text-gray-500"}`,
                      children: c
                    }
                  )
                ] }),
                /* @__PURE__ */ o("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ a(
                    "p",
                    {
                      className: `text-sm font-medium ${r === "dark" ? "text-white" : "text-gray-900"}`,
                      children: g
                    }
                  ),
                  N > 0 && /* @__PURE__ */ a(
                    "p",
                    {
                      className: `text-xs ${r === "dark" ? "text-gray-400" : "text-gray-500"}`,
                      children: M
                    }
                  )
                ] })
              ]
            },
            s ? `${e.chainId}-native` : `${e.chainId}-${e.contractAddress}`
          );
        })
      }
    ),
    /* @__PURE__ */ a("div", { className: "space-y-4", children: /* @__PURE__ */ a(
      "button",
      {
        onClick: () => m && i(m),
        disabled: !m,
        className: `w-full font-semibold py-3 px-4 rounded-[24px] transition-colors ${r === "dark" ? "bg-blue-600 disabled:bg-gray-700 text-white disabled:text-gray-400 enabled:hover:bg-blue-700" : "bg-blue-500 disabled:bg-gray-300 text-white disabled:text-gray-500 enabled:hover:bg-blue-600"} disabled:cursor-not-allowed cursor-pointer`,
        children: "Continue"
      }
    ) })
  ] });
};
export {
  ce as TokenList,
  ce as default
};
