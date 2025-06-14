async function i(e, t, r) {
  return Promise.race([
    e.request(...t),
    new Promise(
      (u, o) => setTimeout(() => o(new Error("Request timed out")), r)
    )
  ]);
}
export {
  i as requestWithTimeout
};
