"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SearchBar from "../SearchBar/SearchBar"
import { useToast } from "../Toast/Toast"
import "./CommissionedAgents.css"
import { useReduxActions, useReduxSelectors } from "../../hooks/useReduxActions"

// Define the commissioned agent type
interface CommissionedAgent {
    id: any;
    agentName: string;
    description: string | null;
    image: string;
    performance: number | null | any;
    aum: string;
    il: string;
    weeklyReward: string;
    tags: string[];
    timestamp: string; 
    duration: string;
    status: string;
    rebalanceCount: number;
    agentHistory: any[];
  }
  

const CommissionedAgents: React.FC = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [agents, setAgents] = useState<CommissionedAgent[]>([])

    const { history } = useReduxActions()
      const { history: historySelectors } = useReduxSelectors()
      
      const { myAgents } = useReduxActions()
      const { auth: authSelectors } = useReduxSelectors()
      const { isAuthenticated,userProfile } = authSelectors
    
      const {
        filteredItems,
        stats,
        error,
      } = historySelectors
    
  useEffect(() => {
    // Simulate API call to fetch commissioned agents
    const fetchCommissionedAgents = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const data = await history.fetchCommisonedHistoryItems(userProfile?.id||27)
        // setAgents(mockCommissionedAgents)
        setAgents(data.payload)
      } catch (error) {
        showToast("Failed to load commissioned agents", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchCommissionedAgents()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value)
  }

  // Filter agents based on search query and selected filter
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.agentName.toLowerCase().includes(searchQuery.toLowerCase()) 
    //   ||
    //   agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   agent.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    if (selectedFilter === "All") {
      return matchesSearch
    } else {
      return matchesSearch && agent.status === selectedFilter
    }
  })

  const handleViewDetails = (agentId: string) => {
    navigate(`/agent-commission/${agentId}`)
  }

  const handlePauseAgent = (agentId: string) => {
    showToast("Agent paused successfully", "warning")
    // In a real app, update the agent status in state after API call
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === agentId ? { ...agent, status: "Paused" as const } : agent)),
    )
  }

  const handleResumeAgent = (agentId: string) => {
    showToast("Agent resumed successfully", "success")
    // In a real app, update the agent status in state after API call
    setAgents((prevAgents) =>
      prevAgents.map((agent) => (agent.id === agentId ? { ...agent, status: "Active" as const } : agent)),
    )
  }

  const getPerformanceClass = (performance: string) => {
    const value = Number.parseFloat(performance)
    if (value > 0) return "positive"
    if (value < 0) return "negative"
    return ""
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Active":
        return "status-active"
      case "Paused":
        return "status-paused"
      case "Completed":
        return "status-completed"
      default:
        return ""
    }
  }

  // Calculate total stats
  const totalCommissioned = agents.length
//   const totalInvested = agents
//     .reduce((sum, agent) => {
//       const amount = Number.parseFloat(agent?.commissionAmount?.split(" ")[0] || "0")
//       return sum + amount
//     }, 0)
//     .toFixed(2)
const totalInvested = 0
  const activeAgents = agents.filter((agent) => agent.status === "Active").length

  return (
    <div className="commissioned-agents">
      <div className="commissioned-header">
        <h1>Commissioned Agents</h1>
      </div>

      <div className="commissioned-stats">
        <div className="stat-card">
          <h2>{totalCommissioned}</h2>
          <p>Total Commissioned</p>
        </div>
        <div className="stat-card">
          <h2>{activeAgents}</h2>
          <p>Active Agents</p>
        </div>
        <div className="stat-card">
          <h2>{totalInvested} ETH</h2>
          <p>Total Invested</p>
        </div>
        <div className="stat-card">
          <h2>0</h2>
          <p>Avg. Performance</p>
        </div>
      </div>

      <div className="commissioned-controls">
        <SearchBar onSearch={handleSearch} />

        <div className="filter-group">
          <label>Filter:</label>
          <select value={selectedFilter} onChange={handleFilterChange}>
            <option value="All">All Agents</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            {/* <option value="Completed">Completed</option> */}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading commissioned agents...</p>
        </div>
      ) : filteredAgents.length > 0 ? (
        <div className="commissioned-grid">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="commissioned-card">
              <div className="card-image">
                <img src={agent.image || "/placeholder.svg?height=160&width=400"} alt={agent.agentName} />
                <div className={`status-badge ${getStatusClass(agent.status)}`}>{agent.status}</div>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="agent-name">{agent.agentName}</h3>
                  <div className={`agent-performance ${getPerformanceClass(agent.performance)}`}>
                    {agent.performance}
                  </div>
                </div>

                {/* <p className="agent-description">{agent.description}</p> */}

                {/* <div className="agent-tags">
                  {agent.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div> */}

                <div className="agent-metrics">
                  <div className="metric">
                    <span className="metric-label">AUM:</span>
                    <span className="metric-value">{agent.aum}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Commissioned:</span>
                    <span className="metric-value">{new Date(agent.timestamp).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Amount:</span>
                    <span className="metric-value">{agent?.commissionAmount||0}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="view-button" onClick={() => handleViewDetails(agent.id)}>
                    View Details
                  </button>
                  {/* {agent.status === "Active" ? (
                    <button className="pause-button" onClick={() => handlePauseAgent(agent.id)}>
                      Pause Agent
                    </button>
                  ) : agent.status === "Paused" ? (
                    <button className="resume-button" onClick={() => handleResumeAgent(agent.id)}>
                      Resume Agent
                    </button>
                  ) : (
                    <button className="completed-button" disabled>
                      Completed
                    </button>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-agents">
          <p>No commissioned agents found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default CommissionedAgents
