import { useMutation, useQuery } from "@tanstack/react-query";
import { Address } from "ox";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPublicClient, createWalletClient, custom, http, isAddressEqual, zeroAddress, } from "viem";
import * as chains from "viem/chains";
import { useEstimateGas, useSendTransaction, useSwitchChain, useWaitForTransactionReceipt, } from "wagmi";
import { useAPIClient } from "./apiClient.js";
import { getERC20TransferData } from "./encoders.js";
import { calculateIntentAddress, commitIntentConfig, getIntentCallsPayloads as getIntentCallsPayloadsFromIntents, sendOriginTransaction, } from "./intents.js";
import { getMetaTxStatus, useMetaTxnsMonitor, } from "./metaTxnMonitor.js";
import { relayerSendMetaTx } from "./metaTxns.js";
import { findFirstPreconditionForChainId, findPreconditionAddress, } from "./preconditions.js";
import { getBackupRelayer, useRelayers } from "./relayer.js";
import { getChainInfo } from "./tokenBalances.js";
import { requestWithTimeout } from "./utils.js";
const RETRY_WINDOW_MS = 10_000;
export function useAnyPay(config) {
    const { account, disableAutoExecute = false, env, useV3Relayers = true, sequenceApiKey, } = config;
    const apiClient = useAPIClient({ projectAccessKey: sequenceApiKey });
    const [isAutoExecute, setIsAutoExecute] = useState(!disableAutoExecute);
    const [hasAutoExecuted, setHasAutoExecuted] = useState(false);
    // Track timestamps of when each meta-transaction was last sent
    const [sentMetaTxns, setSentMetaTxns] = useState({});
    // State declarations
    const [metaTxns, setMetaTxns] = useState(null);
    const [intentCallsPayloads, setIntentCallsPayloads] = useState(null);
    const [intentPreconditions, setIntentPreconditions] = useState(null);
    const [lifiInfos, setLifiInfos] = useState(null);
    const [anypayFee, setAnypayFee] = useState(null);
    const [txnHash, setTxnHash] = useState();
    const [committedIntentAddress, setCommittedIntentAddress] = useState(null);
    // const [preconditionStatuses, setPreconditionStatuses] = useState<boolean[]>([])
    const [originCallParams, setOriginCallParams] = useState(null);
    const [operationHashes, setOperationHashes] = useState({});
    const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
    const [isChainSwitchRequired, setIsChainSwitchRequired] = useState(false);
    const { switchChain, isPending: isSwitchingChain, error: switchChainError, } = useSwitchChain();
    const { sendTransaction, isPending: isSendingTransaction } = useSendTransaction();
    const [isEstimatingGas, setIsEstimatingGas] = useState(false);
    const [originCallStatus, setOriginCallStatus] = useState(null);
    const [originBlockTimestamp, setOriginBlockTimestamp] = useState(null);
    const [metaTxnBlockTimestamps, setMetaTxnBlockTimestamps] = useState({});
    const [verificationStatus, setVerificationStatus] = useState(null);
    const { getRelayer } = useRelayers({
        env,
        useV3Relayers,
    });
    // Add gas estimation hook with proper types
    const { data: estimatedGas, isError: isEstimateError, error: estimateError, } = useEstimateGas(originCallParams?.to && originCallParams?.chainId && !originCallParams.error
        ? {
            to: originCallParams.to || undefined,
            data: originCallParams.data || undefined,
            value: originCallParams.value || undefined,
            chainId: originCallParams.chainId || undefined,
        }
        : undefined);
    const commitIntentConfigMutation = useMutation({
        mutationFn: async (args) => {
            if (!apiClient)
                throw new Error("API client not available");
            if (!args.lifiInfos)
                throw new Error("LifiInfos not available");
            try {
                console.log("Calculating intent address...");
                console.log("Main signer:", args.mainSigner);
                console.log("Calls:", args.calls);
                console.log("LifiInfos:", args.lifiInfos);
                const calculatedAddress = calculateIntentAddress(args.mainSigner, args.calls, // TODO: Add proper type
                args.lifiInfos);
                const receivedAddress = findPreconditionAddress(args.preconditions);
                console.log("Calculated address:", calculatedAddress.toString());
                console.log("Received address:", receivedAddress);
                const isVerified = isAddressEqual(Address.from(receivedAddress), calculatedAddress);
                setVerificationStatus({
                    success: isVerified,
                    receivedAddress: receivedAddress,
                    calculatedAddress: calculatedAddress.toString(),
                });
                if (!isVerified) {
                    throw new Error("Address verification failed: Calculated address does not match received address.");
                }
                // Commit the intent config
                const response = await apiClient.commitIntentConfig({
                    walletAddress: calculatedAddress.toString(),
                    mainSigner: args.mainSigner,
                    calls: args.calls,
                    preconditions: args.preconditions,
                    lifiInfos: args.lifiInfos,
                });
                console.log("API Commit Response:", response);
                return { calculatedAddress: calculatedAddress.toString(), response };
            }
            catch (error) {
                console.error("Error during commit intent mutation:", error);
                if (!verificationStatus?.success &&
                    !verificationStatus?.receivedAddress) {
                    try {
                        const calculatedAddress = calculateIntentAddress(args.mainSigner, args.calls, // TODO: Add proper type
                        args.lifiInfos);
                        const receivedAddress = findPreconditionAddress(args.preconditions);
                        setVerificationStatus({
                            success: false,
                            receivedAddress: receivedAddress,
                            calculatedAddress: calculatedAddress.toString(),
                        });
                    }
                    catch (calcError) {
                        console.error("Error calculating addresses for verification status on failure:", calcError);
                        setVerificationStatus({ success: false });
                    }
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("Intent config committed successfully, Wallet Address:", data.calculatedAddress);
            setCommittedIntentAddress(data.calculatedAddress);
        },
        onError: (error) => {
            console.error("Failed to commit intent config:", error);
            setCommittedIntentAddress(null);
        },
    });
    // New Query to fetch committed intent config
    const { data: committedIntentConfig, isLoading: isLoadingCommittedConfig, error: committedConfigError, } = useQuery({
        queryKey: ["getIntentConfig", committedIntentAddress],
        queryFn: async () => {
            if (!apiClient || !committedIntentAddress) {
                throw new Error("API client or committed intent address not available");
            }
            console.log("Fetching intent config for address:", committedIntentAddress);
            return await apiClient.getIntentConfig({
                walletAddress: committedIntentAddress,
            });
        },
        enabled: !!committedIntentAddress &&
            !!apiClient &&
            commitIntentConfigMutation.isSuccess,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
    async function getIntentCallsPayloads(args) {
        return getIntentCallsPayloadsFromIntents(apiClient, args);
    }
    // TODO: Add type for args
    const createIntentMutation = useMutation({
        mutationFn: async (args) => {
            if (args.originChainId === args.destinationChainId &&
                isAddressEqual(Address.from(args.originTokenAddress), Address.from(args.destinationTokenAddress))) {
                throw new Error("The same token cannot be used as both the source and destination token.");
            }
            if (!account.address) {
                throw new Error("Missing selected token or account address");
            }
            // Reset commit state when generating a new intent
            setCommittedIntentAddress(null);
            setVerificationStatus(null);
            setAnypayFee(null);
            setMetaTxns(null);
            setIntentCallsPayloads(null);
            setIntentPreconditions(null);
            setLifiInfos(null);
            const data = await getIntentCallsPayloads(args);
            setMetaTxns(data.metaTxns);
            setIntentCallsPayloads(data.calls);
            setIntentPreconditions(data.preconditions);
            setLifiInfos(data.lifiInfos);
            setAnypayFee(data.anypayFee);
            setCommittedIntentAddress(null);
            setVerificationStatus(null);
            return data;
        },
        onSuccess: (data) => {
            console.log("Intent Config Success:", data);
            setAnypayFee(data.anypayFee || null);
            setLifiInfos(data.lifiInfos || null);
            if (data?.calls &&
                data.calls.length > 0 &&
                data.preconditions &&
                data.preconditions.length > 0 &&
                data.metaTxns &&
                data.metaTxns.length > 0) {
                setIntentCallsPayloads(data.calls);
                setIntentPreconditions(data.preconditions);
                setMetaTxns(data.metaTxns);
            }
            else {
                console.warn("API returned success but no operations found.");
                setIntentCallsPayloads(null);
                setIntentPreconditions(null);
                setMetaTxns(null);
            }
        },
        onError: (error) => {
            console.error("Intent Config Error:", error);
            setIntentCallsPayloads(null);
            setIntentPreconditions(null);
            setMetaTxns(null);
            setLifiInfos(null);
            setAnypayFee(null);
        },
    });
    function callIntentCallsPayload(args) {
        createIntentMutation.mutate(args);
    }
    const clearIntent = useCallback(() => {
        console.log("[AnyPay] Clearing intent state");
        setIntentCallsPayloads(null);
        setIntentPreconditions(null);
        setMetaTxns(null);
        setLifiInfos(null);
        setAnypayFee(null);
        setCommittedIntentAddress(null);
        setVerificationStatus(null);
        setOperationHashes({});
        setHasAutoExecuted(false);
        setMetaTxnBlockTimestamps({});
    }, []); // Empty deps array since these setters are stable
    const updateOriginCallStatus = useCallback((hash, status, gasUsed, effectiveGasPrice, revertReason) => {
        setOriginCallStatus({
            txnHash: hash,
            status: status === "success"
                ? "Success"
                : status === "reverted"
                    ? "Failed"
                    : status === "sending"
                        ? "Sending..."
                        : "Pending",
            revertReason: status === "reverted"
                ? revertReason || "Transaction reverted"
                : undefined,
            gasUsed: gasUsed ? Number(gasUsed) : undefined,
            effectiveGasPrice: effectiveGasPrice?.toString(),
        });
    }, []);
    const sendOriginTransaction = async () => {
        console.log("Sending origin transaction...");
        console.log(isTransactionInProgress, originCallParams, originCallParams?.error, originCallParams?.to, originCallParams?.data, originCallParams?.value, originCallParams?.chainId);
        if (isTransactionInProgress || // Prevent duplicate transactions
            !originCallParams ||
            originCallParams.error ||
            !originCallParams.to ||
            originCallParams.data === null ||
            originCallParams.value === null ||
            originCallParams.chainId === null) {
            console.error("Origin call parameters not available or invalid:", originCallParams);
            updateOriginCallStatus(undefined, "reverted", undefined, undefined, "Origin call parameters not ready");
            return;
        }
        // Check if we need to switch chains
        if (account.chainId !== originCallParams.chainId) {
            setIsChainSwitchRequired(true);
            updateOriginCallStatus(undefined, "pending", undefined, undefined, `Switching to chain ${originCallParams.chainId}...`);
            const walletClient = createWalletClient({
                chain: getChainInfo(originCallParams.chainId),
                transport: custom((await account.connector.getProvider())), // TODO: Add proper type
            });
            try {
                await attemptSwitchChain(walletClient, originCallParams.chainId);
                setIsChainSwitchRequired(false);
            }
            catch (error) {
                console.error("Chain switch failed:", error);
                if (error instanceof Error && error.message.includes("User rejected")) {
                    setIsAutoExecute(false);
                }
                updateOriginCallStatus(undefined, "reverted", undefined, undefined, error instanceof Error
                    ? error.message
                    : "Unknown error switching chain");
                setIsChainSwitchRequired(false);
                return; // Stop execution on switch failure
            }
        }
        // Ensure only one transaction is sent at a time
        if (!isTransactionInProgress) {
            setIsTransactionInProgress(true); // Mark transaction as in progress
            setTxnHash(undefined);
            updateOriginCallStatus(undefined, "sending");
            if (!estimatedGas && !isEstimateError) {
                setIsEstimatingGas(true);
                return; // Wait for gas estimation
            }
            if (isEstimateError) {
                console.error("Gas estimation failed:", estimateError);
                updateOriginCallStatus(undefined, "reverted", undefined, undefined, `Gas estimation failed: ${estimateError?.message}`);
                setIsTransactionInProgress(false);
                return;
            }
            // Add 20% buffer to estimated gas
            const gasLimit = estimatedGas
                ? BigInt(Math.floor(Number(estimatedGas) * 1.2))
                : undefined;
            sendTransaction({
                to: originCallParams.to,
                data: originCallParams.data,
                value: originCallParams.value,
                chainId: originCallParams.chainId,
                gas: gasLimit,
            }, {
                onSuccess: (hash) => {
                    console.log("Transaction sent, hash:", hash);
                    setTxnHash(hash);
                    setIsTransactionInProgress(false); // Reset transaction state
                },
                onError: (error) => {
                    console.error("Transaction failed:", error);
                    if (error instanceof Error &&
                        (error.message.includes("User rejected") ||
                            error.message.includes("user rejected"))) {
                        setIsAutoExecute(false);
                    }
                    updateOriginCallStatus(undefined, "reverted", undefined, undefined, error instanceof Error ? error.message : "Unknown error");
                    setIsTransactionInProgress(false);
                },
            });
        }
        else {
            console.warn("Transaction already in progress. Skipping duplicate request.");
        }
    };
    // Remove the chain change effect that might be resetting state
    useEffect(() => {
        if (switchChainError) {
            console.error("Chain switch error:", switchChainError);
            updateOriginCallStatus(undefined, "reverted", undefined, undefined, `Chain switch failed: ${switchChainError.message || "Unknown error"}`);
            setIsChainSwitchRequired(false);
        }
    }, [switchChainError, updateOriginCallStatus]);
    // Reset gas estimation state when parameters change
    useEffect(() => {
        setIsEstimatingGas(false);
    }, []);
    // Only update chain switch required state when needed
    useEffect(() => {
        if (originCallParams?.chainId &&
            account.chainId === originCallParams.chainId) {
            console.log("No chain switch required");
            setIsChainSwitchRequired(false);
        }
    }, [account.chainId, originCallParams?.chainId]);
    // Effect to handle chain switching
    useEffect(() => {
        if (originCallParams?.chainId &&
            account.chainId !== originCallParams.chainId) {
            async function check() {
                try {
                    const chainId = originCallParams.chainId;
                    const walletClient = createWalletClient({
                        chain: getChainInfo(chainId),
                        transport: custom((await account.connector.getProvider())), // TODO: Add proper type
                    });
                    await attemptSwitchChain(walletClient, chainId);
                }
                catch (error) {
                    console.error("Chain switch failed:", error);
                }
            }
            check().catch(console.error);
        }
    }, [account, originCallParams]);
    // Hook to wait for transaction receipt
    const { data: receipt, isLoading: isWaitingForReceipt, isSuccess: receiptIsSuccess, isError: receiptIsError, error: receiptError, } = useWaitForTransactionReceipt({
        hash: txnHash,
        confirmations: 1,
        query: {
            enabled: !!txnHash,
        },
    });
    // Modify the effect that watches for transaction status
    useEffect(() => {
        if (!txnHash) {
            // Only reset these when txnHash is cleared
            if (originCallStatus?.txnHash) {
                setOriginCallStatus(null);
            }
            setOriginBlockTimestamp(null);
            if (Object.keys(sentMetaTxns).length > 0) {
                setSentMetaTxns({});
            }
            return;
        }
        if (originCallStatus?.txnHash === txnHash &&
            (originCallStatus?.status === "Success" ||
                originCallStatus?.status === "Failed") &&
            !isWaitingForReceipt) {
            return;
        }
        if (isWaitingForReceipt) {
            setOriginCallStatus((prevStatus) => ({
                ...(prevStatus?.txnHash === txnHash
                    ? prevStatus
                    : {
                        gasUsed: undefined,
                        effectiveGasPrice: undefined,
                        revertReason: undefined,
                    }),
                txnHash,
                status: "Pending",
            }));
            return;
        }
        if (receiptIsSuccess && receipt) {
            const newStatus = receipt.status === "success" ? "Success" : "Failed";
            setOriginCallStatus({
                txnHash: receipt.transactionHash,
                status: newStatus,
                gasUsed: receipt.gasUsed ? Number(receipt.gasUsed) : undefined,
                effectiveGasPrice: receipt.effectiveGasPrice?.toString(),
                revertReason: receipt.status === "reverted"
                    ? receiptError?.message ||
                        "Transaction reverted by receipt"
                    : undefined,
            });
            if (newStatus === "Success" && receipt.blockNumber) {
                const fetchTimestamp = async () => {
                    try {
                        if (!originCallParams?.chainId) {
                            console.error("[AnyPay] Origin chainId not available for fetching origin block timestamp.");
                            setOriginBlockTimestamp(null);
                            return;
                        }
                        const chainConfig = getChainInfo(originCallParams.chainId);
                        const client = createPublicClient({
                            chain: chainConfig,
                            transport: http(),
                        });
                        const block = await client.getBlock({
                            blockNumber: BigInt(receipt.blockNumber),
                        });
                        setOriginBlockTimestamp(Number(block.timestamp));
                    }
                    catch (error) {
                        console.error("[AnyPay] Error fetching origin block timestamp:", error);
                        setOriginBlockTimestamp(null);
                    }
                };
                fetchTimestamp();
            }
            else if (newStatus !== "Success") {
                setOriginBlockTimestamp(null);
            }
            if (newStatus === "Success" &&
                metaTxns &&
                metaTxns.length > 0 &&
                isAutoExecute &&
                !metaTxns.some((tx) => sentMetaTxns[`${tx.chainId}-${tx.id}`])) {
                console.log("Origin transaction successful, auto-sending all meta transactions...");
                sendMetaTxnMutation.mutate({ selectedId: null });
            }
        }
        else if (receiptIsError) {
            setOriginCallStatus({
                txnHash,
                status: "Failed",
                revertReason: receiptError?.message ||
                    "Failed to get receipt",
                gasUsed: undefined,
                effectiveGasPrice: undefined,
            });
            setOriginBlockTimestamp(null);
        }
    }, [
        txnHash,
        isWaitingForReceipt,
        receiptIsSuccess,
        receiptIsError,
        receipt,
        receiptError,
        metaTxns,
        sentMetaTxns,
        isAutoExecute,
        originCallParams?.chainId,
        originCallStatus?.status,
        originCallStatus?.txnHash,
    ]);
    // Modify the auto-execute effect
    useEffect(() => {
        const shouldAutoSend = isAutoExecute &&
            commitIntentConfigMutation.isSuccess &&
            originCallParams?.chainId &&
            account.chainId === originCallParams.chainId &&
            !originCallParams.error &&
            originCallParams.to &&
            originCallParams.data !== null &&
            originCallParams.value !== null &&
            !isSendingTransaction &&
            !isWaitingForReceipt &&
            !txnHash &&
            !isChainSwitchRequired &&
            !originCallStatus &&
            !hasAutoExecuted;
        if (shouldAutoSend) {
            console.log("Auto-executing transaction: All conditions met.");
            setHasAutoExecuted(true);
            // Set initial status
            setOriginCallStatus({
                status: "Sending...",
            });
            sendTransaction({
                to: originCallParams.to,
                data: originCallParams.data,
                value: originCallParams.value,
                chainId: originCallParams.chainId,
            }, {
                onSuccess: (hash) => {
                    console.log("Auto-executed transaction sent, hash:", hash);
                    setTxnHash(hash);
                },
                onError: (error) => {
                    console.error("Auto-executed transaction failed:", error);
                    if (error instanceof Error &&
                        (error.message.includes("User rejected") ||
                            error.message.includes("user rejected"))) {
                        setIsAutoExecute(false);
                    }
                    setOriginCallStatus({
                        status: "Failed",
                        revertReason: error instanceof Error ? error.message : "Unknown error",
                    });
                    setHasAutoExecuted(false);
                },
            });
        }
    }, [
        isAutoExecute,
        commitIntentConfigMutation.isSuccess,
        originCallParams,
        account.chainId,
        isSendingTransaction,
        isWaitingForReceipt,
        txnHash,
        isChainSwitchRequired,
        originCallStatus,
        hasAutoExecuted,
        sendTransaction,
    ]);
    // Effect to auto-commit when intent calls payloads are ready
    useEffect(() => {
        if (isAutoExecute &&
            intentCallsPayloads &&
            intentPreconditions &&
            lifiInfos &&
            account.address &&
            calculatedIntentAddress &&
            !commitIntentConfigMutation.isPending &&
            !commitIntentConfigMutation.isSuccess) {
            console.log("Auto-committing intent configuration...");
            commitIntentConfigMutation.mutate({
                walletAddress: calculatedIntentAddress.toString(),
                mainSigner: account.address,
                calls: intentCallsPayloads,
                preconditions: intentPreconditions,
                lifiInfos: lifiInfos,
            });
        }
    }, [
        isAutoExecute,
        intentCallsPayloads,
        intentPreconditions,
        lifiInfos, // Add lifiInfos dependency
        account.address,
        commitIntentConfigMutation,
        commitIntentConfigMutation.isPending,
        commitIntentConfigMutation.isSuccess,
    ]);
    // Update the sendMetaTxn mutation
    const sendMetaTxnMutation = useMutation({
        mutationFn: async ({ selectedId }) => {
            if (!intentCallsPayloads ||
                !intentPreconditions ||
                !metaTxns ||
                !account.address ||
                !lifiInfos) {
                throw new Error("Missing required data for meta-transaction");
            }
            const intentAddress = calculateIntentAddress(account.address, intentCallsPayloads, lifiInfos); // TODO: Add proper type
            // If no specific ID is selected, send all meta transactions
            const txnsToSend = selectedId
                ? [metaTxns.find((tx) => tx.id === selectedId)]
                : metaTxns;
            if (!txnsToSend || (selectedId && !txnsToSend[0])) {
                throw new Error("Meta transaction not found");
            }
            const results = [];
            for (const metaTxn of txnsToSend) {
                if (!metaTxn)
                    continue;
                const operationKey = `${metaTxn.chainId}-${metaTxn.id}`;
                const lastSentTime = sentMetaTxns[operationKey];
                const now = Date.now();
                if (lastSentTime && now - lastSentTime < RETRY_WINDOW_MS) {
                    const timeLeft = Math.ceil((RETRY_WINDOW_MS - (now - lastSentTime)) / 1000);
                    console.log(`Meta transaction for ${operationKey} was sent recently. Wait ${timeLeft}s before retry`);
                    continue;
                }
                try {
                    const chainId = parseInt(metaTxn.chainId);
                    if (Number.isNaN(chainId) || chainId <= 0) {
                        throw new Error(`Invalid chainId for meta transaction: ${chainId}`);
                    }
                    const chainRelayer = getRelayer(chainId);
                    if (!chainRelayer) {
                        throw new Error(`No relayer found for chainId: ${chainId}`);
                    }
                    const relevantPreconditions = intentPreconditions.filter((p) => p.chainId && parseInt(p.chainId) === chainId);
                    console.log(`Relaying meta transaction ${operationKey} to intent ${intentAddress} via relayer:`, chainRelayer);
                    const { opHash } = await chainRelayer.sendMetaTxn(metaTxn.walletAddress, metaTxn.contract, metaTxn.input, BigInt(metaTxn.chainId), undefined, relevantPreconditions);
                    const useBackupRelayer = false; // Disable backup relayer for now
                    if (useBackupRelayer) {
                        try {
                            // Fire and forget send tx to backup relayer
                            const backupRelayer = getBackupRelayer(chainId);
                            backupRelayer
                                ?.sendMetaTxn(metaTxn.walletAddress, metaTxn.contract, metaTxn.input, BigInt(metaTxn.chainId), undefined, relevantPreconditions)
                                .then(() => { })
                                .catch(() => { });
                        }
                        catch { }
                    }
                    results.push({
                        operationKey,
                        opHash,
                        success: true,
                    });
                }
                catch (error) {
                    results.push({
                        operationKey,
                        error: error instanceof Error ? error.message : "Unknown error",
                        success: false,
                    });
                }
            }
            return results;
        },
        onSuccess: (results) => {
            // Update states based on results
            results.forEach(({ operationKey, opHash, success }) => {
                if (success && opHash) {
                    setSentMetaTxns((prev) => ({
                        ...prev,
                        [operationKey]: Date.now(),
                    }));
                    setOperationHashes((prev) => ({
                        ...prev,
                        [operationKey]: opHash,
                    }));
                }
            });
        },
        onError: (error) => {
            console.error("Error in meta-transaction process:", error);
        },
        retry: 5, // Allow up to 2 retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    });
    const [tokenAddress, setTokenAddress] = useState(null);
    const [originChainId, setOriginChainId] = useState(null);
    useEffect(() => {
        if (!intentCallsPayloads?.[0]?.chainId ||
            !tokenAddress ||
            !originChainId ||
            !intentPreconditions ||
            !account.address) {
            setOriginCallParams(null);
            return;
        }
        try {
            const intentAddressString = calculatedIntentAddress;
            let calcTo;
            let calcData = "0x";
            let calcValue = 0n;
            const recipientAddress = intentAddressString;
            const isNative = tokenAddress === zeroAddress;
            if (isNative) {
                const nativePrecondition = intentPreconditions.find((p) => (p.type === "transfer-native" || p.type === "native-balance") &&
                    p.chainId === originChainId.toString());
                const nativeMinAmount = nativePrecondition?.data?.minAmount ?? nativePrecondition?.data?.min;
                if (nativeMinAmount === undefined) {
                    throw new Error("Could not find native precondition (transfer-native or native-balance) or min amount");
                }
                calcValue = BigInt(nativeMinAmount);
                calcTo = recipientAddress;
            }
            else {
                const erc20Precondition = intentPreconditions.find((p) => p.type === "erc20-balance" &&
                    p.chainId === originChainId.toString() &&
                    p.data?.token &&
                    isAddressEqual(Address.from(p.data.token), Address.from(tokenAddress)));
                const erc20MinAmount = erc20Precondition?.data?.min;
                if (erc20MinAmount === undefined) {
                    throw new Error("Could not find ERC20 balance precondition or min amount");
                }
                calcData = getERC20TransferData(recipientAddress, erc20MinAmount);
                calcTo = tokenAddress;
            }
            setOriginCallParams({
                to: calcTo,
                data: calcData,
                value: calcValue,
                chainId: originChainId,
                error: undefined,
            });
        }
        catch (error) {
            console.error("Failed to calculate origin call params for UI:", error);
            setOriginCallParams({
                to: null,
                data: null,
                value: null,
                chainId: null,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }, [
        intentCallsPayloads,
        tokenAddress,
        originChainId,
        intentPreconditions,
        account.address,
    ]);
    // const checkPreconditionStatuses = useCallback(async () => {
    //   if (!intentPreconditions) return
    //   const statuses = await Promise.all(
    //     intentPreconditions.map(async (precondition) => {
    //       try {
    //         const chainIdString = precondition.chainId
    //         if (!chainIdString) {
    //           console.warn('Precondition missing chainId:', precondition)
    //           return false
    //         }
    //         const chainId = parseInt(chainIdString)
    //         if (isNaN(chainId) || chainId <= 0) {
    //           console.warn('Precondition has invalid chainId:', chainIdString, precondition)
    //           return false
    //         }
    //         const chainRelayer = getRelayer(chainId)
    //         if (!chainRelayer) {
    //           console.error(`No relayer found for chainId: ${chainId}`)
    //           return false
    //         }
    //         return await chainRelayer.checkPrecondition(precondition)
    //       } catch (error) {
    //         console.error('Error checking precondition:', error, 'Precondition:', precondition)
    //         return false
    //       }
    //     }),
    //   )
    //   setPreconditionStatuses(statuses)
    // }, [intentPreconditions, getRelayer])
    // useEffect(() => {
    //   // TODO: Remove this once we have a way to check precondition statuses
    //   if (false) {
    //     checkPreconditionStatuses()
    //   }
    // }, [intentPreconditions, checkPreconditionStatuses])
    // Add monitoring for each meta transaction
    const metaTxnMonitorStatuses = useMetaTxnsMonitor(metaTxns, getRelayer);
    // Create a stable dependency for the meta timestamp effect
    const _stableMetaTxnStatusesKey = useMemo(() => {
        if (!metaTxns || Object.keys(metaTxnMonitorStatuses).length === 0) {
            return "no_statuses";
        }
        // Sort by a stable key (e.g., id) to ensure consistent order if metaTxns array order changes
        // but content is the same, though metaTxns itself is a dependency, so this might be redundant if metaTxns order is stable.
        const sortedTxnIds = metaTxns.map((tx) => `${tx.chainId}-${tx.id}`).sort();
        return sortedTxnIds
            .map((key) => {
            const statusObj = metaTxnMonitorStatuses[key];
            return `${key}:${statusObj ? statusObj.status : "loading"}`;
        })
            .join(",");
    }, [metaTxns, metaTxnMonitorStatuses]);
    const processedTxns = useRef(new Set());
    // Effect to fetch meta-transaction block timestamps
    useEffect(() => {
        console.log("[AnyPay] Running meta-transaction block timestamp effect:", {
            metaTxnsLength: metaTxns?.length,
            monitorStatusesLength: Object.keys(metaTxnMonitorStatuses).length,
        });
        if (!metaTxns || metaTxns.length === 0) {
            console.log("[AnyPay] No meta transactions, clearing timestamps");
            processedTxns.current.clear();
            if (Object.keys(metaTxnBlockTimestamps).length > 0) {
                setMetaTxnBlockTimestamps({});
            }
            return;
        }
        if (!Object.keys(metaTxnMonitorStatuses).length) {
            console.log("[AnyPay] No monitor statuses yet, waiting...");
            return;
        }
        metaTxns.forEach(async (metaTxn) => {
            const operationKey = `${metaTxn.chainId}-${metaTxn.id}`;
            // Skip if already processed
            if (processedTxns.current.has(operationKey)) {
                console.log(`[AnyPay] MetaTxn ${operationKey}: Already processed, skipping`);
                return;
            }
            const monitorStatus = metaTxnMonitorStatuses[operationKey];
            if (!monitorStatus || monitorStatus.status !== "confirmed") {
                console.log(`[AnyPay] MetaTxn ${operationKey}: Status not confirmed, skipping`);
                return;
            }
            // Type assertion since we know it exists when status is "confirmed"
            const transactionHash = monitorStatus.transactionHash;
            if (!transactionHash) {
                console.log(`[AnyPay] MetaTxn ${operationKey}: No transaction hash, skipping`);
                return;
            }
            console.log(`[AnyPay] MetaTxn ${operationKey}: Processing transaction ${transactionHash}`);
            processedTxns.current.add(operationKey);
            try {
                const chainId = parseInt(metaTxn.chainId);
                if (Number.isNaN(chainId) || chainId <= 0) {
                    throw new Error(`Invalid chainId for meta transaction: ${metaTxn.chainId}`);
                }
                const chainConfig = getChainInfo(chainId);
                const client = createPublicClient({
                    chain: chainConfig,
                    transport: http(),
                });
                const receipt = await client.getTransactionReceipt({
                    hash: transactionHash,
                });
                if (receipt && typeof receipt.blockNumber === "bigint") {
                    const block = await client.getBlock({
                        blockNumber: receipt.blockNumber,
                    });
                    console.log(`[AnyPay] MetaTxn ${operationKey}: Got block timestamp ${block.timestamp}`);
                    setMetaTxnBlockTimestamps((prev) => ({
                        ...prev,
                        [operationKey]: {
                            timestamp: Number(block.timestamp),
                            error: undefined,
                        },
                    }));
                }
                else {
                    console.warn(`[AnyPay] MetaTxn ${operationKey}: No block number in receipt`);
                    setMetaTxnBlockTimestamps((prev) => ({
                        ...prev,
                        [operationKey]: {
                            timestamp: null,
                            error: "Block number not found in receipt",
                        },
                    }));
                }
            }
            catch (error) {
                console.error(`[AnyPay] MetaTxn ${operationKey}: Error:`, error);
                setMetaTxnBlockTimestamps((prev) => ({
                    ...prev,
                    [operationKey]: {
                        timestamp: null,
                        error: error.message || "Failed to fetch receipt/timestamp",
                    },
                }));
            }
        });
    }, [metaTxns, metaTxnMonitorStatuses, metaTxnBlockTimestamps]);
    const updateAutoExecute = (enabled) => {
        setIsAutoExecute(enabled);
    };
    function createIntent(args) {
        createIntentMutation.mutate(args);
    }
    const calculatedIntentAddress = useMemo(() => {
        if (!account.address || !intentCallsPayloads || !lifiInfos) {
            return null;
        }
        return calculateIntentAddress(account.address, intentCallsPayloads, lifiInfos); // TODO: Add proper type
    }, [account.address, intentCallsPayloads, lifiInfos]);
    const createIntentPending = createIntentMutation.isPending;
    const createIntentSuccess = createIntentMutation.isSuccess;
    const createIntentError = createIntentMutation.error;
    const createIntentArgs = createIntentMutation.variables;
    function commitIntentConfig(args) {
        console.log("commitIntentConfig", args);
        commitIntentConfigMutation.mutate(args);
    }
    function updateOriginCallParams(args) {
        if (!args) {
            setOriginCallParams(null);
            return;
        }
        const { originChainId, tokenAddress } = args;
        setOriginChainId(originChainId);
        setTokenAddress(tokenAddress);
    }
    function sendMetaTxn(selectedId) {
        sendMetaTxnMutation.mutate({ selectedId });
    }
    const commitIntentConfigPending = commitIntentConfigMutation.isPending;
    const commitIntentConfigSuccess = commitIntentConfigMutation.isSuccess;
    const commitIntentConfigError = commitIntentConfigMutation.error;
    const commitIntentConfigArgs = commitIntentConfigMutation.variables;
    const sendMetaTxnPending = sendMetaTxnMutation.isPending;
    const sendMetaTxnSuccess = sendMetaTxnMutation.isSuccess;
    const sendMetaTxnError = sendMetaTxnMutation.error;
    const sendMetaTxnArgs = sendMetaTxnMutation.variables;
    return {
        apiClient,
        metaTxns,
        intentCallsPayloads,
        intentPreconditions,
        lifiInfos,
        anypayFee,
        txnHash,
        committedIntentAddress,
        verificationStatus,
        getRelayer,
        estimatedGas,
        isEstimateError,
        estimateError,
        calculateIntentAddress,
        committedIntentConfig,
        isLoadingCommittedConfig,
        committedConfigError,
        commitIntentConfig,
        commitIntentConfigPending,
        commitIntentConfigSuccess,
        commitIntentConfigError,
        commitIntentConfigArgs,
        getIntentCallsPayloads,
        operationHashes,
        callIntentCallsPayload,
        sendOriginTransaction,
        switchChain,
        isSwitchingChain,
        switchChainError,
        isTransactionInProgress,
        isChainSwitchRequired,
        sendTransaction,
        isSendingTransaction,
        originCallStatus,
        updateOriginCallStatus,
        isEstimatingGas,
        isAutoExecute,
        updateAutoExecute,
        receipt,
        isWaitingForReceipt,
        receiptIsSuccess,
        receiptIsError,
        receiptError,
        hasAutoExecuted,
        sentMetaTxns,
        sendMetaTxn,
        sendMetaTxnPending,
        sendMetaTxnSuccess,
        sendMetaTxnError,
        sendMetaTxnArgs,
        clearIntent,
        metaTxnMonitorStatuses,
        createIntent,
        createIntentPending,
        createIntentSuccess,
        createIntentError,
        createIntentArgs,
        calculatedIntentAddress,
        originCallParams,
        updateOriginCallParams,
        originBlockTimestamp,
        metaTxnBlockTimestamps,
    };
}
// TODO: fix up this one-click send
export async function prepareSend(options) {
    const { account, originTokenAddress, originChainId, originTokenAmount, // account balance
    destinationChainId, recipient, destinationTokenAddress, destinationTokenAmount, destinationTokenSymbol, fee, client: walletClient, dryMode, apiClient, originRelayer, destinationRelayer, destinationCalldata, onTransactionStateChange, } = options;
    if (!walletClient) {
        throw new Error("Wallet client not provided");
    }
    const chain = getChainInfo(originChainId);
    const isToSameChain = originChainId === destinationChainId;
    const isToSameToken = originTokenAddress === destinationTokenAddress;
    const publicClient = createPublicClient({
        chain,
        transport: http(),
    });
    const mainSigner = account.address;
    const _destinationCalldata = destinationCalldata ||
        (destinationTokenAddress === zeroAddress
            ? "0x"
            : getERC20TransferData(recipient, BigInt(destinationTokenAmount)));
    const _destinationToAddress = destinationCalldata
        ? recipient
        : destinationTokenAddress === zeroAddress
            ? recipient
            : destinationTokenAddress;
    const _destinationCallValue = destinationTokenAddress === zeroAddress ? destinationTokenAmount : "0";
    const intentArgs = {
        userAddress: mainSigner,
        originChainId,
        originTokenAddress,
        originTokenAmount: originTokenAddress === destinationTokenAddress
            ? destinationTokenAmount
            : originTokenAmount, // max amount
        destinationChainId,
        destinationToAddress: _destinationToAddress,
        destinationTokenAddress: destinationTokenAddress,
        destinationTokenAmount: destinationTokenAmount,
        destinationTokenSymbol: destinationTokenSymbol,
        destinationCallData: _destinationCalldata,
        destinationCallValue: _destinationCallValue,
    };
    const transactionStates = [];
    // origin tx
    transactionStates.push({
        transactionHash: "",
        explorerUrl: "",
        chainId: originChainId,
        state: "pending",
    });
    if (!isToSameToken) {
        // swap + bridge tx
        transactionStates.push({
            transactionHash: "",
            explorerUrl: "",
            chainId: originChainId,
            state: "pending",
        });
        if (!isToSameChain) {
            // destination tx
            transactionStates.push({
                transactionHash: "",
                explorerUrl: "",
                chainId: destinationChainId,
                state: "pending",
            });
        }
    }
    if (isToSameToken && isToSameChain) {
        return {
            send: async (onOriginSend) => {
                const originCallParams = {
                    to: destinationCalldata
                        ? recipient
                        : originTokenAddress === zeroAddress
                            ? recipient
                            : originTokenAddress,
                    data: destinationCalldata ||
                        (originTokenAddress === zeroAddress
                            ? "0x"
                            : getERC20TransferData(recipient, BigInt(destinationTokenAmount))),
                    value: originTokenAddress === zeroAddress
                        ? BigInt(destinationTokenAmount)
                        : "0",
                    chainId: originChainId,
                    chain,
                };
                console.log("origin call params", originCallParams);
                let originUserTxReceipt = null;
                const originMetaTxnReceipt = null; // TODO: Add proper type
                const destinationMetaTxnReceipt = null; // TODO: Add proper type
                await attemptSwitchChain(walletClient, originChainId);
                if (!dryMode) {
                    onTransactionStateChange([
                        {
                            transactionHash: "",
                            explorerUrl: "",
                            chainId: originChainId,
                            state: "pending",
                        },
                    ]);
                    console.log("origin call params", originCallParams);
                    const txHash = await sendOriginTransaction(account, walletClient, originCallParams); // TODO: Add proper type
                    console.log("origin tx", txHash);
                    if (onOriginSend) {
                        onOriginSend();
                    }
                    // Wait for transaction receipt
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: txHash,
                    });
                    console.log("receipt", receipt);
                    originUserTxReceipt = receipt;
                    onTransactionStateChange([
                        {
                            transactionHash: originUserTxReceipt?.transactionHash,
                            explorerUrl: getExplorerUrl(originUserTxReceipt?.transactionHash, originChainId),
                            chainId: originChainId,
                            state: originUserTxReceipt?.status === "success"
                                ? "confirmed"
                                : "failed",
                        },
                    ]);
                }
                return {
                    originUserTxReceipt,
                    originMetaTxnReceipt,
                    destinationMetaTxnReceipt,
                };
            },
        };
    }
    console.log("Creating intent with args:", intentArgs);
    const intent = await getIntentCallsPayloadsFromIntents(apiClient, intentArgs); // TODO: Add proper type
    console.log("Got intent:", intent);
    if (!intent) {
        throw new Error("Invalid intent");
    }
    if (!intent.preconditions?.length ||
        !intent.calls?.length ||
        !intent.lifiInfos?.length) {
        throw new Error("Invalid intent");
    }
    const intentAddress = calculateIntentAddress(mainSigner, intent.calls, intent.lifiInfos); // TODO: Add proper type
    console.log("Calculated intent address:", intentAddress.toString());
    await commitIntentConfig(apiClient, mainSigner, intent.calls, intent.preconditions, intent.lifiInfos);
    console.log("Committed intent config");
    return {
        intentAddress,
        send: async (onOriginSend) => {
            console.log("sending origin transaction");
            const firstPrecondition = findFirstPreconditionForChainId(intent.preconditions, originChainId);
            if (!firstPrecondition) {
                throw new Error("No precondition found for origin chain");
            }
            const firstPreconditionAddress = firstPrecondition?.data?.address;
            const firstPreconditionMin = firstPrecondition?.data?.min;
            const buffer = BigInt(100); // wei to account for rounding errors
            const originCallParams = {
                to: originTokenAddress === zeroAddress
                    ? firstPreconditionAddress
                    : originTokenAddress,
                data: originTokenAddress === zeroAddress
                    ? "0x"
                    : getERC20TransferData(firstPreconditionAddress, BigInt(firstPreconditionMin) + BigInt(fee)),
                value: originTokenAddress === zeroAddress
                    ? BigInt(firstPreconditionMin) + BigInt(fee) + buffer
                    : "0",
                chainId: originChainId,
                chain,
            };
            let originUserTxReceipt = null;
            let originMetaTxnReceipt = null; // TODO: Add proper type
            let destinationMetaTxnReceipt = null; // TODO: Add proper type
            onTransactionStateChange(transactionStates);
            await attemptSwitchChain(walletClient, originChainId);
            let useSendCalls = false;
            try {
                // the reason for the timeout is some users experience this call to hang indefinitely on metamask on all chains.
                // not sure why this is happening, but it happens.
                const capabilities = await requestWithTimeout(walletClient, [
                    {
                        method: "wallet_getCapabilities",
                        params: [account.address],
                    },
                ], 10000);
                console.log("capabilities", capabilities);
                // Check if the chain supports atomic transactions
                const chainHex = `0x${originChainId.toString(16)}`;
                const chainCapabilities = capabilities[chainHex];
                const moreThan1Tx = false; // TODO: check if we need to do more than 1 tx
                useSendCalls =
                    chainCapabilities?.atomic?.status === "supported" && moreThan1Tx;
            }
            catch (error) {
                console.error("Error getting capabilities", error);
            }
            if (dryMode) {
                console.log("dry mode, skipping send calls");
            }
            if (useSendCalls) {
                console.log("using sendCalls");
            }
            else {
                console.log("using sendTransaction");
            }
            if (useSendCalls) {
                if (!dryMode) {
                    const calls = [];
                    // If we're swapping ERC20 and it's a cross-chain transfer, add ETH fee call
                    // if (originTokenAddress !== zeroAddress) {
                    //   calls.push({
                    //     to: firstPreconditionAddress as `0x${string}`,
                    //     data: '0x00',
                    //     value: `0x${parseUnits('0.00005', 18).toString(16)}`,
                    //   })
                    // }
                    // Add the origin call
                    calls.push({
                        to: originCallParams.to,
                        data: originCallParams.data,
                        value: originCallParams.value
                            ? `0x${BigInt(originCallParams.value).toString(16)}`
                            : "0x0",
                    });
                    // Send the batched call via EIP-7702
                    const result = (await walletClient.request({
                        method: "wallet_sendCalls",
                        params: [
                            {
                                version: "2.0.0",
                                chainId: `0x${originChainId.toString(16)}`,
                                atomicRequired: true,
                                calls,
                            },
                        ],
                    }));
                    console.log("sendCalls result", result);
                    const requestId = result.requestId || result.id;
                    // Poll to check if the tx has been submitted
                    let txHash;
                    while (!txHash) {
                        const status = (await walletClient.request({
                            method: "wallet_getCallsStatus",
                            params: [requestId],
                        }));
                        console.log("getCallsStatus result", status);
                        const receipt = status?.receipts?.[0];
                        if (status.status === 200 && receipt?.transactionHash) {
                            txHash = receipt.transactionHash;
                            break;
                        }
                        else if (status.status === 500) {
                            throw new Error(`Transaction failed: ${status.error}`);
                        }
                        // wait a bit before polling again
                        await new Promise((r) => setTimeout(r, 2000));
                    }
                    if (onOriginSend) {
                        onOriginSend();
                    }
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: txHash,
                    });
                    console.log("receipt", receipt);
                    originUserTxReceipt = receipt;
                }
            }
            else {
                if (!dryMode) {
                    // If we're swapping erc20 then we need to pay the lifi fee in eth
                    // if (originTokenAddress !== zeroAddress) {
                    //   const tx0 = await sendOriginTransaction(account, walletClient, {
                    //     to: firstPreconditionAddress,
                    //     data: '0x00',
                    //     value: parseUnits('0.00005', 18).toString(),
                    //     chainId: originChainId,
                    //     chain,
                    //   } as any) // TODO: Add proper type
                    //   console.log('origin tx', tx0)
                    //   // Wait for transaction receipt
                    //   const receipt0 = await publicClient.waitForTransactionReceipt({ hash: tx0 })
                    // }
                    const tx = await sendOriginTransaction(account, walletClient, originCallParams); // TODO: Add proper type
                    console.log("origin tx", tx);
                    if (onOriginSend) {
                        onOriginSend();
                    }
                    // Wait for transaction receipt
                    const receipt = await publicClient.waitForTransactionReceipt({
                        hash: tx,
                    });
                    console.log("receipt", receipt);
                    originUserTxReceipt = receipt;
                }
            }
            transactionStates[0] = {
                transactionHash: originUserTxReceipt?.transactionHash,
                explorerUrl: getExplorerUrl(originUserTxReceipt?.transactionHash, originChainId),
                chainId: originChainId,
                state: originUserTxReceipt?.status === "success" ? "confirmed" : "failed",
            };
            onTransactionStateChange(transactionStates);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: make sure relayer is ready with a better check
            const metaTx = intent.metaTxns[0];
            console.log("metaTx", metaTx);
            const opHash = await relayerSendMetaTx(originRelayer, metaTx, [
                intent.preconditions[0],
            ]);
            console.log("opHash", opHash);
            let tries = 0;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                console.log("polling status", metaTx.id, BigInt(metaTx.chainId));
                const receipt = await getMetaTxStatus(originRelayer, metaTx.id, Number(metaTx.chainId));
                console.log("status", receipt);
                if (tries > 10) {
                    break;
                }
                if (receipt.transactionHash) {
                    originMetaTxnReceipt = receipt.data?.receipt;
                    break;
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
                tries++;
            }
            transactionStates[1] = {
                transactionHash: originMetaTxnReceipt?.txnHash,
                explorerUrl: getExplorerUrl(originMetaTxnReceipt?.txnHash, originChainId),
                chainId: originChainId,
                state: originMetaTxnReceipt?.status === "SUCCEEDED" ? "confirmed" : "failed",
            };
            onTransactionStateChange(transactionStates);
            if (!isToSameChain) {
                await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: make sure relayer is ready with a better check
                const metaTx2 = intent.metaTxns[1];
                console.log("metaTx2", metaTx2);
                const opHash2 = await relayerSendMetaTx(destinationRelayer, metaTx2, [
                    intent.preconditions[1],
                ]);
                console.log("opHash2", opHash2);
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    console.log("polling status", metaTx2.id, BigInt(metaTx2.chainId));
                    const receipt = await getMetaTxStatus(destinationRelayer, metaTx2.id, Number(metaTx2.chainId));
                    console.log("receipt", receipt);
                    if (receipt?.transactionHash) {
                        destinationMetaTxnReceipt = receipt.data?.receipt;
                        break;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                transactionStates[2] = {
                    transactionHash: destinationMetaTxnReceipt?.txnHash,
                    explorerUrl: getExplorerUrl(destinationMetaTxnReceipt?.txnHash, destinationChainId),
                    chainId: destinationChainId,
                    state: destinationMetaTxnReceipt?.status === "SUCCEEDED"
                        ? "confirmed"
                        : "failed",
                };
                onTransactionStateChange(transactionStates);
            }
            return {
                originUserTxReceipt,
                originMetaTxnReceipt,
                destinationMetaTxnReceipt,
            };
        },
    };
}
export function getExplorerUrl(txHash, chainId) {
    const chainsArray = Object.values(chains);
    for (const chain of chainsArray) {
        if (chain.id === chainId) {
            return `${chain.blockExplorers?.default?.url}/tx/${txHash}`;
        }
    }
    return "";
}
async function attemptSwitchChain(walletClient, desiredChainId) {
    try {
        // Check if the chain was switched successfully
        let currentChainId = await walletClient.getChainId();
        if (currentChainId === desiredChainId) {
            console.log("Chain already switched to:", desiredChainId);
            return;
        }
        console.log("Switching to chain:", desiredChainId, "currentChainId", currentChainId);
        await walletClient.switchChain({ id: desiredChainId });
        // Check if the chain was switched successfully
        currentChainId = await walletClient.getChainId();
        if (currentChainId !== desiredChainId) {
            throw new Error("Failed to switch chain");
        }
        console.log("Chain switched to:", desiredChainId);
    }
    catch (error) {
        console.error("Chain switch failed:", error);
        throw new Error(`Failed to switch chain: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
