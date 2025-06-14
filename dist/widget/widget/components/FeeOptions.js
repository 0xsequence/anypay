import "react/jsx-runtime";
import "@0xsequence/design-system";
import { useState as a, useRef as f, useMemo as c, useEffect as u } from "react";
const d = {
  ETH: "0.00001",
  USDC: "0.1"
}, l = {
  ETH: 3500,
  // Simulated ETH price in USD
  USDC: 1
  // USDC is pegged to USD
}, D = ({
  options: t,
  selectedOption: e,
  onSelect: r,
  theme: i = "light"
}) => {
  const [E, m] = a(!1), s = f(null);
  return c(() => {
    if (!e) return "0.00";
    const n = parseFloat(
      d[e.symbol] || "0"
    ), o = l[e.symbol] || 0;
    return (n * o).toFixed(2);
  }, [e]), u(() => {
    !e && t.length > 0 && r(t[0]);
  }, [e, t, r]), u(() => {
    const n = (o) => {
      s.current && !s.current.contains(o.target) && m(!1);
    };
    return document.addEventListener("mousedown", n), () => document.removeEventListener("mousedown", n);
  }, []), null;
};
export {
  D as FeeOptions,
  D as default
};
