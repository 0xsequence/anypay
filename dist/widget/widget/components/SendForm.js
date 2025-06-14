import { jsxs as a, jsx as e, Fragment as ae } from "react/jsx-runtime";
import { TokenImage as k, NetworkImage as U } from "@0xsequence/design-system";
import { useState as m, useEffect as h, useRef as se, useMemo as ne } from "react";
import { isAddress as ie, getAddress as le, zeroAddress as me, parseUnits as Re } from "viem";
import * as Ie from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/index.js";
import { useEnsAddress as Te } from "wagmi";
import { prepareSend as Fe } from "../../anypay.js";
import { useAPIClient as Oe } from "../../apiClient.js";
import { useTokenPrices as ze } from "../../prices.js";
import { getRelayer as de } from "../../relayer.js";
import { formatBalance as Be } from "../../tokenBalances.js";
import { FeeOptions as je } from "./FeeOptions.js";
import { mainnet as be } from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/mainnet.js";
import Pe from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-left.js";
import oe from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-down.js";
import qe from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js";
import { base as We } from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/base.js";
import { optimism as Le } from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/optimism.js";
import { arbitrum as He } from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/arbitrum.js";
import { polygon as _e } from "../../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/polygon.js";
const D = [
  { id: 1, name: "Ethereum", icon: be.id },
  { id: 8453, name: "Base", icon: We.id },
  { id: 10, name: "Optimism", icon: Le.id },
  { id: 42161, name: "Arbitrum", icon: He.id },
  { id: 137, name: "Polygon", icon: _e.id }
], w = [
  {
    symbol: "ETH",
    name: "Ethereum",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0x0000000000000000000000000000000000000000.webp",
    decimals: 18
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.webp",
    decimals: 6
  },
  {
    symbol: "USDT",
    name: "Tether",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0xdac17f958d2ee523a2206206994597c13d831ec7.webp",
    decimals: 6
  },
  {
    symbol: "BAT",
    name: "Basic Attention Token",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0x0d8775f648430679a709e98d2b0cb6250d2887ef.webp",
    decimals: 18
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    imageUrl: "https://assets.sequence.info/images/tokens/small/42161/0x912ce59144191c1204e64559fe8253a0e49e6548.webp",
    decimals: 18
  }
], Me = [
  {
    symbol: "ETH",
    name: "Ethereum",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0x0000000000000000000000000000000000000000.webp"
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    imageUrl: "https://assets.sequence.info/images/tokens/small/1/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.webp"
  }
], Ve = (s) => Object.values(Ie).find((i) => i.id === s) || null;
function ce(s, i) {
  if (i === "ETH")
    return me;
  if (s === 1) {
    if (i === "USDC")
      return "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
    if (i === "USDT")
      return "0xdac17f958d2ee523a2206206994597c13d831ec7";
    if (i === "BAT")
      return "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
    if (i === "ARB")
      return "0xb50721bcf8d664c30412cfbc6cf7a15145234ad1";
  }
  if (s === 10) {
    if (i === "USDC")
      return "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
    if (i === "USDT")
      return "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58";
  }
  if (s === 42161) {
    if (i === "USDC")
      return "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
    if (i === "USDT")
      return "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9";
    if (i === "ARB")
      return "0x912ce59144191c1204e64559fe8253a0e49e6548";
  }
  if (s === 8453) {
    if (i === "USDC")
      return "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
    if (i === "USDT")
      return "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2";
  }
  if (s === 137) {
    if (i === "USDC")
      return "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    if (i === "USDT")
      return "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
    if (i === "BAT")
      return "0x3cef98bb43d732e2f285ee605a8158cde967d219";
  }
  throw new Error(
    `Unsupported token symbol: ${i} for chainId: ${s}`
  );
}
const gr = ({
  selectedToken: s,
  onSend: i,
  onBack: ge,
  onConfirm: fe,
  onComplete: ue,
  account: g,
  sequenceApiKey: W,
  apiUrl: pe,
  env: L,
  toAmount: u,
  toRecipient: x,
  toChainId: p,
  toToken: f,
  toCalldata: y,
  walletClient: xe,
  theme: t = "light",
  onTransactionStateChange: ye
}) => {
  var Z;
  const [o, H] = m(u ?? ""), [b, _] = m(x ?? ""), [c, A] = m(x ?? ""), [M, E] = m(null), { data: N } = Te({
    name: b != null && b.endsWith(".eth") ? b : void 0,
    chainId: be.id,
    query: {
      enabled: !!b && b.endsWith(".eth")
    }
  });
  h(() => {
    A(N || b);
  }, [N, b]);
  const he = (r) => {
    _(r.target.value.trim());
  }, [d, V] = m(
    () => D.find(
      (r) => r.id === (p ?? s.chainId)
    ) || D[0]
  ), [S, R] = m(!1), [I, T] = m(!1), [n, K] = m(
    () => f && w.find((r) => r.symbol === f) || w[0]
  ), G = Oe({ apiUrl: pe, projectAccessKey: W }), { data: v } = ze(
    n ? (() => {
      try {
        const r = ce(
          d.id,
          n.symbol
        );
        return [
          {
            tokenId: n.symbol,
            contractAddress: r,
            chainId: d.id
          }
        ];
      } catch {
        return [];
      }
    })() : [],
    G
  );
  h(() => {
    if (p) {
      const r = D.find((l) => l.id === p);
      r && V(r);
    }
  }, [p]), h(() => {
    if (f) {
      const r = w.find(
        (l) => l.symbol === f
      );
      r && K(r);
    }
  }, [f]), h(() => {
    H(u ?? "");
  }, [u]);
  const F = se(null), O = se(null), z = Ve(s.chainId), [$, B] = m(!1), [J, j] = m(!1), we = Be(
    s.balance,
    (Z = s.contractInfo) == null ? void 0 : Z.decimals
  ), Q = s.balanceUsdFormatted ?? "", P = c && ie(c);
  h(() => {
    const r = (l) => {
      F.current && !F.current.contains(l.target) && R(!1), O.current && !O.current.contains(l.target) && T(!1);
    };
    return document.addEventListener("mousedown", r), () => document.removeEventListener("mousedown", r);
  }, []);
  const X = ne(() => {
    var l, C;
    const r = parseFloat(o) * (((C = (l = v == null ? void 0 : v[0]) == null ? void 0 : l.price) == null ? void 0 : C.value) ?? 0);
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(r);
  }, [o, v]), [Ne, ve] = m(), $e = async (r) => {
    r.preventDefault(), E(null);
    try {
      let l = function() {
        fe(), j(!1), i(o, c);
      };
      B(!0);
      const C = n == null ? void 0 : n.decimals, Ce = Re(o, C).toString();
      let ee;
      try {
        ee = n.symbol === "ETH" ? me : ce(d.id, n.symbol);
      } catch {
        E(
          `${n.symbol} is not available on ${d.name}`
        ), B(!1);
        return;
      }
      const ke = de(
        { env: L, useV3Relayers: !0 },
        s.chainId
      ), Ue = de(
        { env: L, useV3Relayers: !0 },
        d.id
      ), re = {
        account: g,
        originTokenAddress: s.contractAddress,
        originChainId: s.chainId,
        originTokenAmount: s.balance,
        destinationChainId: d.id,
        recipient: c,
        destinationTokenAddress: ee,
        destinationTokenAmount: Ce,
        destinationTokenSymbol: n.symbol,
        sequenceApiKey: W,
        fee: "0",
        client: xe,
        apiClient: G,
        originRelayer: ke,
        destinationRelayer: Ue,
        destinationCalldata: y,
        dryMode: !1,
        // Set to true to skip the metamask transaction, for testing purposes
        onTransactionStateChange: (te) => {
          ye(te);
        }
      };
      console.log("options", re);
      const { intentAddress: q, send: De } = await Fe(re);
      console.log("Intent address:", q == null ? void 0 : q.toString()), j(!0);
      const {
        originUserTxReceipt: Ae,
        originMetaTxnReceipt: Ee,
        destinationMetaTxnReceipt: Se
      } = await De(l);
      ue({
        originChainId: s.chainId,
        destinationChainId: d.id,
        originUserTxReceipt: Ae,
        originMetaTxnReceipt: Ee,
        destinationMetaTxnReceipt: Se
      });
    } catch (l) {
      console.error("Error in prepareSend:", l), E(
        l instanceof Error ? l.message : "An unexpected error occurred"
      );
    }
    B(!1), j(!1);
  }, Y = ne(() => {
    if (J) return "Waiting for wallet...";
    if ($) return "Processing...";
    if (!o) return "Enter amount";
    if (!P) return "Enter recipient";
    try {
      const r = le(c), l = le(g.address);
      return r === l ? `Receive ${o} ${n.symbol}` : y ? `Spend ${o} ${n.symbol}` : `Pay ${o} ${n.symbol}`;
    } catch {
      return `Send ${o} ${n.symbol}`;
    }
  }, [
    o,
    P,
    c,
    g.address,
    n.symbol,
    y,
    J,
    $
  ]);
  return /* @__PURE__ */ a("div", { className: "space-y-6", children: [
    /* @__PURE__ */ a("div", { className: "flex items-center relative", children: [
      /* @__PURE__ */ e(
        "button",
        {
          onClick: ge,
          className: `absolute -left-2 p-2 rounded-full transition-colors cursor-pointer ${t === "dark" ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
          children: /* @__PURE__ */ e(Pe, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ e(
        "h2",
        {
          className: `text-lg font-semibold w-full text-center ${t === "dark" ? "text-white" : "text-gray-900"}`,
          children: "Send Payment"
        }
      )
    ] }),
    /* @__PURE__ */ a(
      "div",
      {
        className: `flex items-center space-x-4 p-4 rounded-lg ${t === "dark" ? "bg-gray-800" : "bg-gray-50"}`,
        children: [
          /* @__PURE__ */ a("div", { className: "relative", children: [
            /* @__PURE__ */ e(
              "div",
              {
                className: `w-12 h-12 rounded-full flex items-center justify-center ${t === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
                children: s.contractAddress ? /* @__PURE__ */ e(
                  k,
                  {
                    symbol: s.symbol,
                    src: s.imageUrl
                  }
                ) : /* @__PURE__ */ e(
                  "span",
                  {
                    className: `text-2xl font-medium ${t === "dark" ? "text-gray-300" : "text-gray-600"}`,
                    children: s.symbol[0]
                  }
                )
              }
            ),
            /* @__PURE__ */ e("div", { className: "absolute -bottom-1 -right-1", children: /* @__PURE__ */ e(
              U,
              {
                chainId: s.chainId,
                size: "sm",
                className: "w-6 h-6"
              }
            ) })
          ] }),
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ a(
              "h3",
              {
                className: `text-lg font-medium ${t === "dark" ? "text-white" : "text-gray-900"}`,
                children: [
                  "From: ",
                  s.name
                ]
              }
            ),
            /* @__PURE__ */ a("p", { className: t === "dark" ? "text-gray-400" : "text-gray-500", children: [
              "on ",
              (z == null ? void 0 : z.name) || "Unknown Chain",
              " • Balance:",
              " ",
              we,
              " ",
              s.symbol,
              Q && /* @__PURE__ */ a(
                "span",
                {
                  className: `ml-1 text-sm ${t === "dark" ? "text-gray-400" : "text-gray-500"}`,
                  children: [
                    "(",
                    Q,
                    ")"
                  ]
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ a("form", { onSubmit: $e, className: "space-y-2", children: [
      /* @__PURE__ */ a("div", { className: p ? void 0 : "mb-4", children: [
        /* @__PURE__ */ e(
          "label",
          {
            className: `block text-sm font-medium mb-1 ${t === "dark" ? "text-gray-300" : "text-gray-700"}`,
            children: "Destination Chain"
          }
        ),
        p ? /* @__PURE__ */ a("div", { className: "flex items-center px-2 py-1", children: [
          /* @__PURE__ */ e(
            U,
            {
              chainId: d.icon,
              size: "sm",
              className: "w-5 h-5"
            }
          ),
          /* @__PURE__ */ e(
            "span",
            {
              className: `ml-2 ${t === "dark" ? "text-white" : "text-gray-900"}`,
              children: d.name
            }
          )
        ] }) : /* @__PURE__ */ a("div", { className: "relative", ref: F, children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              onClick: () => R(!S),
              className: `w-full flex items-center px-4 py-3 border rounded-[24px] hover:border-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${t === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`,
              children: [
                /* @__PURE__ */ e(
                  U,
                  {
                    chainId: d.icon,
                    size: "sm",
                    className: "w-5 h-5"
                  }
                ),
                /* @__PURE__ */ e("span", { className: "ml-2 flex-1 text-left", children: d.name }),
                /* @__PURE__ */ e(
                  oe,
                  {
                    className: `h-5 w-5 text-gray-400 transition-transform ${S ? "transform rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          S && /* @__PURE__ */ e(
            "div",
            {
              className: `absolute z-10 w-full mt-1 border rounded-[24px] shadow-lg ${t === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
              children: D.map((r) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    V(r), R(!1);
                  },
                  className: `w-full flex items-center px-4 py-3 ${t === "dark" ? d.id === r.id ? "bg-gray-700 text-white" : "text-white hover:bg-gray-700" : d.id === r.id ? "bg-gray-100 text-gray-900" : "text-gray-900 hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ e(
                      U,
                      {
                        chainId: r.icon,
                        size: "sm",
                        className: "w-5 h-5"
                      }
                    ),
                    /* @__PURE__ */ e("span", { className: "ml-2", children: r.name }),
                    d.id === r.id && /* @__PURE__ */ e(
                      "span",
                      {
                        className: `ml-auto ${t === "dark" ? "text-white" : "text-gray-900"}`,
                        children: "•"
                      }
                    )
                  ]
                },
                r.id
              ))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: f ? void 0 : "mb-4", children: [
        /* @__PURE__ */ e(
          "label",
          {
            className: `block text-sm font-medium mb-1 ${t === "dark" ? "text-gray-300" : "text-gray-700"}`,
            children: "Receive Token"
          }
        ),
        f ? /* @__PURE__ */ a("div", { className: "flex items-center px-2 py-1", children: [
          /* @__PURE__ */ e(
            k,
            {
              symbol: n.symbol,
              src: n.imageUrl,
              size: "sm"
            }
          ),
          /* @__PURE__ */ a(
            "span",
            {
              className: `ml-2 ${t === "dark" ? "text-white" : "text-gray-900"}`,
              children: [
                n.name,
                " (",
                n.symbol,
                ")"
              ]
            }
          )
        ] }) : /* @__PURE__ */ a("div", { className: "relative", ref: O, children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              onClick: () => T(!I),
              className: `w-full flex items-center px-4 py-3 border rounded-[24px] hover:border-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${t === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`,
              children: [
                /* @__PURE__ */ e(
                  "div",
                  {
                    className: `w-5 h-5 rounded-full flex items-center justify-center text-sm ${t === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
                    children: /* @__PURE__ */ e(
                      k,
                      {
                        symbol: n.symbol,
                        src: n.imageUrl,
                        size: "sm"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ a("span", { className: "ml-2 flex-1 text-left", children: [
                  n.name,
                  " (",
                  n.symbol,
                  ")"
                ] }),
                /* @__PURE__ */ e(
                  oe,
                  {
                    className: `h-5 w-5 text-gray-400 transition-transform ${I ? "transform rotate-180" : ""}`
                  }
                )
              ]
            }
          ),
          I && /* @__PURE__ */ e(
            "div",
            {
              className: `absolute z-10 w-full mt-1 border rounded-[24px] shadow-lg ${t === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
              children: w.map((r) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    K(r), T(!1);
                  },
                  className: `w-full flex items-center px-4 py-3 cursor-pointer ${t === "dark" ? n.symbol === r.symbol ? "bg-gray-700 text-white" : "text-white hover:bg-gray-700" : n.symbol === r.symbol ? "bg-gray-100 text-gray-900" : "text-gray-900 hover:bg-gray-50"}`,
                  children: [
                    /* @__PURE__ */ e(
                      "div",
                      {
                        className: `w-5 h-5 rounded-full flex items-center justify-center text-sm ${t === "dark" ? "bg-gray-700" : "bg-gray-100"}`,
                        children: /* @__PURE__ */ e(
                          k,
                          {
                            symbol: r.symbol,
                            src: r.imageUrl,
                            size: "sm"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ a("span", { className: "ml-2", children: [
                      r.name,
                      " (",
                      r.symbol,
                      ")"
                    ] }),
                    n.symbol === r.symbol && /* @__PURE__ */ e(
                      "span",
                      {
                        className: `ml-auto ${t === "dark" ? "text-white" : "text-gray-900"}`,
                        children: "•"
                      }
                    )
                  ]
                },
                r.symbol
              ))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: u ? void 0 : "mb-2", children: [
        /* @__PURE__ */ e(
          "label",
          {
            className: `block text-sm font-medium mb-1 ${t === "dark" ? "text-gray-300" : "text-gray-700"}`,
            children: "Amount to Receive"
          }
        ),
        u ? /* @__PURE__ */ a("div", { className: "flex items-center justify-between px-2 py-1", children: [
          /* @__PURE__ */ a(
            "span",
            {
              className: `${t === "dark" ? "text-white" : "text-gray-900"}`,
              children: [
                u,
                " ",
                n.symbol
              ]
            }
          ),
          /* @__PURE__ */ a(
            "span",
            {
              className: `text-sm ${t === "dark" ? "text-gray-400" : "text-gray-500"}`,
              children: [
                "≈ ",
                X
              ]
            }
          )
        ] }) : /* @__PURE__ */ a(ae, { children: [
          /* @__PURE__ */ a("div", { className: "relative rounded-lg", children: [
            /* @__PURE__ */ e(
              "input",
              {
                id: "amount",
                type: "text",
                value: o,
                onChange: (r) => H(r.target.value),
                placeholder: "0.00",
                className: `block w-full pl-4 pr-12 py-3 border rounded-[24px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${t === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"}`
              }
            ),
            /* @__PURE__ */ e("div", { className: "absolute inset-y-0 right-0 flex items-center pr-4", children: /* @__PURE__ */ e(
              "span",
              {
                className: t === "dark" ? "text-gray-400" : "text-gray-500",
                children: n.symbol
              }
            ) })
          ] }),
          /* @__PURE__ */ e("div", { className: "h-6 mt-1", children: o && n.symbol && /* @__PURE__ */ a(
            "div",
            {
              className: `text-sm ${t === "dark" ? "text-gray-400" : "text-gray-500"}`,
              children: [
                "≈ ",
                X
              ]
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ a("div", { className: x ? void 0 : "mb-4", children: [
        /* @__PURE__ */ a("div", { className: "flex justify-between items-center mb-1", children: [
          /* @__PURE__ */ a("div", { children: [
            /* @__PURE__ */ e(
              "label",
              {
                className: `text-sm font-medium ${t === "dark" ? "text-gray-300" : "text-gray-700"}`,
                children: y ? "Destination Address" : "Recipient Address"
              }
            ),
            c && ie(c) && c.toLowerCase() === g.address.toLowerCase() && /* @__PURE__ */ e(
              "div",
              {
                className: `text-xs mt-0.5 ${t === "dark" ? "text-gray-400" : "text-gray-500"}`,
                children: "Same as sender"
              }
            )
          ] }),
          /* @__PURE__ */ e("div", { className: "h-7 flex items-center", children: !x && c !== g.address ? /* @__PURE__ */ e(
            "button",
            {
              onClick: (r) => {
                r.preventDefault(), _(g.address), A(g.address);
              },
              className: "px-2 py-1 text-xs cursor-pointer rounded-[24px] transition-colors bg-blue-500 hover:bg-blue-600 text-white",
              children: "Use Account"
            }
          ) : null })
        ] }),
        x ? /* @__PURE__ */ e("div", { className: "px-2 py-1 font-mono text-sm", children: /* @__PURE__ */ e(
          "span",
          {
            className: `break-all ${t === "dark" ? "text-white" : "text-gray-900"}`,
            children: c
          }
        ) }) : /* @__PURE__ */ a(ae, { children: [
          /* @__PURE__ */ e(
            "input",
            {
              id: "recipient",
              type: "text",
              value: b,
              onChange: he,
              placeholder: "0x... or name.eth",
              className: `block w-full px-4 py-3 border rounded-[24px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${t === "dark" ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"}`
            }
          ),
          N && /* @__PURE__ */ e(
            "p",
            {
              className: t === "dark" ? "text-sm text-gray-400" : "text-sm text-gray-500",
              children: c
            }
          )
        ] })
      ] }),
      y && /* @__PURE__ */ e("div", { className: "px-2 py-1", children: /* @__PURE__ */ e(
        "p",
        {
          className: `text-xs ${t === "dark" ? "text-gray-300" : "text-gray-600"}`,
          children: "This transaction includes custom calldata for contract interaction at the destination address"
        }
      ) }),
      /* @__PURE__ */ e(
        je,
        {
          options: Me,
          selectedOption: Ne,
          onSelect: ve,
          theme: t
        }
      ),
      /* @__PURE__ */ a("div", { className: "flex flex-col space-y-3 pt-2", children: [
        M && /* @__PURE__ */ e(
          "div",
          {
            className: `px-3 py-2 rounded-lg max-h-80 overflow-y-auto ${t === "dark" ? "bg-red-900/20" : "bg-red-50"}`,
            children: /* @__PURE__ */ e(
              "p",
              {
                className: `text-sm break-words ${t === "dark" ? "text-red-200" : "text-red-600"}`,
                children: M
              }
            )
          }
        ),
        /* @__PURE__ */ e(
          "button",
          {
            type: "submit",
            disabled: !o || !P || $,
            className: `w-full font-semibold py-3 px-4 rounded-[24px] transition-colors relative ${t === "dark" ? "bg-blue-600 disabled:bg-gray-700 text-white disabled:text-gray-400 enabled:hover:bg-blue-700" : "bg-blue-500 disabled:bg-gray-300 text-white disabled:text-gray-500 enabled:hover:bg-blue-600"} disabled:cursor-not-allowed cursor-pointer`,
            children: $ ? /* @__PURE__ */ a("div", { className: "flex items-center justify-center", children: [
              /* @__PURE__ */ e(
                qe,
                {
                  className: `w-5 h-5 animate-spin mr-2 ${t === "dark" ? "text-gray-400" : "text-white"}`
                }
              ),
              /* @__PURE__ */ e("span", { children: Y })
            ] }) : Y
          }
        )
      ] })
    ] })
  ] });
}, Ke = `
  select {
    appearance: none;
    border: 1px solid #e5e7eb;
    outline: none;
    font-size: 1rem;
    width: 100%;
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    padding-right: 2rem;
    
    cursor: pointer;
    transition: all 0.2s;
  }

  select:hover {
    border-color: #d1d5db;
  }

  select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  select option {
    padding: 0.75rem 1rem;
    min-height: 3rem;
    display: flex;
    align-items: center;
    padding-left: 2.75rem;
    position: relative;
    cursor: pointer;
  }

  select option:hover {
    background-color: #f3f4f6;
  }

  select option:checked {
    background-color: #eff6ff;
    color: #1d4ed8;
  }
`;
if (typeof document < "u") {
  const s = document.createElement("style");
  s.textContent = Ke, document.head.appendChild(s);
}
export {
  gr as SendForm,
  gr as default
};
