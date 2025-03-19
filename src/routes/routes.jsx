// src/routes.js
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Marketplace from "../pages/Marketplace/Marketplace";
import Sidebar from "../components/SideBar/SideBar";
import AgentBuilder from "../pages/AgentBuilder/AgentBuilder";
import Home from "../pages/Home/home";
import LPDashboard from "../pages/LPDashboard/LPDashboard";
import About from "../pages/About/About";
import MyAgents from "../pages/AgentBuilder/MyAgents";
import History from "../pages/AgentBuilder/History";
import Settings from "../pages/AgentBuilder/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Marketplace route with Navbar */}
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

      {/* Agent Builder route with Sidebar */}
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

      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/lp-dashboard" element={<LPDashboard />} />

      {/* Default redirect to marketplace */}
      <Route path="/marketplace" element={<Navigate to="/marketplace" replace />} />

      {/* Additional routes for agent builder dashboard */}
      <Route path="/my-agents" element={<MyAgents />}/>
      <Route path="/history" element={<History />}/>
      <Route path="/settings" element={<Settings />}/>
      

    
      
    </Routes>
  );
};

export default AppRoutes;
