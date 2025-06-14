import "@0xsequence/design-system/preset";
import "./index.css";
import React from "react";
type Theme = "light" | "dark" | "auto";
export type AnyPayWidgetProps = {
    sequenceApiKey: string;
    indexerUrl?: string;
    apiUrl?: string;
    env?: "local" | "cors-anywhere" | "dev" | "prod";
    toRecipient?: string;
    toAmount?: string;
    toChainId?: number | string;
    toToken?: string;
    toCalldata?: string;
    provider?: any;
    children?: React.ReactNode;
    renderInline?: boolean;
    theme?: Theme;
    walletOptions?: string[];
    onOriginConfirmation?: (txHash: string) => void;
    onDestinationConfirmation?: (txHash: string) => void;
};
export declare const AnyPayWidget: (props: AnyPayWidgetProps) => import("react/jsx-runtime").JSX.Element;
export default AnyPayWidget;
//# sourceMappingURL=widget.d.ts.map