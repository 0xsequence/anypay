import { SequenceAPIClient as m } from "@0xsequence/api";
import "./node_modules/.pnpm/@0xsequence_hooks@5.3.5_@0xsequence_api@packages_api_@0xsequence_indexer@2.3.17_@0xsequ_e66bd77d4f16d36ae26fac825ae408ab/node_modules/@0xsequence/hooks/dist/esm/contexts/ConfigContext.js";
import { useConfig as s } from "./node_modules/.pnpm/@0xsequence_hooks@5.3.5_@0xsequence_api@packages_api_@0xsequence_indexer@2.3.17_@0xsequ_e66bd77d4f16d36ae26fac825ae408ab/node_modules/@0xsequence/hooks/dist/esm/hooks/useConfig.js";
import { useMemo as l } from "react";
import "./node_modules/.pnpm/@0xsequence_network@2.3.17_ethers@6.14.3_bufferutil@4.0.9_utf-8-validate@5.0.10_/node_modules/@0xsequence/network/dist/0xsequence-network.esm.js";
import "viem";
import { DEFAULT_API_URL as u } from "./constants.js";
function A({
  apiUrl: e = u,
  projectAccessKey: t,
  jwt: r
}) {
  return new m(e, t, r);
}
const P = (e) => {
  const { projectAccessKey: t, jwt: r, env: p } = s();
  return l(() => A({
    apiUrl: (e == null ? void 0 : e.apiUrl) ?? p.apiUrl,
    projectAccessKey: (e == null ? void 0 : e.projectAccessKey) ?? t,
    jwt: (e == null ? void 0 : e.jwt) ?? r
  }), [t, r, p.apiUrl, e]);
};
export {
  A as getAPIClient,
  P as useAPIClient
};
