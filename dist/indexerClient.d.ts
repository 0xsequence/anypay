import { SequenceIndexerGateway } from "@0xsequence/indexer";
export type IndexerGatewayConfig = {
    indexerGatewayUrl?: string;
    projectAccessKey?: string;
    jwt?: string;
};
export declare function getIndexerGatewayClient({ indexerGatewayUrl, projectAccessKey, jwt, }: IndexerGatewayConfig): SequenceIndexerGateway;
export declare const useIndexerGatewayClient: (config?: IndexerGatewayConfig) => SequenceIndexerGateway;
//# sourceMappingURL=indexerClient.d.ts.map