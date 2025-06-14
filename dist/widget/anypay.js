import { useQuery as be } from "./node_modules/.pnpm/@tanstack_react-query@5.80.7_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useQuery.js";
import { useMutation as _n } from "./node_modules/.pnpm/@tanstack_react-query@5.80.7_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useMutation.js";
import { useState as h, useCallback as Vn, useEffect as X, useMemo as Kn, useRef as Se } from "react";
import { zeroAddress as D, isAddressEqual as Ln, createPublicClient as Gn, http as Wn, createWalletClient as zn, custom as Qn } from "viem";
import * as xe from "./node_modules/.pnpm/viem@2.31.0_bufferutil@4.0.9_typescript@5.8.3_utf-8-validate@5.0.10_zod@3.25.63/node_modules/viem/_esm/chains/index.js";
import { useSwitchChain as ke, useSendTransaction as Ce, useEstimateGas as He, useWaitForTransactionReceipt as $e } from "wagmi";
import { useAPIClient as Me } from "./apiClient.js";
import { getERC20TransferData as On } from "./encoders.js";
import { calculateIntentAddress as Tn, sendOriginTransaction as Yn, getIntentCallsPayloads as ee, commitIntentConfig as Ne } from "./intents.js";
import { useMetaTxnsMonitor as Fe, getMetaTxStatus as Jn } from "./metaTxnMonitor.js";
import { relayerSendMetaTx as Xn } from "./metaTxns.js";
import { findFirstPreconditionForChainId as Pe, findPreconditionAddress as Zn } from "./preconditions.js";
import { useRelayers as Be } from "./relayer.js";
import { getChainInfo as $n } from "./tokenBalances.js";
import { requestWithTimeout as Oe } from "./utils.js";
import { from as Hn } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/Address.js";
const ne = 1e4;
function Ze(_) {
  const {
    account: s,
    disableAutoExecute: d = !1,
    env: u,
    useV3Relayers: mn = !0,
    sequenceApiKey: U
  } = _, b = Me({ projectAccessKey: U }), [T, F] = h(!d), [En, gn] = h(!1), [S, rn] = h(
    {}
  ), [f, L] = h(null), [v, P] = h(null), [w, q] = h(null), [C, Z] = h(null), [bn, G] = h(null), [H, Mn] = h(), [cn, nn] = h(null), [t, m] = h(null), [Nn, Sn] = h({}), [ln, dn] = h(!1), [B, y] = h(!1), {
    switchChain: A,
    isPending: In,
    error: W
  } = ke(), { sendTransaction: $, isPending: g } = Ce(), [M, x] = h(!1), [c, k] = h(null), [qn, V] = h(null), [pn, en] = h({}), [j, K] = h(null), { getRelayer: wn } = Be({
    env: u,
    useV3Relayers: mn
  }), {
    data: un,
    isError: r,
    error: p
  } = He(
    t != null && t.to && (t != null && t.chainId) && !t.error ? {
      to: t.to || void 0,
      data: t.data || void 0,
      value: t.value || void 0,
      chainId: t.chainId || void 0
    } : void 0
  ), a = _n({
    mutationFn: async (n) => {
      if (!b) throw new Error("API client not available");
      if (!n.lifiInfos) throw new Error("LifiInfos not available");
      try {
        console.log("Calculating intent address..."), console.log("Main signer:", n.mainSigner), console.log("Calls:", n.calls), console.log("LifiInfos:", n.lifiInfos);
        const e = Tn(
          n.mainSigner,
          n.calls,
          // TODO: Add proper type
          n.lifiInfos
          // TODO: Add proper type
        ), o = Zn(n.preconditions);
        console.log("Calculated address:", e.toString()), console.log("Received address:", o);
        const l = Ln(
          Hn(o),
          e
        );
        if (K({
          success: l,
          receivedAddress: o,
          calculatedAddress: e.toString()
        }), !l)
          throw new Error(
            "Address verification failed: Calculated address does not match received address."
          );
        const i = await b.commitIntentConfig({
          walletAddress: e.toString(),
          mainSigner: n.mainSigner,
          calls: n.calls,
          preconditions: n.preconditions,
          lifiInfos: n.lifiInfos
        });
        return console.log("API Commit Response:", i), { calculatedAddress: e.toString(), response: i };
      } catch (e) {
        if (console.error("Error during commit intent mutation:", e), !(j != null && j.success) && !(j != null && j.receivedAddress))
          try {
            const o = Tn(
              n.mainSigner,
              n.calls,
              // TODO: Add proper type
              n.lifiInfos
              // TODO: Add proper type
            ), l = Zn(n.preconditions);
            K({
              success: !1,
              receivedAddress: l,
              calculatedAddress: o.toString()
            });
          } catch (o) {
            console.error(
              "Error calculating addresses for verification status on failure:",
              o
            ), K({ success: !1 });
          }
        throw e;
      }
    },
    onSuccess: (n) => {
      console.log(
        "Intent config committed successfully, Wallet Address:",
        n.calculatedAddress
      ), nn(n.calculatedAddress);
    },
    onError: (n) => {
      console.error("Failed to commit intent config:", n), nn(null);
    }
  }), {
    data: tn,
    isLoading: Fn,
    error: z
  } = be({
    queryKey: ["getIntentConfig", cn],
    queryFn: async () => {
      if (!b || !cn)
        throw new Error("API client or committed intent address not available");
      return console.log("Fetching intent config for address:", cn), await b.getIntentConfig({
        walletAddress: cn
      });
    },
    enabled: !!cn && !!b && a.isSuccess,
    staleTime: 1e3 * 60 * 5,
    // 5 minutes
    retry: 1
  });
  async function fn(n) {
    return ee(b, n);
  }
  const on = _n({
    mutationFn: async (n) => {
      if (n.originChainId === n.destinationChainId && Ln(
        Hn(n.originTokenAddress),
        Hn(n.destinationTokenAddress)
      ))
        throw new Error(
          "The same token cannot be used as both the source and destination token."
        );
      if (!s.address)
        throw new Error("Missing selected token or account address");
      nn(null), K(null), G(null), L(null), P(null), q(null), Z(null);
      const e = await fn(n);
      return L(e.metaTxns), P(e.calls), q(e.preconditions), Z(e.lifiInfos), G(e.anypayFee), nn(null), K(null), e;
    },
    onSuccess: (n) => {
      console.log("Intent Config Success:", n), G(n.anypayFee || null), Z(n.lifiInfos || null), n != null && n.calls && n.calls.length > 0 && n.preconditions && n.preconditions.length > 0 && n.metaTxns && n.metaTxns.length > 0 ? (P(n.calls), q(n.preconditions), L(n.metaTxns)) : (console.warn("API returned success but no operations found."), P(null), q(null), L(null));
    },
    onError: (n) => {
      console.error("Intent Config Error:", n), P(null), q(null), L(null), Z(null), G(null);
    }
  });
  function te(n) {
    on.mutate(n);
  }
  const oe = Vn(() => {
    console.log("[AnyPay] Clearing intent state"), P(null), q(null), L(null), Z(null), G(null), nn(null), K(null), Sn({}), gn(!1), en({});
  }, []), Q = Vn(
    (n, e, o, l, i) => {
      k({
        txnHash: n,
        status: e === "success" ? "Success" : e === "reverted" ? "Failed" : e === "sending" ? "Sending..." : "Pending",
        revertReason: e === "reverted" ? i || "Transaction reverted" : void 0,
        gasUsed: o ? Number(o) : void 0,
        effectiveGasPrice: l == null ? void 0 : l.toString()
      });
    },
    []
  ), se = async () => {
    if (console.log("Sending origin transaction..."), console.log(
      ln,
      t,
      t == null ? void 0 : t.error,
      t == null ? void 0 : t.to,
      t == null ? void 0 : t.data,
      t == null ? void 0 : t.value,
      t == null ? void 0 : t.chainId
    ), ln || // Prevent duplicate transactions
    !t || t.error || !t.to || t.data === null || t.value === null || t.chainId === null) {
      console.error(
        "Origin call parameters not available or invalid:",
        t
      ), Q(
        void 0,
        "reverted",
        void 0,
        void 0,
        "Origin call parameters not ready"
      );
      return;
    }
    if (s.chainId !== t.chainId) {
      y(!0), Q(
        void 0,
        "pending",
        void 0,
        void 0,
        `Switching to chain ${t.chainId}...`
      );
      const n = zn({
        chain: $n(t.chainId),
        transport: Qn(await s.connector.getProvider())
        // TODO: Add proper type
      });
      try {
        await Un(n, t.chainId), y(!1);
      } catch (e) {
        console.error("Chain switch failed:", e), e instanceof Error && e.message.includes("User rejected") && F(!1), Q(
          void 0,
          "reverted",
          void 0,
          void 0,
          e instanceof Error ? e.message : "Unknown error switching chain"
        ), y(!1);
        return;
      }
    }
    if (ln)
      console.warn(
        "Transaction already in progress. Skipping duplicate request."
      );
    else {
      if (dn(!0), Mn(void 0), Q(void 0, "sending"), !un && !r) {
        x(!0);
        return;
      }
      if (r) {
        console.error("Gas estimation failed:", p), Q(
          void 0,
          "reverted",
          void 0,
          void 0,
          `Gas estimation failed: ${p == null ? void 0 : p.message}`
        ), dn(!1);
        return;
      }
      const n = un ? BigInt(Math.floor(Number(un) * 1.2)) : void 0;
      $(
        {
          to: t.to,
          data: t.data,
          value: t.value,
          chainId: t.chainId,
          gas: n
        },
        {
          onSuccess: (e) => {
            console.log("Transaction sent, hash:", e), Mn(e), dn(!1);
          },
          onError: (e) => {
            console.error("Transaction failed:", e), e instanceof Error && (e.message.includes("User rejected") || e.message.includes("user rejected")) && F(!1), Q(
              void 0,
              "reverted",
              void 0,
              void 0,
              e instanceof Error ? e.message : "Unknown error"
            ), dn(!1);
          }
        }
      );
    }
  };
  X(() => {
    W && (console.error("Chain switch error:", W), Q(
      void 0,
      "reverted",
      void 0,
      void 0,
      `Chain switch failed: ${W.message || "Unknown error"}`
    ), y(!1));
  }, [W, Q]), X(() => {
    x(!1);
  }, []), X(() => {
    t != null && t.chainId && s.chainId === t.chainId && (console.log("No chain switch required"), y(!1));
  }, [s.chainId, t == null ? void 0 : t.chainId]), X(() => {
    if (t != null && t.chainId && s.chainId !== t.chainId) {
      async function n() {
        try {
          const e = t.chainId, o = zn({
            chain: $n(e),
            transport: Qn(await s.connector.getProvider())
            // TODO: Add proper type
          });
          await Un(o, e);
        } catch (e) {
          console.error("Chain switch failed:", e);
        }
      }
      n().catch(console.error);
    }
  }, [s, t]);
  const {
    data: O,
    isLoading: yn,
    isSuccess: jn,
    isError: Rn,
    error: sn
  } = $e({
    hash: H,
    confirmations: 1,
    query: {
      enabled: !!H
    }
  });
  X(() => {
    var n;
    if (!H) {
      c != null && c.txnHash && k(null), V(null), Object.keys(S).length > 0 && rn({});
      return;
    }
    if (!((c == null ? void 0 : c.txnHash) === H && ((c == null ? void 0 : c.status) === "Success" || (c == null ? void 0 : c.status) === "Failed") && !yn)) {
      if (yn) {
        k((e) => ({
          ...(e == null ? void 0 : e.txnHash) === H ? e : {
            gasUsed: void 0,
            effectiveGasPrice: void 0,
            revertReason: void 0
          },
          txnHash: H,
          status: "Pending"
        }));
        return;
      }
      if (jn && O) {
        const e = O.status === "success" ? "Success" : "Failed";
        k({
          txnHash: O.transactionHash,
          status: e,
          gasUsed: O.gasUsed ? Number(O.gasUsed) : void 0,
          effectiveGasPrice: (n = O.effectiveGasPrice) == null ? void 0 : n.toString(),
          revertReason: O.status === "reverted" ? (sn == null ? void 0 : sn.message) || "Transaction reverted by receipt" : void 0
        }), e === "Success" && O.blockNumber ? (async () => {
          try {
            if (!(t != null && t.chainId)) {
              console.error(
                "[AnyPay] Origin chainId not available for fetching origin block timestamp."
              ), V(null);
              return;
            }
            const l = $n(t.chainId), E = await Gn({
              chain: l,
              transport: Wn()
            }).getBlock({
              blockNumber: BigInt(O.blockNumber)
            });
            V(Number(E.timestamp));
          } catch (l) {
            console.error(
              "[AnyPay] Error fetching origin block timestamp:",
              l
            ), V(null);
          }
        })() : e !== "Success" && V(null), e === "Success" && f && f.length > 0 && T && !f.some((o) => S[`${o.chainId}-${o.id}`]) && (console.log(
          "Origin transaction successful, auto-sending all meta transactions..."
        ), vn.mutate({ selectedId: null }));
      } else Rn && (k({
        txnHash: H,
        status: "Failed",
        revertReason: (sn == null ? void 0 : sn.message) || "Failed to get receipt",
        gasUsed: void 0,
        effectiveGasPrice: void 0
      }), V(null));
    }
  }, [
    H,
    yn,
    jn,
    Rn,
    O,
    sn,
    f,
    S,
    T,
    t == null ? void 0 : t.chainId,
    c == null ? void 0 : c.status,
    c == null ? void 0 : c.txnHash
  ]), X(() => {
    T && a.isSuccess && (t == null ? void 0 : t.chainId) && s.chainId === t.chainId && !t.error && t.to && t.data !== null && t.value !== null && !g && !yn && !H && !B && !c && !En && (console.log("Auto-executing transaction: All conditions met."), gn(!0), k({
      status: "Sending..."
    }), $(
      {
        to: t.to,
        data: t.data,
        value: t.value,
        chainId: t.chainId
      },
      {
        onSuccess: (e) => {
          console.log("Auto-executed transaction sent, hash:", e), Mn(e);
        },
        onError: (e) => {
          console.error("Auto-executed transaction failed:", e), e instanceof Error && (e.message.includes("User rejected") || e.message.includes("user rejected")) && F(!1), k({
            status: "Failed",
            revertReason: e instanceof Error ? e.message : "Unknown error"
          }), gn(!1);
        }
      }
    ));
  }, [
    T,
    a.isSuccess,
    t,
    s.chainId,
    g,
    yn,
    H,
    B,
    c,
    En,
    $
  ]), X(() => {
    T && v && w && C && s.address && Pn && !a.isPending && !a.isSuccess && (console.log("Auto-committing intent configuration..."), a.mutate({
      walletAddress: Pn.toString(),
      mainSigner: s.address,
      calls: v,
      preconditions: w,
      lifiInfos: C
    }));
  }, [
    T,
    v,
    w,
    C,
    // Add lifiInfos dependency
    s.address,
    a,
    a.isPending,
    a.isSuccess
  ]);
  const vn = _n({
    mutationFn: async ({ selectedId: n }) => {
      if (!v || !w || !f || !s.address || !C)
        throw new Error("Missing required data for meta-transaction");
      const e = Tn(
        s.address,
        v,
        C
      ), o = n ? [f.find((i) => i.id === n)] : f;
      if (!o || n && !o[0])
        throw new Error("Meta transaction not found");
      const l = [];
      for (const i of o) {
        if (!i) continue;
        const E = `${i.chainId}-${i.id}`, Y = S[E], J = Date.now();
        if (Y && J - Y < ne) {
          const I = Math.ceil(
            (ne - (J - Y)) / 1e3
          );
          console.log(
            `Meta transaction for ${E} was sent recently. Wait ${I}s before retry`
          );
          continue;
        }
        try {
          const I = parseInt(i.chainId);
          if (Number.isNaN(I) || I <= 0)
            throw new Error(`Invalid chainId for meta transaction: ${I}`);
          const An = wn(I);
          if (!An)
            throw new Error(`No relayer found for chainId: ${I}`);
          const N = w.filter(
            (Cn) => Cn.chainId && parseInt(Cn.chainId) === I
          );
          console.log(
            `Relaying meta transaction ${E} to intent ${e} via relayer:`,
            An
          );
          const { opHash: hn } = await An.sendMetaTxn(
            i.walletAddress,
            i.contract,
            i.input,
            BigInt(i.chainId),
            void 0,
            N
          ), R = !1;
          l.push({
            operationKey: E,
            opHash: hn,
            success: !0
          });
        } catch (I) {
          l.push({
            operationKey: E,
            error: I instanceof Error ? I.message : "Unknown error",
            success: !1
          });
        }
      }
      return l;
    },
    onSuccess: (n) => {
      n.forEach(({ operationKey: e, opHash: o, success: l }) => {
        l && o && (rn((i) => ({
          ...i,
          [e]: Date.now()
        })), Sn((i) => ({
          ...i,
          [e]: o
        })));
      });
    },
    onError: (n) => {
      console.error("Error in meta-transaction process:", n);
    },
    retry: 5,
    // Allow up to 2 retries
    retryDelay: (n) => Math.min(1e3 * 2 ** n, 3e4)
    // Exponential backoff
  }), [xn, ie] = h(null), [kn, ae] = h(null);
  X(() => {
    var n, e, o, l;
    if (!((n = v == null ? void 0 : v[0]) != null && n.chainId) || !xn || !kn || !w || !s.address) {
      m(null);
      return;
    }
    try {
      const i = Pn;
      let E, Y = "0x", J = 0n;
      const I = i;
      if (xn === D) {
        const N = w.find(
          (R) => (R.type === "transfer-native" || R.type === "native-balance") && R.chainId === kn.toString()
        ), hn = ((e = N == null ? void 0 : N.data) == null ? void 0 : e.minAmount) ?? ((o = N == null ? void 0 : N.data) == null ? void 0 : o.min);
        if (hn === void 0)
          throw new Error(
            "Could not find native precondition (transfer-native or native-balance) or min amount"
          );
        J = BigInt(hn), E = I;
      } else {
        const N = w.find(
          (R) => {
            var Cn;
            return R.type === "erc20-balance" && R.chainId === kn.toString() && ((Cn = R.data) == null ? void 0 : Cn.token) && Ln(
              Hn(R.data.token),
              Hn(xn)
            );
          }
        ), hn = (l = N == null ? void 0 : N.data) == null ? void 0 : l.min;
        if (hn === void 0)
          throw new Error(
            "Could not find ERC20 balance precondition or min amount"
          );
        Y = On(I, hn), E = xn;
      }
      m({
        to: E,
        data: Y,
        value: J,
        chainId: kn,
        error: void 0
      });
    } catch (i) {
      console.error("Failed to calculate origin call params for UI:", i), m({
        to: null,
        data: null,
        value: null,
        chainId: null,
        error: i instanceof Error ? i.message : "Unknown error"
      });
    }
  }, [
    v,
    xn,
    kn,
    w,
    s.address
  ]);
  const an = Fe(
    f,
    wn
  );
  Kn(() => !f || Object.keys(an).length === 0 ? "no_statuses" : f.map((e) => `${e.chainId}-${e.id}`).sort().map((e) => {
    const o = an[e];
    return `${e}:${o ? o.status : "loading"}`;
  }).join(","), [f, an]);
  const Dn = Se(/* @__PURE__ */ new Set());
  X(() => {
    if (console.log("[AnyPay] Running meta-transaction block timestamp effect:", {
      metaTxnsLength: f == null ? void 0 : f.length,
      monitorStatusesLength: Object.keys(an).length
    }), !f || f.length === 0) {
      console.log("[AnyPay] No meta transactions, clearing timestamps"), Dn.current.clear(), Object.keys(pn).length > 0 && en({});
      return;
    }
    if (!Object.keys(an).length) {
      console.log("[AnyPay] No monitor statuses yet, waiting...");
      return;
    }
    f.forEach(async (n) => {
      const e = `${n.chainId}-${n.id}`;
      if (Dn.current.has(e)) {
        console.log(
          `[AnyPay] MetaTxn ${e}: Already processed, skipping`
        );
        return;
      }
      const o = an[e];
      if (!o || o.status !== "confirmed") {
        console.log(
          `[AnyPay] MetaTxn ${e}: Status not confirmed, skipping`
        );
        return;
      }
      const l = o.transactionHash;
      if (!l) {
        console.log(
          `[AnyPay] MetaTxn ${e}: No transaction hash, skipping`
        );
        return;
      }
      console.log(
        `[AnyPay] MetaTxn ${e}: Processing transaction ${l}`
      ), Dn.current.add(e);
      try {
        const i = parseInt(n.chainId);
        if (Number.isNaN(i) || i <= 0)
          throw new Error(
            `Invalid chainId for meta transaction: ${n.chainId}`
          );
        const E = $n(i), Y = Gn({
          chain: E,
          transport: Wn()
        }), J = await Y.getTransactionReceipt({
          hash: l
        });
        if (J && typeof J.blockNumber == "bigint") {
          const I = await Y.getBlock({
            blockNumber: J.blockNumber
          });
          console.log(
            `[AnyPay] MetaTxn ${e}: Got block timestamp ${I.timestamp}`
          ), en((An) => ({
            ...An,
            [e]: {
              timestamp: Number(I.timestamp),
              error: void 0
            }
          }));
        } else
          console.warn(
            `[AnyPay] MetaTxn ${e}: No block number in receipt`
          ), en((I) => ({
            ...I,
            [e]: {
              timestamp: null,
              error: "Block number not found in receipt"
            }
          }));
      } catch (i) {
        console.error(`[AnyPay] MetaTxn ${e}: Error:`, i), en((E) => ({
          ...E,
          [e]: {
            timestamp: null,
            error: i.message || "Failed to fetch receipt/timestamp"
          }
        }));
      }
    });
  }, [f, an, pn]);
  const re = (n) => {
    F(n);
  };
  function ce(n) {
    on.mutate(n);
  }
  const Pn = Kn(() => !s.address || !v || !C ? null : Tn(
    s.address,
    v,
    C
  ), [s.address, v, C]), le = on.isPending, de = on.isSuccess, ue = on.error, fe = on.variables;
  function he(n) {
    console.log("commitIntentConfig", n), a.mutate(n);
  }
  function me(n) {
    if (!n) {
      m(null);
      return;
    }
    const { originChainId: e, tokenAddress: o } = n;
    ae(e), ie(o);
  }
  function ge(n) {
    vn.mutate({ selectedId: n });
  }
  const Ie = a.isPending, pe = a.isSuccess, we = a.error, ye = a.variables, ve = vn.isPending, Ae = vn.isSuccess, Te = vn.error, Ee = vn.variables;
  return {
    apiClient: b,
    metaTxns: f,
    intentCallsPayloads: v,
    intentPreconditions: w,
    lifiInfos: C,
    anypayFee: bn,
    txnHash: H,
    committedIntentAddress: cn,
    verificationStatus: j,
    getRelayer: wn,
    estimatedGas: un,
    isEstimateError: r,
    estimateError: p,
    calculateIntentAddress: Tn,
    committedIntentConfig: tn,
    isLoadingCommittedConfig: Fn,
    committedConfigError: z,
    commitIntentConfig: he,
    commitIntentConfigPending: Ie,
    commitIntentConfigSuccess: pe,
    commitIntentConfigError: we,
    commitIntentConfigArgs: ye,
    getIntentCallsPayloads: fn,
    operationHashes: Nn,
    callIntentCallsPayload: te,
    sendOriginTransaction: se,
    switchChain: A,
    isSwitchingChain: In,
    switchChainError: W,
    isTransactionInProgress: ln,
    isChainSwitchRequired: B,
    sendTransaction: $,
    isSendingTransaction: g,
    originCallStatus: c,
    updateOriginCallStatus: Q,
    isEstimatingGas: M,
    isAutoExecute: T,
    updateAutoExecute: re,
    receipt: O,
    isWaitingForReceipt: yn,
    receiptIsSuccess: jn,
    receiptIsError: Rn,
    receiptError: sn,
    hasAutoExecuted: En,
    sentMetaTxns: S,
    sendMetaTxn: ge,
    sendMetaTxnPending: ve,
    sendMetaTxnSuccess: Ae,
    sendMetaTxnError: Te,
    sendMetaTxnArgs: Ee,
    clearIntent: oe,
    metaTxnMonitorStatuses: an,
    createIntent: ce,
    createIntentPending: le,
    createIntentSuccess: de,
    createIntentError: ue,
    createIntentArgs: fe,
    calculatedIntentAddress: Pn,
    originCallParams: t,
    updateOriginCallParams: me,
    originBlockTimestamp: qn,
    metaTxnBlockTimestamps: pn
  };
}
async function nt(_) {
  var Sn, ln, dn;
  const {
    account: s,
    originTokenAddress: d,
    originChainId: u,
    originTokenAmount: mn,
    // account balance
    destinationChainId: U,
    recipient: b,
    destinationTokenAddress: T,
    destinationTokenAmount: F,
    destinationTokenSymbol: En,
    fee: gn,
    client: S,
    dryMode: rn,
    apiClient: f,
    originRelayer: L,
    destinationRelayer: v,
    destinationCalldata: P,
    onTransactionStateChange: w
  } = _;
  if (!S)
    throw new Error("Wallet client not provided");
  const q = $n(u), C = u === U, Z = d === T, bn = Gn({
    chain: q,
    transport: Wn()
  }), G = s.address, H = P || (T === D ? "0x" : On(b, BigInt(F))), nn = {
    userAddress: G,
    originChainId: u,
    originTokenAddress: d,
    originTokenAmount: d === T ? F : mn,
    // max amount
    destinationChainId: U,
    destinationToAddress: P || T === D ? b : T,
    destinationTokenAddress: T,
    destinationTokenAmount: F,
    destinationTokenSymbol: En,
    destinationCallData: H,
    destinationCallValue: T === D ? F : "0"
  }, t = [];
  if (t.push({
    transactionHash: "",
    explorerUrl: "",
    chainId: u,
    state: "pending"
  }), Z || (t.push({
    transactionHash: "",
    explorerUrl: "",
    chainId: u,
    state: "pending"
  }), C || t.push({
    transactionHash: "",
    explorerUrl: "",
    chainId: U,
    state: "pending"
  })), Z && C)
    return {
      send: async (B) => {
        const y = {
          to: P || d === D ? b : d,
          data: P || (d === D ? "0x" : On(
            b,
            BigInt(F)
          )),
          value: d === D ? BigInt(F) : "0",
          chainId: u,
          chain: q
        };
        console.log("origin call params", y);
        let A = null;
        const In = null, W = null;
        if (await Un(S, u), !rn) {
          w([
            {
              transactionHash: "",
              explorerUrl: "",
              chainId: u,
              state: "pending"
            }
          ]), console.log("origin call params", y);
          const $ = await Yn(
            s,
            S,
            y
          );
          console.log("origin tx", $), B && B();
          const g = await bn.waitForTransactionReceipt({
            hash: $
          });
          console.log("receipt", g), A = g, w([
            {
              transactionHash: A == null ? void 0 : A.transactionHash,
              explorerUrl: Bn(
                A == null ? void 0 : A.transactionHash,
                u
              ),
              chainId: u,
              state: (A == null ? void 0 : A.status) === "success" ? "confirmed" : "failed"
            }
          ]);
        }
        return {
          originUserTxReceipt: A,
          originMetaTxnReceipt: In,
          destinationMetaTxnReceipt: W
        };
      }
    };
  console.log("Creating intent with args:", nn);
  const m = await ee(
    f,
    nn
  );
  if (console.log("Got intent:", m), !m)
    throw new Error("Invalid intent");
  if (!((Sn = m.preconditions) != null && Sn.length) || !((ln = m.calls) != null && ln.length) || !((dn = m.lifiInfos) != null && dn.length))
    throw new Error("Invalid intent");
  const Nn = Tn(
    G,
    m.calls,
    m.lifiInfos
  );
  return console.log("Calculated intent address:", Nn.toString()), await Ne(
    f,
    G,
    m.calls,
    m.preconditions,
    m.lifiInfos
  ), console.log("Committed intent config"), {
    intentAddress: Nn,
    send: async (B) => {
      var pn, en, j, K, wn, un;
      console.log("sending origin transaction");
      const y = Pe(
        m.preconditions,
        u
      );
      if (!y)
        throw new Error("No precondition found for origin chain");
      const A = (pn = y == null ? void 0 : y.data) == null ? void 0 : pn.address, In = (en = y == null ? void 0 : y.data) == null ? void 0 : en.min, W = BigInt(100), $ = {
        to: d === D ? A : d,
        data: d === D ? "0x" : On(
          A,
          BigInt(In) + BigInt(gn)
        ),
        value: d === D ? BigInt(In) + BigInt(gn) + W : "0",
        chain: q
      };
      let g = null, M = null, x = null;
      w(t), await Un(S, u);
      let c = !1;
      try {
        const r = await Oe(
          S,
          [
            {
              method: "wallet_getCapabilities",
              params: [s.address]
            }
          ],
          1e4
        );
        console.log("capabilities", r);
        const p = `0x${u.toString(16)}`, a = r[p];
        c = ((j = a == null ? void 0 : a.atomic) == null ? void 0 : j.status) === "supported" && !1;
      } catch (r) {
        console.error("Error getting capabilities", r);
      }
      if (rn && console.log("dry mode, skipping send calls"), console.log(c ? "using sendCalls" : "using sendTransaction"), c) {
        if (!rn) {
          const r = [];
          r.push({
            to: $.to,
            data: $.data,
            value: $.value ? `0x${BigInt($.value).toString(16)}` : "0x0"
          });
          const p = await S.request({
            method: "wallet_sendCalls",
            params: [
              {
                version: "2.0.0",
                chainId: `0x${u.toString(16)}`,
                atomicRequired: !0,
                calls: r
              }
            ]
          });
          console.log("sendCalls result", p);
          const a = p.requestId || p.id;
          let tn;
          for (; !tn; ) {
            const z = await S.request({
              method: "wallet_getCallsStatus",
              params: [a]
            });
            console.log("getCallsStatus result", z);
            const fn = (K = z == null ? void 0 : z.receipts) == null ? void 0 : K[0];
            if (z.status === 200 && (fn != null && fn.transactionHash)) {
              tn = fn.transactionHash;
              break;
            } else if (z.status === 500)
              throw new Error(`Transaction failed: ${z.error}`);
            await new Promise((on) => setTimeout(on, 2e3));
          }
          B && B();
          const Fn = await bn.waitForTransactionReceipt({
            hash: tn
          });
          console.log("receipt", Fn), g = Fn;
        }
      } else if (!rn) {
        const r = await Yn(
          s,
          S,
          $
        );
        console.log("origin tx", r), B && B();
        const p = await bn.waitForTransactionReceipt({
          hash: r
        });
        console.log("receipt", p), g = p;
      }
      t[0] = {
        transactionHash: g == null ? void 0 : g.transactionHash,
        explorerUrl: Bn(
          g == null ? void 0 : g.transactionHash,
          u
        ),
        chainId: u,
        state: (g == null ? void 0 : g.status) === "success" ? "confirmed" : "failed"
      }, w(t), await new Promise((r) => setTimeout(r, 2e3));
      const k = m.metaTxns[0];
      console.log("metaTx", k);
      const qn = await Xn(L, k, [
        m.preconditions[0]
      ]);
      console.log("opHash", qn);
      let V = 0;
      for (; ; ) {
        console.log(
          "polling status",
          k.id,
          BigInt(k.chainId)
        );
        const r = await Jn(
          L,
          k.id,
          Number(k.chainId)
        );
        if (console.log("status", r), V > 10)
          break;
        if (r.transactionHash) {
          M = (wn = r.data) == null ? void 0 : wn.receipt;
          break;
        }
        await new Promise((p) => setTimeout(p, 1e3)), V++;
      }
      if (t[1] = {
        transactionHash: M == null ? void 0 : M.txnHash,
        explorerUrl: Bn(
          M == null ? void 0 : M.txnHash,
          u
        ),
        chainId: u,
        state: (M == null ? void 0 : M.status) === "SUCCEEDED" ? "confirmed" : "failed"
      }, w(t), !C) {
        await new Promise((a) => setTimeout(a, 2e3));
        const r = m.metaTxns[1];
        console.log("metaTx2", r);
        const p = await Xn(v, r, [
          m.preconditions[1]
        ]);
        for (console.log("opHash2", p); ; ) {
          console.log(
            "polling status",
            r.id,
            BigInt(r.chainId)
          );
          const a = await Jn(
            v,
            r.id,
            Number(r.chainId)
          );
          if (console.log("receipt", a), a != null && a.transactionHash) {
            x = (un = a.data) == null ? void 0 : un.receipt;
            break;
          }
          await new Promise((tn) => setTimeout(tn, 1e3));
        }
        t[2] = {
          transactionHash: x == null ? void 0 : x.txnHash,
          explorerUrl: Bn(
            x == null ? void 0 : x.txnHash,
            U
          ),
          chainId: U,
          state: (x == null ? void 0 : x.status) === "SUCCEEDED" ? "confirmed" : "failed"
        }, w(t);
      }
      return {
        originUserTxReceipt: g,
        originMetaTxnReceipt: M,
        destinationMetaTxnReceipt: x
      };
    }
  };
}
function Bn(_, s) {
  var u, mn;
  const d = Object.values(xe);
  for (const U of d)
    if (U.id === s)
      return `${(mn = (u = U.blockExplorers) == null ? void 0 : u.default) == null ? void 0 : mn.url}/tx/${_}`;
  return "";
}
async function Un(_, s) {
  try {
    let d = await _.getChainId();
    if (d === s) {
      console.log("Chain already switched to:", s);
      return;
    }
    if (console.log(
      "Switching to chain:",
      s,
      "currentChainId",
      d
    ), await _.switchChain({ id: s }), d = await _.getChainId(), d !== s)
      throw new Error("Failed to switch chain");
    console.log("Chain switched to:", s);
  } catch (d) {
    throw console.error("Chain switch failed:", d), new Error(
      `Failed to switch chain: ${d instanceof Error ? d.message : "Unknown error"}`
    );
  }
}
export {
  Bn as getExplorerUrl,
  nt as prepareSend,
  Ze as useAnyPay
};
