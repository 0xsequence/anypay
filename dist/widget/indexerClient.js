import "./node_modules/.pnpm/@0xsequence_hooks@5.3.5_@0xsequence_api@packages_api_@0xsequence_indexer@2.3.17_@0xsequ_e66bd77d4f16d36ae26fac825ae408ab/node_modules/@0xsequence/hooks/dist/esm/contexts/ConfigContext.js";
import { useConfig as m } from "./node_modules/.pnpm/@0xsequence_hooks@5.3.5_@0xsequence_api@packages_api_@0xsequence_indexer@2.3.17_@0xsequ_e66bd77d4f16d36ae26fac825ae408ab/node_modules/@0xsequence/hooks/dist/esm/hooks/useConfig.js";
import "@0xsequence/api";
import { useMemo as w } from "react";
import { SequenceIndexerGateway as p } from "./node_modules/.pnpm/@0xsequence_indexer@2.3.17/node_modules/@0xsequence/indexer/dist/0xsequence-indexer.esm.js";
import "./node_modules/.pnpm/@0xsequence_network@2.3.17_ethers@6.14.3_bufferutil@4.0.9_utf-8-validate@5.0.10_/node_modules/@0xsequence/network/dist/0xsequence-network.esm.js";
import "viem";
import { DEFAULT_INDEXER_GATEWAY_URL as s } from "./constants.js";
function y({
  indexerGatewayUrl: e = s,
  projectAccessKey: t,
  jwt: r
}) {
  return new p(
    e,
    t,
    r
  );
}
const U = (e) => {
  const { projectAccessKey: t, jwt: r, env: a } = m();
  return w(() => y({
    indexerGatewayUrl: (e == null ? void 0 : e.indexerGatewayUrl) ?? a.indexerGatewayUrl,
    projectAccessKey: (e == null ? void 0 : e.projectAccessKey) ?? t,
    jwt: (e == null ? void 0 : e.jwt) ?? r
  }), [t, r, a.indexerGatewayUrl, e]);
};
export {
  y as getIndexerGatewayClient,
  U as useIndexerGatewayClient
};
