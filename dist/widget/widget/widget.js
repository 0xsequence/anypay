import { jsx as t, jsxs as k } from "react/jsx-runtime";
import { SequenceHooksProvider as pe } from "../node_modules/.pnpm/@0xsequence_hooks@5.3.5_@0xsequence_api@packages_api_@0xsequence_indexer@2.3.17_@0xsequ_e66bd77d4f16d36ae26fac825ae408ab/node_modules/@0xsequence/hooks/dist/esm/contexts/ConfigContext.js";
import xe, { useContext as be, StrictMode as F, useState as a, useEffect as u } from "react";
import "@0xsequence/api";
import { QueryClient as ge } from "../node_modules/.pnpm/@tanstack_query-core@5.80.7/node_modules/@tanstack/query-core/build/modern/queryClient.js";
import { QueryClientProvider as ye } from "../node_modules/.pnpm/@tanstack_react-query@5.80.7_react@19.1.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js";
import "../node_modules/.pnpm/@0xsequence_network@2.3.17_ethers@6.14.3_bufferutil@4.0.9_utf-8-validate@5.0.10_/node_modules/@0xsequence/network/dist/0xsequence-network.esm.js";
import { custom as P, createWalletClient as z } from "viem";
import * as Y from "../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/index.js";
import { WagmiContext as ke, createConfig as we, WagmiProvider as Ce, useAccount as Se } from "wagmi";
import { ConnectWallet as ve } from "./components/ConnectWallet.js";
import { DebugScreensDropdown as Te } from "./components/DebugScreensDropdown.js";
import Ue from "./components/Modal.js";
import { Receipt as Ie } from "./components/Receipt.js";
import { SendForm as He } from "./components/SendForm.js";
import { TokenList as Ae } from "./components/TokenList.js";
import { TransferPending as Me } from "./components/TransferPending.js";
/* empty css                                                                                                                                                                                                   */
/* empty css          */
import { useIndexerGatewayClient as Ne } from "../indexerClient.js";
import { mainnet as De } from "../node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/definitions/mainnet.js";
import { motion as p } from "../node_modules/.pnpm/motion@12.17.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/motion/dist/es/framer-motion/dist/es/render/components/motion/proxy.js";
import { AnimatePresence as J } from "../node_modules/.pnpm/motion@12.17.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/motion/dist/es/framer-motion/dist/es/components/AnimatePresence/index.js";
const V = (n) => {
  for (const l of Object.values(Y))
    if (l.id === n)
      return l;
  throw new Error(`Unsupported chain ID: ${n}`);
}, Ee = new ge(), Pe = () => typeof window > "u" ? "light" : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light", X = (n) => n === "auto" ? Pe() : n, je = ({
  sequenceApiKey: n,
  indexerUrl: l,
  apiUrl: w,
  env: x,
  toRecipient: C,
  toAmount: S,
  toChainId: j,
  toToken: Z,
  toCalldata: ee,
  provider: v,
  children: R,
  renderInline: te = !0,
  theme: h = "auto",
  walletOptions: ne,
  onOriginConfirmation: T,
  onDestinationConfirmation: U
}) => {
  const { address: f, isConnected: d, chainId: I } = Se(), [o, H] = a(X(h)), [W, re] = a(h), [$, A] = a(!1), [M, r] = a(
    d ? "tokens" : "connect"
  ), [O, s] = a(null), [N, ce] = a(""), [b, g] = a(""), [oe, y] = a(
    null
  ), [i, B] = a(null), [q, D] = a(null), [ae, m] = a([]);
  u(() => {
    if (W !== "auto") return;
    const e = window.matchMedia("(prefers-color-scheme: dark)"), c = (E) => {
      H(E.matches ? "dark" : "light");
    };
    return H(e.matches ? "dark" : "light"), e.addEventListener("change", c), () => e.removeEventListener("change", c);
  }, [W]), u(() => {
    re(h), H(X(h));
  }, [h]), u(() => {
    if (v && f && I) {
      const e = V(I), c = z({
        account: f,
        chain: e,
        transport: P(v)
      });
      B(c);
    }
  }, [v, f, I]), u(() => {
    d && r("tokens");
  }, [d]);
  const se = Ne({
    indexerGatewayUrl: l,
    projectAccessKey: n
  }), ie = () => {
    i && !d ? (async () => await i.request({ method: "eth_requestAccounts" }))() : d && r("tokens");
  }, le = (e) => {
    try {
      if (D(null), window.ethereum && f) {
        const c = V(e.chainId), E = z({
          account: f,
          chain: c,
          transport: P(window.ethereum)
        });
        B(E);
      }
      s(e), r("send");
    } catch (c) {
      D(c instanceof Error ? c.message : "An unknown error occurred");
    }
  }, de = async (e, c) => {
    console.log("handleOnSend", e, c);
  }, me = () => {
    r("tokens"), G();
  };
  function G() {
    r("connect"), s(null), g(""), y(null), m([]);
  }
  const L = () => {
    A(!1), G();
  }, Q = () => {
    switch (M) {
      case "tokens":
        r("connect");
        break;
      case "send":
        r("tokens"), s(null);
        break;
      case "receipt":
        r("tokens"), s(null), g(""), y(null);
        break;
    }
  };
  u(() => {
    T && N && T(N);
  }, [N, T]), u(() => {
    U && b && U(b);
  }, [b, U]);
  function _(e) {
    var c;
    e && (e.originUserTxReceipt && ce(e.originUserTxReceipt.transactionHash), (e.destinationMetaTxnReceipt || e.originUserTxReceipt) && g(
      ((c = e.destinationMetaTxnReceipt) == null ? void 0 : c.txnHash) || e.originUserTxReceipt.transactionHash
    ), e.destinationChainId && y(e.destinationChainId), r("receipt"));
  }
  function ue(e) {
    console.log("transactionStates from widget", e), m([...e]);
  }
  const he = (e) => {
    switch (D(null), e.toLowerCase()) {
      case "connect":
        r("connect"), s(null), m([]);
        break;
      case "tokens":
        d && (r("tokens"), s(null), m([]));
        break;
      case "send":
        s({
          id: 1,
          name: "USD Coin",
          symbol: "USDC",
          balance: "1000000000",
          imageUrl: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
          chainId: 1,
          contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          contractInfo: {
            decimals: 6,
            symbol: "USDC",
            name: "USD Coin"
          }
        }), r("send"), m([]);
        break;
      case "pending":
        m([
          {
            transactionHash: "0x45bb2259631e73f32841a6058b0a4008c75bca296942bec6326d188978d5353d",
            explorerUrl: "https://polygonscan.com/tx/0x45bb2259631e73f32841a6058b0a4008c75bca296942bec6326d188978d5353d",
            chainId: 137,
            state: "confirmed"
          },
          {
            transactionHash: "0x6ff30196ca0d4998cc6928bca2ec282766eb3c3997535e0a61e0d69c9c9b16b8",
            explorerUrl: "https://polygonscan.com/tx/0x6ff30196ca0d4998cc6928bca2ec282766eb3c3997535e0a61e0d69c9c9b16b8",
            chainId: 137,
            state: "confirmed"
          },
          {
            transactionHash: "0xf3b172111d2e64e9d4940d91097f04a0bbd0acc816e2cf49eec664c6f8fcaf76",
            explorerUrl: "https://arbiscan.io/tx/0xf3b172111d2e64e9d4940d91097f04a0bbd0acc816e2cf49eec664c6f8fcaf76",
            chainId: 42161,
            state: "pending"
          }
        ]), r("pending");
        break;
      case "receipt":
        g(
          "0xf3b172111d2e64e9d4940d91097f04a0bbd0acc816e2cf49eec664c6f8fcaf76"
        ), y(42161), r("receipt");
        break;
    }
  }, fe = () => {
    switch (M) {
      case "connect":
        return /* @__PURE__ */ t(
          ve,
          {
            onConnect: ie,
            theme: o,
            walletOptions: ne
          }
        );
      case "tokens":
        return /* @__PURE__ */ t(
          Ae,
          {
            onContinue: le,
            onBack: Q,
            indexerGatewayClient: se,
            theme: o
          }
        );
      case "send":
        return O && (i != null && i.account) ? /* @__PURE__ */ t(
          He,
          {
            onSend: de,
            onBack: Q,
            onConfirm: () => r("pending"),
            onComplete: _,
            selectedToken: O,
            account: i.account,
            sequenceApiKey: n,
            apiUrl: w,
            env: x,
            toRecipient: C,
            toAmount: S,
            toChainId: j ? Number(j) : void 0,
            toToken: Z,
            toCalldata: ee,
            walletClient: i,
            theme: o,
            onTransactionStateChange: ue
          }
        ) : null;
      case "pending":
        return /* @__PURE__ */ t(
          Me,
          {
            onComplete: _,
            theme: o,
            transactionStates: ae
          }
        );
      case "receipt":
        return /* @__PURE__ */ t(
          Ie,
          {
            onSendAnother: me,
            onClose: L,
            txHash: b,
            chainId: oe,
            theme: o
          }
        );
      default:
        return null;
    }
  }, K = () => /* @__PURE__ */ k(
    p.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 1
      },
      className: `flex flex-col min-h-[400px] rounded-[32px] shadow-xl p-6 relative w-[400px] mx-auto ${o === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`,
      layout: !0,
      layoutId: "modal-container",
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ t(J, { mode: "wait", children: /* @__PURE__ */ k(
          p.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.6
            },
            className: "flex-1 flex flex-col w-full",
            layout: !0,
            children: [
              fe(),
              q && /* @__PURE__ */ t(
                "div",
                {
                  className: `border rounded-lg p-4 mt-4 ${o === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`,
                  children: /* @__PURE__ */ t(
                    "p",
                    {
                      className: `text-sm break-words ${o === "dark" ? "text-red-200" : "text-red-600"}`,
                      children: q
                    }
                  )
                }
              )
            ]
          },
          M
        ) }),
        /* @__PURE__ */ k(
          p.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.15 },
            className: `mt-auto pt-4 text-center text-sm relative flex items-center justify-center ${o === "dark" ? "text-gray-400" : "text-gray-500"}`,
            layout: !0,
            children: [
              /* @__PURE__ */ t("div", { className: "absolute right-0 flex items-center h-full", children: /* @__PURE__ */ t(
                Te,
                {
                  onScreenSelect: he,
                  theme: o
                }
              ) }),
              "Powered by",
              " ",
              /* @__PURE__ */ t(
                "a",
                {
                  href: "https://anypay.pages.dev/",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: `font-medium transition-colors hover:underline ${o === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`,
                  children: "AnyPay"
                }
              )
            ]
          }
        )
      ]
    }
  );
  return te ? K() : /* @__PURE__ */ k("div", { className: "flex flex-col items-center justify-center space-y-8 py-12", children: [
    R ? /* @__PURE__ */ t(
      p.div,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: "flex flex-col items-center justify-center",
        onClick: () => A(!0),
        children: R
      }
    ) : /* @__PURE__ */ t(
      p.button,
      {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        onClick: () => A(!0),
        className: `${o === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white cursor-pointer font-semibold py-3 px-6 rounded-[24px] shadow-sm transition-colors`,
        children: "Pay"
      }
    ),
    /* @__PURE__ */ t(J, { children: $ && /* @__PURE__ */ t(Ue, { isOpen: $, onClose: L, theme: o, children: K() }) })
  ] });
}, ct = (n) => {
  const l = be(ke), w = xe.useMemo(
    () => we({
      chains: [De],
      transports: Object.values(Y).reduce(
        (C, S) => ({
          ...C,
          [S.id]: P(n.provider)
        }),
        {}
      )
    }),
    [n.provider]
  ), x = /* @__PURE__ */ t(ye, { client: Ee, children: /* @__PURE__ */ t(
    pe,
    {
      config: {
        projectAccessKey: n.sequenceApiKey,
        env: {
          indexerUrl: n.indexerUrl,
          indexerGatewayUrl: n.indexerUrl,
          apiUrl: n.apiUrl
        }
      },
      children: /* @__PURE__ */ t(je, { ...n })
    }
  ) });
  return l ? /* @__PURE__ */ t(F, { children: x }) : /* @__PURE__ */ t(F, { children: /* @__PURE__ */ t(Ce, { config: w, children: x }) });
};
export {
  ct as AnyPayWidget,
  ct as default
};
