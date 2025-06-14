function s(e) {
  console.log(
    "Finding precondition address from:",
    JSON.stringify(e, null, 2)
  );
  const n = ["erc20-balance", "native-balance"];
  for (const o of n) {
    const i = e.find(
      (r) => {
        var d;
        return r.type === o && ((d = r.data) == null ? void 0 : d.address);
      }
    );
    if (i)
      return console.log(
        `Found ${o} precondition with address:`,
        i.data.address
      ), i.data.address;
  }
  const t = `N/A (No ${n.join(" or ")} precondition with address found)`;
  return console.log(t), t;
}
function c(e, n) {
  return e.find(
    (o) => (o.type === "erc20-balance" || o.type === "native-balance") && o.chainId === (n == null ? void 0 : n.toString())
  ) ?? null;
}
export {
  c as findFirstPreconditionForChainId,
  s as findPreconditionAddress
};
