import type { IntentPrecondition } from "@0xsequence/api";
import type { Relayer } from "@0xsequence/wallet-core";
import type { Hex } from "viem";
import type { MetaTxn } from "./metaTxnMonitor.js";
export declare function relayerSendMetaTx(relayer: Relayer.Rpc.RpcRelayer, metaTx: MetaTxn, preconditions: IntentPrecondition[]): Promise<Hex>;
//# sourceMappingURL=metaTxns.d.ts.map