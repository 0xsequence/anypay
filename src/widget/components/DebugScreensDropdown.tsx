import { ChevronDown } from "lucide-react" // biome-ignore lint/style/useImportType: False positive
import React, { useEffect, useRef, useState } from "react"

interface DebugScreensDropdownProps {
  onScreenSelect: (screen: string) => void
  theme?: "light" | "dark"
}

const SCREENS = ["Connect", "Tokens", "Send", "Pending", "Receipt"] as const

const checkDebugParam = () =>
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("debug") === "true"

export const DebugScreensDropdown: React.FC<DebugScreensDropdownProps> = ({
  onScreenSelect,
  theme = "light",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldShow, setShouldShow] = useState(checkDebugParam())
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleUrlChange = () => {
      setShouldShow(checkDebugParam())
    }

    // Check on popstate (back/forward navigation)
    window.addEventListener("popstate", handleUrlChange)

    // Check on pushState/replaceState
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function () {
      // biome-ignore lint/complexity/noArguments: TODO: To fix
      originalPushState.apply(this, arguments as any)
      handleUrlChange()
    }

    window.history.replaceState = function () {
      // biome-ignore lint/complexity/noArguments: TODO: To fix
      originalReplaceState.apply(this, arguments as any)
      handleUrlChange()
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("popstate", handleUrlChange)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [])

  if (!shouldShow) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded-full hover:bg-opacity-10 ${
          theme === "dark"
            ? "hover:bg-white text-gray-400"
            : "hover:bg-black text-gray-500"
        }`}
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute bottom-full right-0 mb-1 w-40 border rounded-lg shadow-lg overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {SCREENS.map((screen) => (
            <button
              key={screen}
              onClick={() => {
                onScreenSelect(screen)
                setIsOpen(false)
              }}
              className={`w-full text-left px-3 py-2 text-sm ${
                theme === "dark"
                  ? "text-gray-200 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {screen}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DebugScreensDropdown
