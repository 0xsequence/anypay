import React from "react";
interface TransactionState {
    transactionHash: string;
    explorerUrl: string;
    chainId: number;
    state: "pending" | "failed" | "confirmed";
}
interface TransferPendingProps {
    onComplete: () => void;
    theme?: "light" | "dark";
    transactionStates: TransactionState[];
}
export declare const TransferPending: React.FC<TransferPendingProps>;
export default TransferPending;
//# sourceMappingURL=TransferPending.d.ts.map