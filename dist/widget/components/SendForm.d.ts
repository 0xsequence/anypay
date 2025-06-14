import React from "react";
import { type Account, type WalletClient } from "viem";
import { type TransactionState } from "../../anypay.js";
interface Token {
    id: number;
    name: string;
    symbol: string;
    balance: string;
    imageUrl: string;
    chainId: number;
    contractAddress: string;
    tokenPriceUsd?: number;
    contractInfo?: {
        decimals: number;
        symbol: string;
        name: string;
    };
}
interface SendFormProps {
    selectedToken: Token;
    onSend: (amount: string, recipient: string) => void;
    onBack: () => void;
    onConfirm: () => void;
    onComplete: (data: any) => void;
    account: Account;
    sequenceApiKey: string;
    apiUrl?: string;
    env?: "local" | "cors-anywhere" | "dev" | "prod";
    toRecipient?: string;
    toAmount?: string;
    toChainId?: number;
    toToken?: string;
    toCalldata?: string;
    walletClient?: WalletClient;
    theme?: "light" | "dark";
    onTransactionStateChange: (transactionStates: TransactionState[]) => void;
}
export declare const SendForm: React.FC<SendFormProps>;
export default SendForm;
//# sourceMappingURL=SendForm.d.ts.map