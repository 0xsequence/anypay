import { Payload as m, Config as b } from "@0xsequence/wallet-primitives";
import { isAddressEqual as T } from "viem";
import { ANYPAY_LIFI_SAPIENT_SIGNER_LITE_ADDRESS as A } from "./constants.js";
import { findPreconditionAddress as E } from "./preconditions.js";
import { toHex as g, from as u, concat as p, fromHex as C, padLeft as B } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/Bytes.js";
import { from as l } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/Address.js";
import { keccak256 as f } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/Hash.js";
import { encode as I } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/AbiParameters.js";
import { fromCreate2 as k } from "./node_modules/.pnpm/ox@0.7.2_typescript@5.8.3_zod@3.25.63/node_modules/ox/_esm/core/ContractAddress.js";
async function M(n, t) {
  return n.getIntentCallsPayloads(t);
}
function S(n, t, e) {
  console.log("calculateIntentAddress inputs:", {
    mainSigner: n,
    calls: JSON.stringify(t, null, 2),
    lifiInfosArg: JSON.stringify(e, null, 2)
  });
  const o = {
    factory: "0xBd0F8abD58B4449B39C57Ac9D5C67433239aC447",
    stage1: "0x53bA242E7C2501839DF2972c75075dc693176Cd0",
    creationCode: "0x603e600e3d39601e805130553df33d3d34601c57363d3d373d363d30545af43d82803e903d91601c57fd5bf3"
  }, r = t.map((s) => ({
    type: "call",
    chainId: BigInt(s.chainId),
    space: s.space ? BigInt(s.space) : 0n,
    nonce: s.nonce ? BigInt(s.nonce) : 0n,
    calls: s.calls.map((i) => ({
      to: l(i.to),
      value: BigInt(i.value || "0"),
      data: g(u(i.data || "0x")),
      gasLimit: BigInt(i.gasLimit || "0"),
      delegateCall: !!i.delegateCall,
      onlyFallback: !!i.onlyFallback,
      behaviorOnError: Number(i.behaviorOnError) === 0 ? "ignore" : Number(i.behaviorOnError) === 1 ? "revert" : "abort"
    }))
  })), c = e == null ? void 0 : e.map((s) => ({
    originToken: l(s.originToken),
    amount: BigInt(s.amount),
    originChainId: BigInt(s.originChainId),
    destinationChainId: BigInt(s.destinationChainId)
  }));
  console.log(
    "Transformed coreLifiInfos:",
    JSON.stringify(
      c,
      (s, i) => typeof i == "bigint" ? i.toString() : i,
      2
    )
  );
  const a = L(
    l(n),
    r,
    o,
    // AnyPay.ANYPAY_LIFI_ATTESATION_SIGNER_ADDRESS,
    l("0x0000000000000000000000000000000000000001"),
    c
  );
  return console.log("Final calculated address:", a.toString()), a;
}
function P(n, t, e, o, r) {
  console.log("commitIntentConfig inputs:", {
    mainSigner: t,
    calls: JSON.stringify(e, null, 2),
    preconditions: JSON.stringify(o, null, 2),
    lifiInfos: JSON.stringify(r, null, 2)
  });
  const c = S(t, e, r), a = E(o);
  console.log("Address comparison:", {
    receivedAddress: a,
    calculatedAddress: c.toString(),
    match: T(l(a), c)
  });
  const s = {
    walletAddress: c.toString(),
    mainSigner: t,
    calls: e,
    preconditions: o,
    lifiInfos: r
  };
  return console.log("args", s), n.commitIntentConfig(s);
}
async function U(n, t, e) {
  const o = await t.getChainId();
  return o.toString() !== e.chain.id.toString() && (console.log(
    "sendOriginTransaction: switching chain",
    "want:",
    e.chain.id,
    "current:",
    o
  ), await t.switchChain({ id: e.chain.id }), console.log(
    "sendOriginTransaction: switched chain to",
    e.chain.id
  )), await t.sendTransaction({
    account: n,
    to: e.to,
    data: e.data,
    value: BigInt(e.value),
    chain: e.chain
  });
}
function Y(n) {
  if (!n) throw new Error("params is nil");
  if (!n.userAddress || n.userAddress === "0x0000000000000000000000000000000000000000")
    throw new Error("UserAddress is zero");
  if (typeof n.nonce != "bigint") throw new Error("Nonce is not a bigint");
  if (!n.originTokens || n.originTokens.length === 0)
    throw new Error("OriginTokens is empty");
  if (!n.destinationCalls || n.destinationCalls.length === 0)
    throw new Error("DestinationCalls is empty");
  if (!n.destinationTokens || n.destinationTokens.length === 0)
    throw new Error("DestinationTokens is empty");
  for (let d = 0; d < n.destinationCalls.length; d++) {
    const h = n.destinationCalls[d];
    if (!h) throw new Error(`DestinationCalls[${d}] is nil`);
    if (!h.calls || h.calls.length === 0)
      throw new Error(`DestinationCalls[${d}] has no calls`);
  }
  const t = n.originTokens.map((d) => ({
    address: d.address,
    chainId: d.chainId
  }));
  let e = u(new Uint8Array(32));
  for (let d = 0; d < n.destinationCalls.length; d++) {
    const h = n.destinationCalls[d], w = m.hash(
      l("0x0000000000000000000000000000000000000000"),
      h.chainId,
      h
    );
    e = f(
      p(e, w),
      {
        as: "Bytes"
      }
    );
  }
  const o = g(e), r = n.destinationTokens.map((d) => ({
    address: d.address,
    chainId: d.chainId,
    amount: d.amount
  })), a = I([
    { type: "address" },
    { type: "uint256" },
    {
      type: "tuple[]",
      components: [
        { name: "address", type: "address" },
        { name: "chainId", type: "uint256" }
      ]
    },
    {
      type: "tuple[]",
      components: [
        { name: "address", type: "address" },
        { name: "chainId", type: "uint256" },
        { name: "amount", type: "uint256" }
      ]
    },
    { type: "bytes32" }
  ], [
    n.userAddress,
    n.nonce,
    t,
    r,
    o
  ]), s = C(a), i = f(s);
  return g(i);
}
function q(n, t) {
  return typeof t == "bigint" ? t.toString() : t;
}
function x(n, t) {
  if (!n || n.length === 0)
    throw new Error("lifiInfos is empty");
  if (!t || t === "0x0000000000000000000000000000000000000000")
    throw new Error("attestationAddress is zero");
  const e = [
    { name: "originToken", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "originChainId", type: "uint256" },
    { name: "destinationChainId", type: "uint256" }
  ], o = n.map((i) => ({
    originToken: i.originToken,
    amount: i.amount,
    originChainId: i.originChainId,
    destinationChainId: i.destinationChainId
  })), c = I([
    {
      type: "tuple[]",
      name: "lifiInfos",
      components: e
    },
    { type: "address", name: "attestationAddress" }
  ], [
    o,
    t
  ]), a = C(c), s = f(a);
  return g(s);
}
function L(n, t, e, o, r) {
  const c = H(
    n,
    t,
    o,
    r
  ), a = b.hashConfiguration(c);
  return k({
    from: e.factory,
    bytecodeHash: f(
      p(
        u(e.creationCode),
        B(u(e.stage1), 32)
      ),
      { as: "Bytes" }
    ),
    salt: a
  });
}
function H(n, t, e, o) {
  const r = {
    type: "signer",
    address: n,
    weight: 1n
  }, a = [...t.map(
    (i) => {
      const y = m.hash(
        l("0x0000000000000000000000000000000000000000"),
        i.chainId,
        i
      );
      return console.log("digest:", g(y)), {
        type: "any-address-subdigest",
        digest: g(y)
      };
    }
  )];
  if (o && o.length > 0 && e) {
    const i = {
      type: "sapient-signer",
      // address: ANYPAY_LIFI_SAPIENT_SIGNER_ADDRESS,
      address: A,
      weight: 1n,
      imageHash: x(o, e)
    };
    a.push(i);
  }
  if (a.length === 0)
    throw new Error(
      "Intent configuration must have at least one call or LiFi information."
    );
  let s;
  return a.length === 1 ? s = a[0] : s = v(a), {
    threshold: 1n,
    checkpoint: 0n,
    topology: [r, s]
  };
}
function v(n) {
  if (n.length === 0)
    throw new Error("Cannot create a tree from empty members");
  if (n.length === 1)
    return n[0];
  let t = [...n];
  for (; t.length > 1; ) {
    const e = [];
    for (let o = 0; o < t.length; o += 2) {
      const r = t[o];
      if (o + 1 < t.length) {
        const c = t[o + 1];
        e.push([r, c]);
      } else
        e.push(r);
    }
    t = e;
  }
  return t[0];
}
export {
  q as bigintReplacer,
  S as calculateIntentAddress,
  L as calculateIntentConfigurationAddress,
  P as commitIntentConfig,
  x as getAnypayLifiInfoHash,
  M as getIntentCallsPayloads,
  Y as hashIntentParams,
  U as sendOriginTransaction
};
