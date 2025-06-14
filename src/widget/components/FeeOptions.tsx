import { TokenImage } from "@0xsequence/design-system"
import { ChevronDown } from "lucide-react"
// biome-ignore lint/style/useImportType: False positive
import React, { useEffect, useMemo, useRef, useState } from "react"

// Constants for fee display
const SHOW_FEE_DISPLAY = false

// Simulated fee amounts and prices
const FEE_AMOUNTS = {
  ETH: "0.00001",
  USDC: "0.1",
}

const TOKEN_PRICES = {
  ETH: 3500, // Simulated ETH price in USD
  USDC: 1, // USDC is pegged to USD
}

interface FeeToken {
  name: string
  symbol: string
  imageUrl: string
}

interface FeeOptionsProps {
  options: FeeToken[]
  selectedOption?: FeeToken
  onSelect: (option: FeeToken) => void
  theme?: "light" | "dark"
}

export const FeeOptions: React.FC<FeeOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  theme = "light",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calculate USD value of fee
  const feeUsdValue = useMemo(() => {
    if (!selectedOption) return "0.00"
    const feeAmount = parseFloat(
      FEE_AMOUNTS[selectedOption.symbol as keyof typeof FEE_AMOUNTS] || "0",
    )
    const tokenPrice =
      TOKEN_PRICES[selectedOption.symbol as keyof typeof TOKEN_PRICES] || 0
    const usdValue = feeAmount * tokenPrice
    return usdValue.toFixed(2)
  }, [selectedOption])

  // Set first option as default if none selected
  useEffect(() => {
    if (!selectedOption && options.length > 0) {
      onSelect(options[0]!)
    }
  }, [selectedOption, options, onSelect])

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!SHOW_FEE_DISPLAY) {
    return null
  }

  return (
    <div className="space-y-1" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label
          className={`block text-xs font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Pay fee with
        </label>
        {selectedOption && (
          <div
            className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
          >
            Fee {FEE_AMOUNTS[selectedOption.symbol as keyof typeof FEE_AMOUNTS]}{" "}
            {selectedOption.symbol}
            <span
              className={`ml-1 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              ≈ ${feeUsdValue}
            </span>
          </div>
        )}
      </div>
      <div className="relative flex justify-start">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-32 flex items-center px-3 py-2 border rounded-[16px] hover:border-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {selectedOption ? (
            <>
              <TokenImage
                symbol={selectedOption.symbol}
                src={selectedOption.imageUrl}
                size="xs"
              />
              <span className="ml-1.5 flex-1 text-left">
                {selectedOption.symbol}
              </span>
            </>
          ) : (
            <span className="flex-1 text-left text-gray-400">
              Select Fee Token
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-400"
            } transition-transform ${
              isDropdownOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div
            className={`absolute z-10 mt-1 border rounded-[16px] shadow-lg w-32 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {options.map((option) => (
              <button
                key={option.symbol}
                type="button"
                onClick={() => {
                  onSelect(option)
                  setIsDropdownOpen(false)
                }}
                className={`w-full flex items-center px-3 py-2 cursor-pointer text-sm ${
                  theme === "dark"
                    ? selectedOption?.symbol === option.symbol
                      ? "bg-gray-700 text-white"
                      : "text-white hover:bg-gray-700"
                    : selectedOption?.symbol === option.symbol
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <TokenImage
                    symbol={option.symbol}
                    src={option.imageUrl}
                    size="xs"
                  />
                </div>
                <span className="ml-1.5">{option.symbol}</span>
                {selectedOption?.symbol === option.symbol && (
                  <span
                    className={`ml-auto ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    •
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FeeOptions
