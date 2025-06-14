import { useQuery as n } from "./node_modules/.pnpm/@tanstack_react-query@5.80.7_react@19.1.0/node_modules/@tanstack/react-query/build/modern/useQuery.js";
const i = async (e, r) => {
  if (r.length === 0)
    return [];
  const t = await e.getCoinPrices({ tokens: r });
  return (t == null ? void 0 : t.tokenPrices) || [];
}, u = (e, r) => n({
  queryKey: ["coinPrices", e],
  queryFn: () => i(r, e),
  retry: !0,
  staleTime: 6e4,
  enabled: e.length > 0
});
export {
  i as getTokenPrices,
  u as useTokenPrices
};
