// biome-ignore lint/style/useImportType: Need to use React
import React, { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { injected } from "wagmi/connectors"

// import MetaMaskFox from '../assets/MetaMask_Fox.svg'

interface WalletConfig {
  name: string
  connector: () => any
}

const WALLET_CONFIGS: Record<string, WalletConfig> = {
  metamask: {
    name: "MetaMask",
    connector: injected,
  },
  // Add more wallet configurations here as needed
}

const DEFAULT_WALLET_OPTIONS = ["metamask"]

interface ConnectWalletProps {
  onConnect: () => void
  theme?: "light" | "dark"
  walletOptions?: string[] // Array of wallet IDs like ['metamask', 'coinbase', etc]
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  onConnect,
  theme = "light",
  walletOptions = DEFAULT_WALLET_OPTIONS,
}) => {
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address, connector } = useAccount()
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    try {
      setError(null)
      const config = WALLET_CONFIGS[walletId]
      if (!config) {
        setError(`No configuration found for wallet: ${walletId}`)
        return
      }
      await connect({ connector: config.connector() })
      console.log(`Connected to ${config.name}`)
    } catch (error) {
      console.error("Failed to connect:", error)
      setError(
        error instanceof Error ? error.message : "Failed to connect wallet",
      )
    }
  }

  const handleDisconnect = () => {
    try {
      setError(null)
      disconnect()
    } catch (error) {
      console.error("Failed to disconnect:", error)
      setError(
        error instanceof Error ? error.message : "Failed to disconnect wallet",
      )
    }
  }

  // Filter out any invalid wallet IDs and use defaults if none provided
  const availableWallets = (walletOptions || DEFAULT_WALLET_OPTIONS).filter(
    (id) => WALLET_CONFIGS[id],
  )

  // If no valid wallet options are available, show a simple message
  if (!availableWallets.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center relative">
          <h2
            className={`text-lg font-semibold w-full text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Connect a Wallet
          </h2>
        </div>
        <div
          className={`text-center p-4 rounded-lg ${
            theme === "dark"
              ? "text-gray-300 bg-gray-800"
              : "text-gray-600 bg-gray-50"
          }`}
        >
          Please connect wallet in dapp
        </div>
      </div>
    )
  }

  const getWalletButtonStyle = (walletId: string) => {
    switch (walletId) {
      case "metamask":
        return "bg-orange-500 hover:bg-orange-600"
      // Add more cases for other wallets here
      default:
        return theme === "dark"
          ? "bg-blue-600 hover:bg-blue-700"
          : "bg-blue-500 hover:bg-blue-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center relative">
        <h2
          className={`text-lg font-semibold w-full text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Connect a Wallet
        </h2>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-2xl ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
          >
            <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>
              Connected with {connector?.name}
            </p>
            <p
              className={theme === "dark" ? "text-white" : "text-gray-900"}
              style={{ wordBreak: "break-all" }}
            >
              {address}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {error && (
              <div
                className={`border rounded-lg p-4 ${
                  theme === "dark"
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p
                  className={`text-sm break-words ${theme === "dark" ? "text-red-200" : "text-red-600"}`}
                >
                  {error}
                </p>
              </div>
            )}
            <button
              onClick={onConnect}
              className={`w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Continue
            </button>
            <button
              onClick={handleDisconnect}
              className={`w-full cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors border ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                  : "bg-white hover:bg-gray-50 text-gray-900 border-gray-200"
              }`}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {error && (
            <div
              className={`border rounded-lg p-4 ${
                theme === "dark"
                  ? "bg-red-900/20 border-red-800"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <p
                className={`text-sm break-words ${theme === "dark" ? "text-red-200" : "text-red-600"}`}
              >
                {error}
              </p>
            </div>
          )}
          {availableWallets.map((walletId) => {
            const config = WALLET_CONFIGS[walletId]
            if (!config) {
              return null
            }
            return (
              <button
                key={walletId}
                onClick={() => handleConnect(walletId)}
                className={`w-full flex items-center justify-center space-x-2 cursor-pointer font-semibold py-3 px-4 rounded-[24px] transition-colors ${getWalletButtonStyle(walletId)} text-white`}
              >
                <span>{config.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
