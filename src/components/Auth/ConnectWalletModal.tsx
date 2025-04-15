"use client"

import React from "react"
import { useEffect } from "react"
import { useReduxActions } from "../../hooks/useReduxActions"
import "./ConnectWalletModal.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose }) => {
  const { auth } = useReduxActions()

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const handleConnectWallet = async () => {
    try {
      await auth.connectWallet()
      onClose()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>Connect Wallet</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-logo">
            <div className="logo-icon">
              <div className="logo-square"></div>
            </div>
            <h1>AIZen</h1>
          </div>

          <p className="auth-description">
            Connect your wallet to access the AIZen platform and manage your agents.
          </p>
          <ConnectButton accountStatus="avatar" />
          {/* <div className="wallet-options">
            <button className="wallet-option-button metamask" onClick={handleConnectWallet}>
              <div className="wallet-icon">🦊</div>
              <span>MetaMask</span>
            </button>

            <button className="wallet-option-button walletconnect" onClick={handleConnectWallet}>
              <div className="wallet-icon">🔗</div>
              <span>WalletConnect</span>
            </button>

            <button className="wallet-option-button coinbase" onClick={handleConnectWallet}>
              <div className="wallet-icon">🪙</div>
              <span>Coinbase Wallet</span>
            </button>
          </div> */}

          <div className="auth-footer">
            <p>
              By connecting your wallet, you agree to our{" "}
              <a href="#" className="terms-link">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectWalletModal
