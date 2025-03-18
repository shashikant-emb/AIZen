import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Marketplace from './components/Marketplace/Marketplace'
import Sidebar from './components/SideBar/SideBar'
import AgentBuilder from './components/AgentBuilder/AgentBuilder'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Marketplace routes with Navbar */}
          <Route
            path="/marketplace"
            element={
              <>
                <Navbar />
                <div className="marketplace-content">
                  <Marketplace />
                </div>
              </>
            }
          />

          {/* Agent Builder routes with Sidebar */}
          <Route
            path="/agent-builder"
            element={
              <>
                <Sidebar />
                <div className="main-content">
                  <AgentBuilder />
                </div>
              </>
            }
          />

          {/* Default redirect to marketplace */}
          <Route path="/" element={<Navigate to="/marketplace" replace />} />

          {/* Additional routes can be added here */}
          <Route
            path="/my-agents"
            element={
              <>
                <Sidebar />
                <div className="main-content">
                  <h1 className="placeholder-content">My Agents</h1>
                </div>
              </>
            }
          />

          <Route
            path="/history"
            element={
              <>
                <Sidebar />
                <div className="main-content">
                  <h1 className="placeholder-content">History</h1>
                </div>
              </>
            }
          />

          <Route
            path="/settings"
            element={
              <>
                <Sidebar />
                <div className="main-content">
                  <h1 className="placeholder-content">Settings</h1>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}
export default App
