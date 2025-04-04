"use client"

import  React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import "./Toast.css"

// Define toast types
export type ToastType = "success" | "error" | "info" | "warning"

// Define toast item structure
export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
}

// Define toast context interface
interface ToastContextProps {
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastType, duration?: number) => void
  hideToast: (id: string) => void
}

// Create toast context
const ToastContext = createContext<ToastContextProps | undefined>(undefined)

// Toast provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Function to show a toast
  const showToast = useCallback((message: string, type: ToastType = "info", duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }])
  }, [])

  // Function to hide a toast
  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Toast container component
const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast()

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  )
}

// Individual toast item component
const ToastItem: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, toast.duration)

    return () => clearTimeout(timer)
  }, [toast.duration, onClose])

  // Get icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="toast-icon" />
      case "error":
        return <AlertCircle className="toast-icon" />
      case "warning":
        return <AlertTriangle className="toast-icon" />
      case "info":
        return <Info className="toast-icon" />
      default:
        return <Info className="toast-icon" />
    }
  }

  return (
    <div className={`toast-item toast-${toast.type}`}>
      <div className="toast-content">
        <div className="toast-icon-container">{getIcon()}</div>
        <div className="toast-message">{toast.message}</div>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X size={18} />
      </button>
      <div
        className="toast-progress"
        style={{
          animationDuration: `${toast.duration}ms`,
        }}
      />
    </div>
  )
}

// Default export
export default ToastProvider

