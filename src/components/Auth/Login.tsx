"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import "./Auth.css"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isWalletLogin, setIsWalletLogin] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

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
      setLoginError(error)
    }
  }, [error])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (!email || !password) {
      setLoginError("Please enter both email and password")
      return
    }

    try {
      await auth.login({ email, password, rememberMe })
    } catch (err) {
      // Error will be handled by Redux
    }
  }

  const handleWalletLogin = async () => {
    setLoginError(null)
    try {
    //   await auth.connectWallet()
    } catch (err) {
      // Error will be handled by Redux
    }
  }

  const toggleLoginMethod = () => {
    setIsWalletLogin(!isWalletLogin)
    setLoginError(null)
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

        <h2 className="auth-title">{isWalletLogin ? "Connect Wallet" : "Welcome Back"}</h2>
        <p className="auth-subtitle">
          {isWalletLogin
            ? "Connect your wallet to access your account"
            : "Login to access your trading agents and dashboard"}
        </p>

        {loginError && <div className="auth-error">{loginError}</div>}

        {isWalletLogin ? (
          <div className="wallet-login-container">
            <button className="wallet-login-button" onClick={handleWalletLogin} disabled={loading}>
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
            <p className="wallet-description">Connect with MetaMask, WalletConnect, or other Ethereum wallets</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleEmailLogin}>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="auth-toggle-button" onClick={toggleLoginMethod}>
          {isWalletLogin ? "Login with Email" : "Login with Wallet"}
        </button> */}

        <p className="auth-redirect">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

