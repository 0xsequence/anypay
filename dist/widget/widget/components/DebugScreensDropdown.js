import { jsxs as p, jsx as o } from "react/jsx-runtime";
import { useState as l, useRef as f, useEffect as m } from "react";
import y from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/chevron-down.js";
const b = ["Connect", "Tokens", "Send", "Pending", "Receipt"], c = () => typeof window < "u" && new URLSearchParams(window.location.search).get("debug") === "true", k = ({
  onScreenSelect: u,
  theme: n = "light"
}) => {
  const [s, r] = l(!1), [h, w] = l(c()), a = f(null);
  return m(() => {
    const e = (g) => {
      a.current && !a.current.contains(g.target) && r(!1);
    }, t = () => {
      w(c());
    };
    window.addEventListener("popstate", t);
    const i = window.history.pushState, d = window.history.replaceState;
    return window.history.pushState = function() {
      i.apply(this, arguments), t();
    }, window.history.replaceState = function() {
      d.apply(this, arguments), t();
    }, document.addEventListener("mousedown", e), () => {
      document.removeEventListener("mousedown", e), window.removeEventListener("popstate", t), window.history.pushState = i, window.history.replaceState = d;
    };
  }, []), h ? /* @__PURE__ */ p("div", { className: "relative", ref: a, children: [
    /* @__PURE__ */ o(
      "button",
      {
        onClick: () => r(!s),
        className: `p-1 rounded-full hover:bg-opacity-10 ${n === "dark" ? "hover:bg-white text-gray-400" : "hover:bg-black text-gray-500"}`,
        children: /* @__PURE__ */ o(y, { className: "w-4 h-4" })
      }
    ),
    s && /* @__PURE__ */ o(
      "div",
      {
        className: `absolute bottom-full right-0 mb-1 w-40 border rounded-lg shadow-lg overflow-hidden ${n === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`,
        children: b.map((e) => /* @__PURE__ */ o(
          "button",
          {
            onClick: () => {
              u(e), r(!1);
            },
            className: `w-full text-left px-3 py-2 text-sm ${n === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`,
            children: e
          },
          e
        ))
      }
    )
  ] }) : null;
};
export {
  k as DebugScreensDropdown,
  k as default
};
