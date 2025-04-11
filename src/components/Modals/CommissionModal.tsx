// "use client"

// import React from "react"
// import { useState, useEffect } from "react"
// import "./Modal.css"

// interface CommissionModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onConfirm: (amount: number) => void
//   agentName: string
//   walletBalance: string
// }

// const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, onConfirm, agentName, walletBalance }) => {
//   const [amount, setAmount] = useState<string>("")
//   const [error, setError] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Reset state when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setAmount("")
//       setError(null)
//       setIsSubmitting(false)
//     }
//   }, [isOpen])

//   // Close modal on escape key
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === "Escape" && isOpen) {
//         onClose()
//       }
//     }

//     window.addEventListener("keydown", handleEscape)
//     return () => window.removeEventListener("keydown", handleEscape)
//   }, [isOpen, onClose])

//   // Prevent background scrolling when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "auto"
//     }
//     return () => {
//       document.body.style.overflow = "auto"
//     }
//   }, [isOpen])

//   const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value
//     // Allow only numbers and decimals
//     if (/^(\d*\.?\d*)$/.test(value) || value === "") {
//       setAmount(value)
//       setError(null)
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validate amount
//     if (!amount || Number.parseFloat(amount) <= 0) {
//       setError("Please enter a valid amount")
//       return
//     }

//     // Convert wallet balance to number for comparison
//     const balanceStr = walletBalance.replace(/[^0-9.]/g, "")
//     const balance = Number.parseFloat(balanceStr)
//     const amountValue = Number.parseFloat(amount)

//     if (amountValue > balance) {
//       setError("Insufficient wallet balance")
//       return
//     }

//     setIsSubmitting(true)

//     // Call onConfirm with the amount
//     onConfirm(amountValue)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-container" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h2>Commission Agent</h2>
//           <button className="modal-close-button" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <div className="modal-content">
//           <p className="modal-description">
//             You are about to commission <strong>{agentName}</strong>. Please specify how much ETH you want to lock for
//             this agent.
//           </p>

//           <div className="wallet-info">
//             <div className="wallet-balance">
//               <span className="balance-label">Available Balance:</span>
//               <span className="balance-value">{walletBalance}</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="commission-form">
//             <div className="form-group">
//               <label htmlFor="amount">Amount to Lock (ETH)</label>
//               <div className="amount-input-container">
//                 <input
//                   type="text"
//                   id="amount"
//                   value={amount}
//                   onChange={handleAmountChange}
//                   placeholder="0.00"
//                   autoFocus
//                 />
//                 <span className="currency-label">ETH</span>
//               </div>
//               {error && <p className="error-message">{error}</p>}
//             </div>

//             <div className="commission-info">
//               <p>
//                 <strong>Note:</strong> The specified amount will be locked in the agent's contract and used for trading
//                 operations. You can withdraw your funds at any time by stopping the agent.
//               </p>
//             </div>

//             <div className="modal-actions">
//               <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
//                 Cancel
//               </button>
//               <button type="submit" className="confirm-button gradient-button" disabled={isSubmitting}>
//                 {isSubmitting ? "Processing..." : "Confirm Commission"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CommissionModal

"use client"

import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "./Modal.css"

interface CommissionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (amount: any) => void
  agentName: string
  walletBalance: any
}

const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose, onConfirm, agentName, walletBalance }) => {
  const [amount, setAmount] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setError(null)
      setIsSubmitting(false)
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^(\d*\.?\d*)$/.test(value) || value === "") {
      setAmount(value)
      setError(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // const balanceStr = walletBalance.replace(/[^0-9.]/g, "")
    const balanceStr = walletBalance
    const balance = Number.parseFloat(balanceStr)
    const amountValue = Number.parseFloat(amount)

    if (amountValue > balance) {
      setError("Insufficient wallet balance")
      return
    }

    setIsSubmitting(true)

    onConfirm(amountValue)
  }

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Commission Agent</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            You are about to commission <strong>{agentName}</strong>. Please specify how much ETH you want to lock for this agent.
          </p>

          <div className="wallet-info">
            <div className="wallet-balance">
              <span className="balance-label">Available Balance:</span>
              <span className="balance-value">{walletBalance}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="commission-form">
            <div className="form-group">
              <label htmlFor="amount">Amount to Lock (ETH)</label>
              <div className="amount-input-container">
                <input type="text" id="amount" value={amount} onChange={handleAmountChange} placeholder="0.00" autoFocus />
                <span className="currency-label">ETH</span>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>

            <div className="commission-info">
              <p><strong>Note:</strong> The specified amount will be locked in the agent's contract and used for Agent operations. You can withdraw your funds at any time by stopping the agent.</p>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>Cancel</button>
              <button type="submit" className="confirm-button gradient-button" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Confirm Commission"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body // Render the modal outside the parent component
  )
}

export default CommissionModal
