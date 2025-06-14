import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { getExplorerUrl as i } from "../../anypay.js";
const d = ({
  txHash: o,
  chainId: n,
  onSendAnother: l,
  onClose: a,
  theme: r = "light"
}) => !o || !n ? null : /* @__PURE__ */ t("div", { className: "space-y-6", children: [
  /* @__PURE__ */ t("div", { className: "text-center", children: [
    /* @__PURE__ */ e(
      "div",
      {
        className: `mx-auto flex items-center justify-center h-12 w-12 rounded-full ${r === "dark" ? "bg-green-900/20" : "bg-green-100"}`,
        children: /* @__PURE__ */ e(
          "svg",
          {
            className: `h-6 w-6 ${r === "dark" ? "text-green-400" : "text-green-600"}`,
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor",
            children: /* @__PURE__ */ e(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 13l4 4L19 7"
              }
            )
          }
        )
      }
    ),
    /* @__PURE__ */ e(
      "h2",
      {
        className: `mt-4 text-2xl font-bold ${r === "dark" ? "text-white" : "text-gray-900"}`,
        children: "Transaction Confirmed"
      }
    )
  ] }),
  /* @__PURE__ */ e("div", { className: "text-center", children: /* @__PURE__ */ e(
    "a",
    {
      href: i(o, n),
      target: "_blank",
      rel: "noopener noreferrer",
      className: `underline transition-colors ${r === "dark" ? "text-blue-400 hover:text-blue-300" : "text-black hover:text-gray-900"}`,
      children: "View on Explorer"
    }
  ) }),
  /* @__PURE__ */ t("div", { className: "space-y-3", children: [
    /* @__PURE__ */ e(
      "button",
      {
        onClick: l,
        className: `w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${r === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`,
        children: "Start Another Transaction"
      }
    ),
    /* @__PURE__ */ e(
      "button",
      {
        onClick: a,
        className: `w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${r === "dark" ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"}`,
        children: "Close"
      }
    )
  ] })
] });
export {
  d as Receipt,
  d as default
};
