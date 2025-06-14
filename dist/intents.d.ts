import type { CommitIntentConfigReturn, GetIntentCallsPayloadsArgs, GetIntentCallsPayloadsReturn as GetIntentCallsPayloadsReturnFromAPI, IntentPrecondition, SequenceAPIClient } from "@0xsequence/api";
import { type Context, Payload } from "@0xsequence/wallet-primitives";
import { Address, type Hex } from "ox";
import { type Account, type Chain, type WalletClient } from "viem";
export interface AnypayLifiInfo {
    originToken: Address.Address;
    amount: bigint;
    originChainId: bigint;
    destinationChainId: bigint;
}
export interface IntentCallsPayload extends Payload.Calls {
    chainId: bigint;
}
export interface MetaTxnFeeDetail {
    metaTxnID: string;
    estimatedGasLimit: string;
    feeNative: string;
}
export interface ChainExecuteQuote {
    chainId: string;
    totalGasLimit: string;
    gasPrice: string;
    totalFeeAmount: string;
    nativeTokenSymbol: string;
    nativeTokenPrice?: string;
    metaTxnFeeDetails: Array<MetaTxnFeeDetail>;
    totalFeeUSD?: string;
}
export interface ExecuteQuote {
    chainQuotes: Array<ChainExecuteQuote>;
}
export interface CrossChainFee {
    lifiFee: string;
    anypaySwapFee: string;
    lifiFeeUSD: number;
    anypaySwapFeeUSD: number;
    totalFeeAmount: string;
    totalFeeUSD: number;
}
export interface AnypayFee {
    executeQuote: ExecuteQuote;
    crossChainFee?: CrossChainFee;
    anypayFixedFeeUSD?: number;
    feeToken?: string;
    originTokenTotalAmount?: string;
    totalFeeAmount?: string;
    totalFeeUSD?: string;
}
export type GetIntentCallsPayloadsReturn = GetIntentCallsPayloadsReturnFromAPI;
export type OriginCallParams = {
    to: `0x${string}` | null;
    data: Hex.Hex | null;
    value: bigint | null;
    chainId: number | null;
    error?: string;
};
export type SendOriginCallTxArgs = {
    to: string;
    data: Hex.Hex;
    value: bigint;
    chain: Chain;
};
export declare function getIntentCallsPayloads(apiClient: SequenceAPIClient, args: GetIntentCallsPayloadsArgs): Promise<GetIntentCallsPayloadsReturn>;
export declare function calculateIntentAddress(mainSigner: string, calls: IntentCallsPayload[], lifiInfosArg: AnypayLifiInfo[] | null | undefined): `0x${string}`;
export declare function commitIntentConfig(apiClient: SequenceAPIClient, mainSigner: string, calls: IntentCallsPayload[], preconditions: IntentPrecondition[], lifiInfos: AnypayLifiInfo[]): Promise<CommitIntentConfigReturn>;
export declare function sendOriginTransaction(wallet: Account, client: WalletClient, originParams: SendOriginCallTxArgs): Promise<`0x${string}`>;
export interface OriginTokenParam {
    address: Address.Address;
    chainId: bigint;
}
export interface DestinationTokenParam {
    address: Address.Address;
    chainId: bigint;
    amount: bigint;
}
export declare function hashIntentParams(params: {
    userAddress: Address.Address;
    nonce: bigint;
    originTokens: OriginTokenParam[];
    destinationCalls: Array<IntentCallsPayload>;
    destinationTokens: DestinationTokenParam[];
}): string;
export declare function bigintReplacer(_key: string, value: any): any;
export declare function getAnypayLifiInfoHash(lifiInfos: AnypayLifiInfo[], attestationAddress: Address.Address): Hex.Hex;
export declare function calculateIntentConfigurationAddress(mainSigner: Address.Address, calls: IntentCallsPayload[], context: Context.Context, attestationSigner?: Address.Address, lifiInfos?: AnypayLifiInfo[]): Address.Address;
//# sourceMappingURL=intents.d.ts.map