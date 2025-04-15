// src/routes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Marketplace from "../pages/Marketplace/Marketplace";
import Sidebar from "../components/SideBar/SideBar";
import AgentBuilder from "../pages/AgentBuilder/AgentBuilder";
import Home from "../pages/Home/Home";
import LPDashboard from "../pages/LPDashboard/LPDashboard";
import About from "../pages/About/About";
import MyAgents from "../pages/AgentBuilder/MyAgents";
import History from "../pages/AgentBuilder/History";
import Settings from "../pages/AgentBuilder/Settings";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { useReduxActions, useReduxSelectors } from "../hooks/useReduxActions";
import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AgentCommission from "../components/AgentCommission/AgentCommission";
import AgentDetails from "../components/AgentDetails/AgentDetails";
import NewAgentBuilder from "../pages/AgentBuilder/NewAgentBuilder";
import Wallet from "../pages/AgentBuilder/Wallet";

const AppRoutes = () => {
  const { auth } = useReduxActions()
  const { auth: authSelectors } = useReduxSelectors()
  const { isAuthenticated } = authSelectors
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // useEffect(() => {
  //   // Check if there's a token in localStorage and try to authenticate
  //   const token = localStorage.getItem("auth_token")
  //   if (token && !isAuthenticated) {
  //     auth.fetchUserProfile()
  //   }
  // }, [auth, isAuthenticated])
  return (
    <Routes>
      {/* Marketplace route with Navbar */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}
      {/* <Route path="/" element={ <ProtectedRoute><Home /></ProtectedRoute>} /> */}
      <Route path="/" element={ <Home />} />
      <Route
        path="/marketplace"
        element={
          // <ProtectedRoute>
          <>
            <Navbar />
            <div className="marketplace-content">
              <Marketplace />
            </div>
          </>
          // </ProtectedRoute>
        }
      />

      {/* Agent Builder route with Sidebar */}
      <Route
        path="/agent-builder"
        element={
          <ProtectedRoute>
          <>
            <Sidebar />
            <div className="main-content">
              {/* <AgentBuilder /> */}
              <NewAgentBuilder/>
            </div>
          </>
           </ProtectedRoute>
        }
      />

     
      <Route path="/about" element={<About />} />
      <Route path="/wallets" element={
        <>
        <Navbar />
        <Wallet />
        </>
        } 
        />
      <Route path="/lp-dashboard" element={<LPDashboard />} />

      {/* Default redirect to marketplace */}
      <Route path="/marketplace" element={<Navigate to="/marketplace" replace />} />
       {/* Agent Commission route - Protected */}
       <Route
              path="/agent-commission/:agentId"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <div className="marketplace-content">
                      <AgentCommission />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />

      {/* Additional routes for agent builder dashboard */}
<Route path="/my-agents" element={<ProtectedRoute> <> <Sidebar /> <div className="main-content"><MyAgents /></div></></ProtectedRoute>}/>
<Route path="/history" element={<ProtectedRoute> <> <Sidebar /> <div className="main-content"><History /></div></></ProtectedRoute>}/>
<Route path="/settings" element={<ProtectedRoute> <> <Sidebar /> <div className="main-content"><Settings /></div></></ProtectedRoute>}/>
      {/* <Route path="/my-agents" element={<ProtectedRoute><MyAgents /></ProtectedRoute>}/> */}
      {/* <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>}/>
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/> */}
      {/* <Route path="/my-agents" element={<MyAgents />}/>
      <Route path="/history" element={<History />}/>
      <Route path="/settings" element={<Settings />}/> */}
       {/* Agent Details route - Protected */}
       <Route
              path="/agent-details/:agentId"
              element={
                <ProtectedRoute>
                  <>
                    <Sidebar />
                    <div className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                      <AgentDetails />
                    </div>
                  </>
                </ProtectedRoute>
              }
            />
      
      <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
          />
    
      
    </Routes>
  );
};

export default AppRoutes;
