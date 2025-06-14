import type { GetIntentCallsPayloadsArgs, GetIntentConfigReturn, SequenceAPIClient } from "@0xsequence/api";
import type { Relayer } from "@0xsequence/wallet-core";
import { Address } from "ox";
import { type Account as AccountType, type Hex, type TransactionReceipt, type WalletClient } from "viem";
import { type Connector } from "wagmi";
import { type AnypayFee, calculateIntentAddress, type GetIntentCallsPayloadsReturn, type OriginCallParams } from "./intents.js";
export type Account = {
    address: `0x${string}`;
    isConnected: boolean;
    chainId: number;
    connector?: Connector;
};
export type UseAnyPayConfig = {
    account: Account;
    disableAutoExecute?: boolean;
    env: "local" | "cors-anywhere" | "dev" | "prod";
    useV3Relayers?: boolean;
    sequenceApiKey?: string;
};
export type UseAnyPayReturn = {
    apiClient: SequenceAPIClient;
    metaTxns: GetIntentCallsPayloadsReturn["metaTxns"] | null;
    intentCallsPayloads: GetIntentCallsPayloadsReturn["calls"] | null;
    intentPreconditions: GetIntentCallsPayloadsReturn["preconditions"] | null;
    lifiInfos: GetIntentCallsPayloadsReturn["lifiInfos"] | null;
    anypayFee: AnypayFee | null;
    txnHash: Hex | undefined;
    committedIntentAddress: string | null;
    verificationStatus: {
        success: boolean;
        receivedAddress?: string;
        calculatedAddress?: string;
    } | null;
    getRelayer: (chainId: number) => any;
    estimatedGas: bigint | undefined;
    isEstimateError: boolean;
    estimateError: Error | null;
    calculateIntentAddress: typeof calculateIntentAddress;
    committedIntentConfig: GetIntentConfigReturn | undefined;
    isLoadingCommittedConfig: boolean;
    committedConfigError: Error | null;
    commitIntentConfig: (args: any) => void;
    commitIntentConfigPending: boolean;
    commitIntentConfigSuccess: boolean;
    commitIntentConfigError: Error | null;
    commitIntentConfigArgs: any;
    getIntentCallsPayloads: (args: GetIntentCallsPayloadsArgs) => Promise<GetIntentCallsPayloadsReturn>;
    operationHashes: {
        [key: string]: Hex;
    };
    callIntentCallsPayload: (args: any) => void;
    sendOriginTransaction: () => Promise<void>;
    switchChain: any;
    isSwitchingChain: boolean;
    switchChainError: Error | null;
    isTransactionInProgress: boolean;
    isChainSwitchRequired: boolean;
    sendTransaction: any;
    isSendingTransaction: boolean;
    originCallStatus: {
        txnHash?: string;
        status?: string;
        revertReason?: string | null;
        gasUsed?: number;
        effectiveGasPrice?: string;
    } | null;
    updateOriginCallStatus: (hash: Hex | undefined, status: "success" | "reverted" | "pending" | "sending", gasUsed?: bigint, effectiveGasPrice?: bigint, revertReason?: string | null) => void;
    isEstimatingGas: boolean;
    isAutoExecute: boolean;
    updateAutoExecute: (enabled: boolean) => void;
    receipt: any;
    isWaitingForReceipt: boolean;
    receiptIsSuccess: boolean;
    receiptIsError: boolean;
    receiptError: Error | null;
    hasAutoExecuted: boolean;
    sentMetaTxns: {
        [key: string]: number;
    };
    sendMetaTxn: (selectedId: string | null) => void;
    sendMetaTxnPending: boolean;
    sendMetaTxnSuccess: boolean;
    sendMetaTxnError: Error | null;
    sendMetaTxnArgs: {
        selectedId: string | null;
    } | undefined;
    clearIntent: () => void;
    metaTxnMonitorStatuses: {
        [key: string]: Relayer.OperationStatus;
    };
    createIntent: (args: any) => void;
    createIntentPending: boolean;
    createIntentSuccess: boolean;
    createIntentError: Error | null;
    createIntentArgs: any;
    calculatedIntentAddress: Address.Address | null;
    originCallParams: OriginCallParams | null;
    updateOriginCallParams: (args: {
        originChainId: number;
        tokenAddress: string;
    } | null) => void;
    originBlockTimestamp: number | null;
    metaTxnBlockTimestamps: {
        [key: string]: {
            timestamp: number | null;
            error?: string;
        };
    };
};
export declare function useAnyPay(config: UseAnyPayConfig): UseAnyPayReturn;
export type TransactionState = {
    transactionHash: string;
    explorerUrl: string;
    chainId: number;
    state: "pending" | "failed" | "confirmed";
};
export type SendOptions = {
    account: AccountType;
    originTokenAddress: string;
    originChainId: number;
    originTokenAmount: string;
    destinationChainId: number;
    recipient: string;
    destinationTokenAddress: string;
    destinationTokenAmount: string;
    destinationTokenSymbol: string;
    sequenceApiKey: string;
    fee: string;
    client?: WalletClient;
    dryMode?: boolean;
    apiClient: SequenceAPIClient;
    originRelayer: Relayer.Rpc.RpcRelayer;
    destinationRelayer: Relayer.Rpc.RpcRelayer;
    destinationCalldata?: string;
    onTransactionStateChange: (transactionStates: TransactionState[]) => void;
};
export type SendReturn = {
    originUserTxReceipt: TransactionReceipt | null;
    originMetaTxnReceipt: any;
    destinationMetaTxnReceipt: any;
};
export declare function prepareSend(options: SendOptions): Promise<{
    send: (onOriginSend: () => void) => Promise<SendReturn>;
    intentAddress?: undefined;
} | {
    intentAddress: `0x${string}`;
    send: (onOriginSend: () => void) => Promise<SendReturn>;
}>;
export declare function getExplorerUrl(txHash: string, chainId: number): string;
//# sourceMappingURL=anypay.d.ts.map