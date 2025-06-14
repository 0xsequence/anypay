import type React from "react";
interface ReceiptProps {
    txHash?: string;
    chainId?: number;
    onSendAnother: () => void;
    onClose: () => void;
    theme?: "light" | "dark";
}
export declare const Receipt: React.FC<ReceiptProps>;
export default Receipt;
//# sourceMappingURL=Receipt.d.ts.map