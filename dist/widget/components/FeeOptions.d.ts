import React from "react";
interface FeeToken {
    name: string;
    symbol: string;
    imageUrl: string;
}
interface FeeOptionsProps {
    options: FeeToken[];
    selectedOption?: FeeToken;
    onSelect: (option: FeeToken) => void;
    theme?: "light" | "dark";
}
export declare const FeeOptions: React.FC<FeeOptionsProps>;
export default FeeOptions;
//# sourceMappingURL=FeeOptions.d.ts.map