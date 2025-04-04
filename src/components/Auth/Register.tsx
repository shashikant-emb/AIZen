"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import "./Auth.css"

const Register: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isWalletRegister, setIsWalletRegister] = useState(false)
  const [registerError, setRegisterError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { auth } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated, loading, error } = authSelectors

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Set error message from Redux state
    if (error) {
      setRegisterError(error)
    }
  }, [error])

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError(null)

    if (!name || !email || !password || !confirmPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setRegisterError("Passwords do not match")
      return
    }

    if (!agreeTerms) {
      setRegisterError("You must agree to the Terms and Conditions")
      return
    }

    try {
      await auth.register({ name, email, password })
    } catch (err) {
      // Error will be handled by Redux
    }
  }

  const handleWalletRegister = async () => {
    setRegisterError(null)

    if (!name) {
      setRegisterError("Please enter your name")
      return
    }

    if (!agreeTerms) {
      setRegisterError("You must agree to the Terms and Conditions")
      return
    }

    try {
      await auth.registerWithWallet({ name })
    } catch (err) {
      // Error will be handled by Redux
    }
  }

  const toggleRegisterMethod = () => {
    setIsWalletRegister(!isWalletRegister)
    setRegisterError(null)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-icon">
            <div className="logo-square"></div>
          </div>
          <h1>AIZen</h1>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join AIZen to start building and deploying trading agents</p>

        {registerError && <div className="auth-error">{registerError}</div>}

        {isWalletRegister ? (
          <div className="wallet-register-container">
            <div className="form-group">
              <label htmlFor="wallet-name">Your Name</label>
              <input
                type="text"
                id="wallet-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-options terms-container">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="wallet-terms"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <label htmlFor="wallet-terms">
                  I agree to the{" "}
                  <Link to="/terms" className="terms-link">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>

            <button className="wallet-login-button" onClick={handleWalletRegister} disabled={loading}>
              {loading ? "Connecting..." : "Register with Wallet"}
            </button>
            <p className="wallet-description">Connect with MetaMask, WalletConnect, or other Ethereum wallets</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleEmailRegister}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-options terms-container">
              <div className="remember-me">
                <input type="checkbox" id="terms" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <Link to="/terms" className="terms-link">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="auth-toggle-button" onClick={toggleRegisterMethod}>
          {isWalletRegister ? "Register with Email" : "Register with Wallet"}
        </button> */}

        <p className="auth-redirect">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

