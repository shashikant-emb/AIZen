import React from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate("/home")}>
        <div className="logo-icon">
          <div className="logo-square"></div>
        </div>
        <h1>AIZen</h1>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/marketplace" 
          className={`nav-item ${location.pathname === "/marketplace" ? "active" : ""}`}
        >
          <span className="nav-icon">□</span>
          <span>Home</span>
        </Link>
        <Link 
          to="/agent-builder" 
          className={`nav-item ${location.pathname === "/agent-builder" ? "active" : ""}`}
        >
          <span className="nav-icon">□</span>
          <span>Agent Builder</span>
        </Link>
        <Link 
          to="/my-agents" 
          className={`nav-item ${location.pathname === "/my-agents" ? "active" : ""}`}
        >
          <span className="nav-icon">□</span>
          <span>My Agents</span>
        </Link>
        <Link 
          to="/history" 
          className={`nav-item ${location.pathname === "/history" ? "active" : ""}`}
        >
          <span className="nav-icon">□</span>
          <span>History</span>
        </Link>
        <Link 
          to="/settings" 
          className={`nav-item ${location.pathname === "/settings" ? "active" : ""}`}
        >
          <span className="nav-icon">□</span>
          <span>Settings</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        {/* <div className="made-with">Made with AIZen</div> */}
      </div>
    </div>
  );
};

export default Sidebar;
