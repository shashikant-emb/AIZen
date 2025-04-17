"use client"

import  React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Home, PieChart, Users, History, Settings, LogOut } from "lucide-react"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"
import "./SideBar.css"
import { formatUserName } from "../../utils/formatUserName"

const Sidebar= () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { auth } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { userProfile } = authSelectors
  
  // Check if screen is mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setCollapsed(window.innerWidth <= 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}

      {/* Mobile toggle button */}
      <button className="sidebar-mobile-toggle" onClick={toggleSidebar}>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* <div className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}> */}
      <div className={`sidebar ${collapsed && !mobileOpen ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>

        <div className="sidebar-logo">
          <div className="logo-icon">
            <div className="logo-square"></div>
          </div>
          <h1>AIZen</h1>
        </div>

        <nav className="sidebar-nav">
          {/* <Link to="/marketplace" className={`nav-item ${isActive("/marketplace") ? "active" : ""}`}>
            <span className="nav-icon">
              <Home size={20} />
            </span>
            <span className="nav-text">Home</span>
          </Link> */}
          <Link to="/agent-builder" className={`nav-item ${isActive("/agent-builder") ? "active" : ""}`}>
            <span className="nav-icon">
              <PieChart size={20} />
            </span>
            <span className="nav-text">Agent Builder</span>
          </Link>
          <Link to="/my-agents" className={`nav-item ${isActive("/my-agents") ? "active" : ""}`}>
            <span className="nav-icon">
              <Users size={20} />
            </span>
            <span className="nav-text">My Agents</span>
          </Link>
          {/* <Link to="/history" className={`nav-item ${isActive("/history") ? "active" : ""}`}>
            <span className="nav-icon">
              <History size={20} />
            </span>
            <span className="nav-text">History</span>
          </Link> */}
          <Link to="/settings" className={`nav-item ${isActive("/settings") ? "active" : ""}`}>
            <span className="nav-icon">
              <Settings size={20} />
            </span>
            <span className="nav-text">Wallet</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          {/* {userProfile && (
            <div className="user-info">
              <div className="user-avatar">
              {formatUserName(userProfile?.name || "")}
              </div>
              <div className="user-details">
                <span className="user-name">{userProfile?.name}</span>
                <span className="user-email">{userProfile?.email}</span>
              </div>
            </div>
          )}

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={18} />
            <span className="logout-text">Logout</span>
          </button> */}

          <div className="sidebar-collapse-toggle" onClick={toggleSidebar}>
            {collapsed ? "→" : "←"}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar