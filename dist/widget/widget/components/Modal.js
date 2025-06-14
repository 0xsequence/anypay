import { jsx as e, jsxs as o, Fragment as m } from "react/jsx-runtime";
import { useRef as p, useEffect as u } from "react";
import { AnimatePresence as f } from "../../node_modules/.pnpm/motion@12.17.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/motion/dist/es/framer-motion/dist/es/components/AnimatePresence/index.js";
import { motion as c } from "../../node_modules/.pnpm/motion@12.17.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/motion/dist/es/framer-motion/dist/es/render/components/motion/proxy.js";
import y from "../../node_modules/.pnpm/lucide-react@0.493.0_react@19.1.0/node_modules/lucide-react/dist/esm/icons/x.js";
const b = ({
  isOpen: a,
  onClose: t,
  children: s,
  theme: n = "light"
}) => {
  const r = p(null);
  u(() => {
    const i = (d) => {
      d.key === "Escape" && t();
    };
    return a && document.addEventListener("keydown", i), () => {
      document.removeEventListener("keydown", i);
    };
  }, [a, t]);
  const l = (i) => {
    r.current && !r.current.contains(i.target) && t();
  };
  return /* @__PURE__ */ e(f, { children: a && /* @__PURE__ */ o(m, { children: [
    /* @__PURE__ */ e(
      c.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 },
        className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50",
        onClick: t
      }
    ),
    /* @__PURE__ */ e(
      "div",
      {
        className: `fixed inset-0 flex items-center justify-center z-50 p-4 ${n === "dark" ? "text-white" : "text-gray-900"}`,
        onClick: l,
        children: /* @__PURE__ */ o(
          c.div,
          {
            ref: r,
            initial: { opacity: 0, scale: 0.95, y: 10 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 10 },
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.8
            },
            className: "pointer-events-auto relative",
            layoutId: "modal-content",
            layout: "preserve-aspect",
            children: [
              /* @__PURE__ */ e(
                "button",
                {
                  onClick: t,
                  className: `absolute right-2 top-2 p-2 rounded-full transition-colors cursor-pointer z-10 ${n === "dark" ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`,
                  children: /* @__PURE__ */ e(y, { className: "h-6 w-6" })
                }
              ),
              s
            ]
          }
        )
      }
    )
  ] }) });
};
export {
  b as default
};
