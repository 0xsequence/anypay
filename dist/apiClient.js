import { SequenceAPIClient } from "@0xsequence/api";
import { useConfig } from "@0xsequence/hooks";
import { useMemo } from "react";
import { DEFAULT_API_URL } from "./constants.js";
export function getAPIClient({ apiUrl = DEFAULT_API_URL, projectAccessKey, jwt, }) {
    return new SequenceAPIClient(apiUrl, projectAccessKey, jwt);
}
export const useAPIClient = (config) => {
    const { projectAccessKey, jwt, env } = useConfig();
    const apiClient = useMemo(() => {
        return getAPIClient({
            apiUrl: config?.apiUrl ?? env.apiUrl,
            projectAccessKey: config?.projectAccessKey ?? projectAccessKey,
            jwt: config?.jwt ?? jwt,
        });
    }, [projectAccessKey, jwt, env.apiUrl, config]);
    return apiClient;
};
