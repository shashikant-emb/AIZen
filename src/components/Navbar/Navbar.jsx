import  React from "react"
import "./Navbar.css"
import { Link } from "react-router-dom"

const Navbar =() => {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon">
            <div className="logo-square"></div>
          </div>
          <h1>AIZen</h1>
        </div>
  
        <div className="navbar-links">
          <Link to="/marketplace" className="nav-link">
            Home
          </Link>
          <Link to="/marketplace" className="nav-link active">
            Marketplace
          </Link>
          <Link to="/agent-builder" className="nav-link">
            Agent Builder
          </Link>
          <Link to="/marketplace" className="nav-link">
            LP Dashboard
          </Link>
          <Link to="/marketplace" className="nav-link">
            About
          </Link>
        </div>
  
        <div className="navbar-actions">
          <button className="gradient-button">
            <span className="wallet-icon">□</span>
            Connect Wallet
          </button>
          <div className="avatar"></div>
        </div>
      </nav>
    )
  }

export default Navbar