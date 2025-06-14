import { jsxs as o, jsx as r } from "react/jsx-runtime";
import { useState as k } from "react";
import { useConnect as N, useDisconnect as v, useAccount as w } from "wagmi";
import { injected as C } from "../../node_modules/.pnpm/@wagmi_core@2.17.3_@tanstack_query-core@5.80.7_@types_react@19.1.8_react@19.1.0_typescr_5d5d36590e29c6f4db18c402bc3f954e/node_modules/@wagmi/core/dist/esm/connectors/injected.js";
const s = {
  metamask: {
    name: "MetaMask",
    connector: C
  }
  // Add more wallet configurations here as needed
}, i = ["metamask"], L = ({
  onConnect: g,
  theme: t = "light",
  walletOptions: b = i
}) => {
  const { connect: u } = N(), { disconnect: x } = v(), { isConnected: m, address: f, connector: c } = w(), [l, a] = k(null), p = async (e) => {
    try {
      a(null);
      const n = s[e];
      if (!n) {
        a(`No configuration found for wallet: ${e}`);
        return;
      }
      await u({ connector: n.connector() }), console.log(`Connected to ${n.name}`);
    } catch (n) {
      console.error("Failed to connect:", n), a(
        n instanceof Error ? n.message : "Failed to connect wallet"
      );
    }
  }, h = () => {
    try {
      a(null), x();
    } catch (e) {
      console.error("Failed to disconnect:", e), a(
        e instanceof Error ? e.message : "Failed to disconnect wallet"
      );
    }
  }, d = (b || i).filter(
    (e) => s[e]
  );
  if (!d.length)
    return /* @__PURE__ */ o("div", { className: "space-y-6", children: [
      /* @__PURE__ */ r("div", { className: "flex items-center relative", children: /* @__PURE__ */ r(
        "h2",
        {
          className: `text-lg font-semibold w-full text-center ${t === "dark" ? "text-white" : "text-gray-900"}`,
          children: "Connect a Wallet"
        }
      ) }),
      /* @__PURE__ */ r(
        "div",
        {
          className: `text-center p-4 rounded-lg ${t === "dark" ? "text-gray-300 bg-gray-800" : "text-gray-600 bg-gray-50"}`,
          children: "Please connect wallet in dapp"
        }
      )
    ] });
  const y = (e) => {
    switch (e) {
      case "metamask":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return t === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600";
    }
  };
  return /* @__PURE__ */ o("div", { className: "space-y-6", children: [
    /* @__PURE__ */ r("div", { className: "flex items-center relative", children: /* @__PURE__ */ r(
      "h2",
      {
        className: `text-lg font-semibold w-full text-center ${t === "dark" ? "text-white" : "text-gray-900"}`,
        children: "Connect a Wallet"
      }
    ) }),
    m ? /* @__PURE__ */ o("div", { className: "space-y-4", children: [
      /* @__PURE__ */ o(
        "div",
        {
          className: `p-4 rounded-2xl ${t === "dark" ? "bg-gray-800" : "bg-gray-50"}`,
          children: [
            /* @__PURE__ */ o("p", { className: t === "dark" ? "text-gray-400" : "text-gray-500", children: [
              "Connected with ",
              c == null ? void 0 : c.name
            ] }),
            /* @__PURE__ */ r(
              "p",
              {
                className: t === "dark" ? "text-white" : "text-gray-900",
                style: { wordBreak: "break-all" },
                children: f
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ o("div", { className: "flex flex-col gap-3", children: [
        l && /* @__PURE__ */ r(
          "div",
          {
            className: `border rounded-lg p-4 ${t === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`,
            children: /* @__PURE__ */ r(
              "p",
              {
                className: `text-sm break-words ${t === "dark" ? "text-red-200" : "text-red-600"}`,
                children: l
              }
            )
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            onClick: g,
            className: `w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${t === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`,
            children: "Continue"
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            onClick: h,
            className: `w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors border ${t === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-700" : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"}`,
            children: "Disconnect"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ o("div", { className: "flex flex-col gap-3", children: [
      l && /* @__PURE__ */ r(
        "div",
        {
          className: `border rounded-lg p-4 ${t === "dark" ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`,
          children: /* @__PURE__ */ r(
            "p",
            {
              className: `text-sm break-words ${t === "dark" ? "text-red-200" : "text-red-600"}`,
              children: l
            }
          )
        }
      ),
      d.map((e) => {
        const n = s[e];
        return n ? /* @__PURE__ */ r(
          "button",
          {
            onClick: () => p(e),
            className: `w-full flex items-center justify-center space-x-2 cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${y(e)} text-white`,
            children: /* @__PURE__ */ r("span", { children: n.name })
          },
          e
        ) : null;
      })
    ] })
  ] });
};
export {
  L as ConnectWallet,
  L as default
};
