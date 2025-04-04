"use client"

import  React from "react"
import { useToast } from "./Toast"
import "./ToastDemo.css"

const ToastDemo: React.FC = () => {
  const { showToast } = useToast()

  const handleShowSuccessToast = () => {
    showToast("Operation completed successfully!", "success")
  }

  const handleShowErrorToast = () => {
    showToast("An error occurred. Please try again.", "error")
  }

  const handleShowInfoToast = () => {
    showToast("This is an informational message.", "info")
  }

  const handleShowWarningToast = () => {
    showToast("Warning: This action cannot be undone.", "warning")
  }

  const handleShowCustomDurationToast = () => {
    showToast("This toast will disappear in 10 seconds.", "info", 10000)
  }

  return (
    <div className="toast-demo">
      <h2>Toast Notification Demo</h2>
      <p>Click the buttons below to see different types of toast notifications.</p>

      <div className="toast-demo-buttons">
        <button className="toast-demo-button success" onClick={handleShowSuccessToast}>
          Success Toast
        </button>
        <button className="toast-demo-button error" onClick={handleShowErrorToast}>
          Error Toast
        </button>
        <button className="toast-demo-button info" onClick={handleShowInfoToast}>
          Info Toast
        </button>
        <button className="toast-demo-button warning" onClick={handleShowWarningToast}>
          Warning Toast
        </button>
        <button className="toast-demo-button custom" onClick={handleShowCustomDurationToast}>
          Custom Duration (10s)
        </button>
      </div>
    </div>
  )
}

export default ToastDemo

