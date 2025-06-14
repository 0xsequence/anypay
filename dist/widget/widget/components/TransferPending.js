import { jsxs as c, Fragment as g, jsx as e } from "react/jsx-runtime";
import p, { useEffect as y } from "react";
import x from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/external-link.js";
const v = (n, r) => r === 1 ? "Transaction" : r === 2 ? n === 0 ? "Transaction" : "Swap" : n === 0 ? "Transfer" : n === 1 ? "Swap & Bridge" : "Execute", _ = ({
  onComplete: n,
  theme: r = "light",
  transactionStates: l
}) => {
  y(() => {
    const t = setTimeout(() => {
      n();
    }, 5e3);
    return () => clearTimeout(t);
  }, [n]);
  const s = l.findIndex(
    (t) => t.state === "pending"
  ), m = (t, a) => {
    const d = t.state === "pending", i = a === s, o = s !== -1 && a > s, b = `relative w-3 h-3 rounded-full transition-colors ${o ? r === "dark" ? "bg-gray-700" : "bg-gray-300" : t.state === "confirmed" ? r === "dark" ? "bg-green-500" : "bg-green-600" : t.state === "failed" ? r === "dark" ? "bg-red-500" : "bg-red-600" : r === "dark" ? "bg-blue-500" : "bg-blue-600"} ${i ? "animate-[pulse_1.5s_ease-in-out_infinite]" : ""}`, f = /* @__PURE__ */ c(g, { children: [
      /* @__PURE__ */ e("div", { className: "relative", children: /* @__PURE__ */ e("div", { className: b, children: i && /* @__PURE__ */ e(
        "div",
        {
          className: `absolute inset-0 rounded-full ${r === "dark" ? "bg-blue-500" : "bg-blue-600"} animate-[pulseRing_2s_cubic-bezier(0.4,0,0.6,1)_infinite]`
        }
      ) }) }),
      /* @__PURE__ */ e("div", { className: "absolute top-full pt-2 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ c("div", { className: `mt-2 text-xs transition-colors text-center whitespace-nowrap flex items-center gap-1 ${d || o ? r === "dark" ? "text-gray-400 font-medium" : "text-gray-500 font-medium" : r === "dark" ? "text-gray-100 font-semibold hover:underline" : "text-gray-900 font-semibold hover:underline"}`, children: [
        v(a, l.length),
        !d && !o && /* @__PURE__ */ e(x, { className: "w-3 h-3" })
      ] }) })
    ] });
    return d || o ? /* @__PURE__ */ e("div", { className: "flex flex-col items-center relative", children: f }) : /* @__PURE__ */ e(
      "a",
      {
        href: t.explorerUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex flex-col items-center relative",
        children: f
      }
    );
  }, u = (t) => {
    const a = t === s - 1;
    return /* @__PURE__ */ e("div", { className: "flex-1 flex items-center justify-center mx-4", children: /* @__PURE__ */ e("div", { className: "flex items-center space-x-2", children: [...Array(3)].map((d, i) => /* @__PURE__ */ e(
      "div",
      {
        className: `w-1 h-1 rounded-full ${r === "dark" ? t >= s ? "bg-gray-700" : "bg-gray-600" : t >= s ? "bg-gray-300" : "bg-gray-400"} ${a ? "animate-[fadeInOut_1.5s_ease-in-out_infinite]" : ""}`,
        style: {
          animationDelay: a ? `${i * 0.3}s` : "0s"
        }
      },
      i
    )) }) });
  };
  return /* @__PURE__ */ c(g, { children: [
    /* @__PURE__ */ e("style", { children: `
          @keyframes fadeInOut {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
          }
          @keyframes pulseRing {
            0% { transform: scale(0.7); opacity: 0; }
            50% { opacity: 0.3; }
            100% { transform: scale(2); opacity: 0; }
          }
        ` }),
    /* @__PURE__ */ c("div", { className: "space-y-8 flex flex-col items-center justify-center py-8", children: [
      /* @__PURE__ */ e(
        "h2",
        {
          className: `text-2xl font-bold ${r === "dark" ? "text-white" : "text-gray-900"}`,
          children: "Transfer Pending"
        }
      ),
      /* @__PURE__ */ e(
        "div",
        {
          className: `animate-spin rounded-full h-16 w-16 border-b-2 ${r === "dark" ? "border-blue-400" : "border-blue-500"}`
        }
      ),
      /* @__PURE__ */ e("div", { className: "w-full max-w-2xl px-8", children: /* @__PURE__ */ e("div", { className: "relative flex items-center justify-center pb-8", children: /* @__PURE__ */ e(
        "div",
        {
          className: `flex items-center ${l.length === 1 ? "w-auto" : l.length === 2 ? "w-[200px]" : "w-full justify-between"}`,
          children: l.map((t, a) => /* @__PURE__ */ c(p.Fragment, { children: [
            /* @__PURE__ */ e("div", { className: "flex flex-col items-center", children: m(t, a) }),
            a < l.length - 1 && u(a)
          ] }, a))
        }
      ) }) }),
      /* @__PURE__ */ e("p", { className: r === "dark" ? "text-gray-400" : "text-gray-500", children: "Waiting for confirmation..." })
    ] })
  ] });
};
export {
  _ as TransferPending,
  _ as default
};
